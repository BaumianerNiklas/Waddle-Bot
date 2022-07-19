import { BOT_OWNER_ID, EMOTE_FIELD, EMOTE_ORANGE_CLOCK } from "#util/constants.js";
import { inspect } from "util";
import djs, { Message, ContextMenuCommandInteraction, AttachmentBuilder } from "discord.js";
import { generateMessageLink } from "#util/functions.js";
import { ActionRow, LinkButton } from "#util/builders.js";
import { MessageContextMenuCommand } from "iubus";

export default new MessageContextMenuCommand({
	name: "Evaluate Content",
	dontDeployGlobally: true,
	async run(int: ContextMenuCommandInteraction) {
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
			djs; // Expose djs in the try block scope so it can be used in evals
			result = eval(code);
			type = getType(result);

			if (typeof result !== "string") {
				result = inspect(result);
			}
			result = clean(result);
		} catch (err) {
			type = getType(err);
			result = clean(err);
		}
		const timeTook = (performance.now() - startTime).toFixed(10);
		const metadata = `${EMOTE_ORANGE_CLOCK} \`${timeTook}ms\` ${EMOTE_FIELD} \`${type}\``;

		const components = [ActionRow(LinkButton({ label: "Original Message", url: generateMessageLink(message) }))];

		const content = "```js\n" + result + "```" + metadata;
		if (content.length > 2000) {
			const attachment = new AttachmentBuilder(Buffer.from(result), { name: "evaled.js" });
			int.editReply({ files: [attachment], content: metadata, components });
		} else {
			int.editReply({ content, components });
		}
	},
});

function clean(data: unknown): string {
	if (typeof data === "string") {
		return data
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			.replace(process.env.BOT_TOKEN!, "");
	} else return clean(`${data}`);
}

function getType(value: unknown): string {
	if (typeof value === "object") {
		if (value === null) return "null";

		if (value.constructor) return value.constructor.name;
		return "Object";
	} else if (typeof value === "function") return `Function (${value.length}-arity)`;

	return typeof value;
}
