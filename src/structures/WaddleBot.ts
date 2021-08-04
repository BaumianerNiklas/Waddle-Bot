import { Client, ClientOptions, Intents } from "discord.js";

export default class WaddleBot extends Client {
	constructor(options?: ClientOptions) {
		super({
			...options,
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
			partials: ["CHANNEL"],
		} as ClientOptions);
	}
}
