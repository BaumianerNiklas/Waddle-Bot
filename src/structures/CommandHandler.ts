import type { ICommand, ICommandOption } from "#types";
import { ApplicationCommandData, Collection, Snowflake } from "discord.js";
import { join } from "path";
import { readdirSync, lstatSync } from "fs";
import { BaseCommand } from "#structures/BaseCommand.js";
import type { WaddleBot } from "./WaddleBot";
import { COMMAND_OPTION_TYPES, COMMAND_TYPES } from "#constants";
import { logger } from "#util/logger.js";

export class CommandHandler {
	commands: Collection<string, ICommand>;
	APICommands: ApplicationCommandData[];

	constructor() {
		this.commands = new Collection();
		this.APICommands = [];
	}

	public async registerCommands(path: string = join(process.env.BASE_PATH!, "dist/commands")) {
		const files = readdirSync(path);
		for (const file of files) {
			const lstat = lstatSync(join(path, file));
			if (lstat.isDirectory()) {
				await this.registerCommands(join(path, file));
			} else {
				if (!file.endsWith("js")) continue;

				const commandModule = (await import(join(path, file))).Command;
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

	public async deploy(bot: WaddleBot, destination: Snowflake | "global") {
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
			bot.logger.error(`Something went wrong while trying to deploy, did not deploy.`, error);
		}
	}

	public transformCommand(command: ICommand): ApplicationCommandData {
		return {
			name: command.name,
			type: COMMAND_TYPES[command.type ?? "CHAT_INPUT"],
			description: command.description,
			options: command.options?.map((o) => this.transformOption(o)),
			defaultPermission: command.defaultPermission ?? true,
		};
	}

	// TODO: fix return type parameter
	public transformOption(option: ICommandOption): any {
		return {
			...option,
			type: COMMAND_OPTION_TYPES[option.type],
			options: "options" in option ? option.options?.map((o) => this.transformOption(o)) : [],
		};
	}
}
