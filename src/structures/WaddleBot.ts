import { Client, ClientOptions, GatewayIntentBits as Intents, Options, Partials } from "discord.js";
import { CommandHandler } from "./CommandHandler.js";
import { logger } from "#util/logger.js";
import type { default as Pino } from "pino";
import { readdir } from "node:fs/promises";
import { BaseEvent } from "./BaseEvent.js";
import { IEvent } from "#types";

export class WaddleBot extends Client {
	commandHandler: CommandHandler;
	logger: Pino.Logger;

	constructor(options?: ClientOptions) {
		super({
			...options,
			intents: [Intents.Guilds, Intents.GuildMessages, Intents.DirectMessages],
			partials: [Partials.Channel],
			makeCache: Options.cacheWithLimits({
				...Options.DefaultMakeCacheSettings,
				MessageManager: 0,
				BaseGuildEmojiManager: 0,
				GuildBanManager: 0,
				GuildInviteManager: 0,
				GuildStickerManager: 0,
				PresenceManager: 0,
				ReactionManager: 0,
				ReactionUserManager: 0,
				StageInstanceManager: 0,
				ThreadManager: 0,
				ThreadMemberManager: 0,
			}),
		});

		this.commandHandler = new CommandHandler();
		this.logger = logger;
	}

	private async registerEvents() {
		const eventFiles = (await readdir("./dist/events")).filter((f) => f.endsWith(".js"));

		this.logger.debug("Starting to load events...");

		for (const file of eventFiles) {
			const eventModule = (await import(`../events/${file}`)).Event;
			if (!eventModule || !(eventModule.prototype instanceof BaseEvent)) {
				this.logger.warn(`${file} has no exported member 'Event' that extends 'BaseEvent'`);
				continue;
			}
			const event: IEvent = new eventModule();

			if (event.once) {
				this.once(event.name, async (...args) => void (await event.run!(this, ...args)));
			} else {
				this.on(event.name, async (...args) => void (await event.run!(this, ...args)));
			}

			this.logger.debug(`Event loaded: ${event.name} [${file}]`);
		}
		this.logger.debug(`Finished loading ${eventFiles.length} events`);
	}

	async init() {
		await this.registerEvents();
		await this.commandHandler.registerCommands();
		await this.login(process.env.BOT_TOKEN);
	}
}
