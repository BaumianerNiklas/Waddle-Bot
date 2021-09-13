import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { COLOR_GREEN, COLOR_RED, EMOTE_DANGER, EMOTE_GREEN_TICK } from "./constants.js";

export class SuccessEmbed extends MessageEmbed {
	constructor(data?: MessageEmbed | MessageEmbedOptions | string) {
		if (typeof data === "string") {
			super({ description: SuccessEmbed.formatDescription(data) });
			this.color = COLOR_GREEN;
		} else {
			super(data);
			this.color = COLOR_GREEN;
			if (data?.description) {
				this.description = SuccessEmbed.formatDescription(data.description);
			}
		}
	}

	private static formatDescription(text: string): string {
		return `${EMOTE_GREEN_TICK} ${text}`;
	}
}

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
