import * as dotenv from "dotenv";
dotenv.config();

import { logger } from "#util/logger.js";
import { Options, Partials, GatewayIntentBits as Intents } from "discord.js";
import { IubusClient, container } from "iubus";
import type { Logger } from "pino";

const client = new IubusClient({
	dirs: {
		commands: "./dist/commands",
		events: "./dist/events",
	},
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

container.logger = logger;
client.login(process.env.BOT_TOKEN);

declare module "iubus" {
	interface Container {
		logger: Logger;
	}
}
