import type { ICommand, ICommandOption } from "#types";
import { ApplicationCommandData, Collection, Constants } from "discord.js";
import { join } from "node:path";
import { BaseCommand } from "#structures/BaseCommand.js";
import type { WaddleBot } from "./WaddleBot";
import { logger } from "#util/logger.js";
import { readdir, lstat } from "node:fs/promises";

export class CommandHandler {
	commands: Collection<string, ICommand>;
	APICommands: ApplicationCommandData[];

	constructor() {
		this.commands = new Collection();
		this.APICommands = [];
	}

	public async registerCommands(path = "./dist/commands") {
		const files = await readdir(path);
		for (const file of files) {
			const stat = await lstat(join(path, file));
			if (stat.isDirectory()) {
				await this.registerCommands(join(path, file));
			} else {
				if (!file.endsWith("js")) continue;

				const commandModule = (await import(join("../..", path, file))).Command;
				if (!commandModule || !(commandModule.prototype instanceof BaseCommand)) {
					logger.warn(`${file} has no exported member 'Command' that extends 'BaseCommand'`);
					continue;
				}

				const command: ICommand = new commandModule();
				this.commands?.set(command.name, command);
				logger.debug(`Command loaded: ${command.name} [${file}]`);
			}
		}
	}

	registerAPICommands() {
		this.APICommands = this.commands.map((c) => this.transformCommand(c));
	}

	public async deploy(bot: WaddleBot, destination: string) {
		if (!this.APICommands.length) this.registerAPICommands();

		try {
			if (destination === "global") {
				bot.logger.debug(`Deploying ${this.APICommands.length} commands globally...`);
				await bot.application?.commands.set(this.APICommands!);
			} else {
				bot.logger.debug(`Deploying ${this.APICommands.length} commands to guild ${destination}...`);

				const guild = bot.guilds.cache.get(destination) ?? (await bot.guilds.fetch(destination));
				await guild.commands.set(this.APICommands!);
				console.table(this.APICommands);
			}
			bot.logger.info("Deployed successfully.");
		} catch (error) {
			console.log(error);
			bot.logger.error("Something went wrong while trying to deploy, did not deploy.", error);
		}
	}

	public transformCommand(command: ICommand): ApplicationCommandData {
		return {
			name: command.name,
			type: Constants.ApplicationCommandTypes[command.type ?? "CHAT_INPUT"],
			description: command.description ?? "",
			options: command.options?.map((o) => this.transformOption(o)),
			defaultPermission: command.defaultPermission ?? true,
		};
	}

	// TODO: fix return type parameter
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public transformOption(option: ICommandOption): any {
		return {
			type: Constants.ApplicationCommandOptionTypes[option.type],
			name: option.name,
			description: option.description,
			required: option.required,
			choices: option.choices,
			options: "options" in option ? option.options?.map((o) => this.transformOption(o)) : [],
			channel_types: option.channelTypes?.map((cht) => Constants.ChannelTypes[cht]),
		};
	}
}
