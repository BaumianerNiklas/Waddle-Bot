import type { ICommand } from "#types";
import { ApplicationCommandData, Collection, Snowflake } from "discord.js";
import { join } from "path";
import { readdirSync, lstatSync } from "fs";
import BaseCommand from "#structures/BaseCommand.js";
import type WaddleBot from "./WaddleBot";
import { commandOptionRegex, commandTypeRegex, commandOptionTypes } from "#util/constants.js";
import logger from "#util/logger.js";

export default class CommandHandler {
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

				const commandModule = (await import(join(path, file))).default;
				if (!(commandModule.prototype instanceof BaseCommand)) continue;

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
		// TODO: make this not horrible

		return JSON.parse(
			JSON.stringify({
				name: command.name,
				type: command.type ?? 1,
				description: command.description,
				options: command.options?.filter((o) => o != undefined) || [],
				defaultPermission: command.defaultPermission ?? true,
			})
				.replace(commandOptionRegex, (str) => commandOptionTypes[str].toString())
				.replace(commandTypeRegex, (str) => commandOptionTypes[str].toString())
		);
	}
}
