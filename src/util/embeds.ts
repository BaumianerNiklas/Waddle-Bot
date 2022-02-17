import { Embed } from "discord.js";
import { COLOR_GREEN, COLOR_RED, EMOTE_DANGER, EMOTE_GREEN_TICK } from "./constants.js";

export class SuccessEmbed extends Embed {
	constructor(data?: Embed | string) {
		if (typeof data === "string") {
			super({ description: SuccessEmbed.formatDescription(data) });
			this.setColor(COLOR_GREEN);
		} else {
			super(data);
			this.setColor(COLOR_GREEN);
			if (data?.description) {
				this.setDescription(SuccessEmbed.formatDescription(data.description));
			}
		}
	}

	private static formatDescription(text: string): string {
		return `${EMOTE_GREEN_TICK} ${text}`;
	}
}

export class ErrorEmbed extends Embed {
	constructor(data?: Embed | string) {
		if (typeof data === "string") {
			super({ description: ErrorEmbed.formatDescription(data) });
			this.setColor(COLOR_RED);
		} else {
			super(data);
			this.setColor(COLOR_RED);
			if (data?.description) {
				this.setDescription(ErrorEmbed.formatDescription(data.description));
			}
		}
	}

	private static formatDescription(text: string): string {
		return `${EMOTE_DANGER} ${text}`;
	}
}
