import { Client, ClientOptions, Intents } from "discord.js";
import CommandHandler from "./CommandHandler.js";
import logger from "#util/logger.js";
import type { default as Pino } from "pino";
import { readdirSync } from "fs";
import { join } from "path";

export default class WaddleBot extends Client {
	commandHandler: CommandHandler;
	logger: Pino.Logger;

	constructor(options?: ClientOptions) {
		super({
			...options,
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
			partials: ["CHANNEL"],
		});

		this.commandHandler = new CommandHandler();
		this.logger = logger;
	}

	private async registerEvents() {
		const eventFiles = readdirSync(join(process.env.BASE_PATH!, "dist/events")).filter((f) => f.endsWith(".js"));

		this.logger.debug(`Loading ${eventFiles.length} events...`);

		for (const file of eventFiles) {
			const EventModule = await import(`../events/${file}`);
			const Event = EventModule.default;
			const event = new Event();

			if (event.once) {
				this.once(event.name, async (...args) => await event.run(this, ...args));
			} else {
				this.on(event.name, async (...args) => await event.run(this, ...args));
			}

			this.logger.debug("Event Loaded: " + file);
		}
	}

	async init() {
		await this.registerEvents();
		await this.commandHandler.registerCommands();
		await this.login(process.env.BOT_TOKEN);
	}
}
