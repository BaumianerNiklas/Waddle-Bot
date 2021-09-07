import { BaseCommand } from "#structures/BaseCommand.js";
import { BOT_OWNER_ID, EMOTE_FIELD, EMOTE_ORANGE_CLOCK } from "#constants";
import { inspect } from "util";
import { CommandInteraction, Message, MessageActionRow, MessageAttachment, MessageButton } from "discord.js";
import { generateMessageLink } from "#functions";

export class Command extends BaseCommand {
	constructor() {
		super({
			name: "Evaluate Content",
			type: "MESSAGE",
			category: "Dev",
			testOnly: true,
		});
	}

	async run(int: CommandInteraction) {
		await int.deferReply();

		if (int.user.id !== BOT_OWNER_ID) {
			return int.editReply({ content: "lol no" });
		}

		let result;
		let type;
		const message = int.options.getMessage("message", true) as Message;
		const code = message.content;

		const startTime = performance.now();
		try {
			result = eval(code);
			type = this.getType(result);

			if (typeof result !== "string") {
				result = inspect(result);
			}
			result = this.clean(result);
		} catch (err) {
			type = this.getType(err);
			result = this.clean(err);
		}
		const timeTook = (performance.now() - startTime).toFixed(10);
		const metadata = `${EMOTE_ORANGE_CLOCK} \`${timeTook}ms\` ${EMOTE_FIELD} \`${type}\``;
		const components = [
			new MessageActionRow().addComponents(
				new MessageButton().setStyle("LINK").setLabel("Original Message").setURL(generateMessageLink(message))
			),
		];

		const content = "```js\n" + result + "```" + metadata;
		if (content.length > 2000) {
			const attachment = new MessageAttachment(Buffer.from(result), "evaled.js");
			int.editReply({ files: [attachment], content: metadata, components });
		} else {
			int.editReply({ content, components });
		}
	}

	private clean(data: string): string {
		if (typeof data === "string") {
			return data
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203))
				.replace(process.env.BOT_TOKEN!, "");
		} else return `${data}`;
	}

	private getType(value: any): string {
		const type = typeof value;
		if (type === "object") {
			if (value === null) return "null";

			if (value.constructor) return value.constructor.name;
			return "Object";
		} else if (type === "function") return `Function (${value.length}-arity)`;

		return type;
	}
}
