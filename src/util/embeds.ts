import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { COLOR_RED, EMOTE_DANGER } from "./constants.js";

export class ErrorEmbed extends MessageEmbed {
	constructor(data?: MessageEmbed | MessageEmbedOptions | string) {
		if (typeof data === "string") {
			super({ description: ErrorEmbed.formatDescription(data) });
			this.color = COLOR_RED;
		} else {
			super(data);
			this.color = COLOR_RED;
			if (data?.description) {
				this.description = ErrorEmbed.formatDescription(data.description);
			}
		}
	}

	private static formatDescription(text: string): string {
		return `${EMOTE_DANGER} ${text}`;
	}
}
