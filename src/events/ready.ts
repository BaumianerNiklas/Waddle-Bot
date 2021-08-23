import BaseEvent from "#BaseEvent";
import type WaddleBot from "#WaddleBot";
import type { Snowflake } from "discord.js";

export default class extends BaseEvent {
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
		bot.logger.info(`Logged in as ${bot.user!.tag}.`);
	}
}
