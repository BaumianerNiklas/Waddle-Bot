import { BaseEvent } from "#structures/BaseEvent.js";
import type { WaddleBot } from "#structures/WaddleBot.js";
import { ActivityType } from "discord.js";

export class Event extends BaseEvent {
	constructor() {
		super({
			name: "ready",
			once: true,
		});
	}

	async run(bot: WaddleBot) {
		bot.user?.setPresence({ activities: [{ name: "being cute", type: ActivityType.Competing }] });
		bot.logger.info(`Logged in as ${bot.user!.tag}.`);
	}
}
