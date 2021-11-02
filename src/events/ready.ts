import { BaseEvent } from "#structures/BaseEvent.js";
import type { WaddleBot } from "#structures/WaddleBot.js";

export class Event extends BaseEvent {
	constructor() {
		super({
			name: "ready",
			once: true,
		});
	}

	async run(bot: WaddleBot) {
		bot.user?.setPresence({ activities: [{ name: "being cute", type: "COMPETING" }] });
		bot.logger.info(`Logged in as ${bot.user!.tag}.`);
	}
}
