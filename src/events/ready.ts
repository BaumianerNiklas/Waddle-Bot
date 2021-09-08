import { BaseEvent } from "#structures/BaseEvent.js";
import type { WaddleBot } from "#structures/WaddleBot.js";
import type { Snowflake } from "discord.js";

export class Event extends BaseEvent {
	constructor() {
		super({
			name: "ready",
			once: true,
		});
	}

	async run(bot: WaddleBot) {
		if (process.argv[2] === "-D") {
			bot.commandHandler.deploy(bot, (process.argv[3]?.toLowerCase() ?? "859164137187967006") as Snowflake);
		}
		bot.user?.setPresence({ activities: [{ name: "being cute", type: "COMPETING" }] });
		bot.logger.info(`Logged in as ${bot.user!.tag}.`);
	}
}
