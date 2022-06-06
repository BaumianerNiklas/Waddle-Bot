import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Attachment, AttachmentBuilder } from "discord.js";
import { chunkString, loadImage } from "#util/functions.js";
import { createCanvas } from "@napi-rs/canvas";

@CommandData({
	name: "kirbyteach",
	description: "Let Kirby teach something!",
	category: "Image",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "text",
			description: "The text Kirby should teach",
			required: true,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();
		const text = int.options.getString("text", true);

		const canvas = createCanvas(1000, 750);
		const ctx = canvas.getContext("2d");

		const background = await loadImage("./assets/image/kirbyteach.jpeg");
		ctx.drawImage(background, 0, 0, 1000, 750);

		ctx.font = "32px Arial";
		let teachText = chunkString(text, 30).join("\n");
		if (teachText.length >= 330) {
			teachText = teachText.slice(0, 327) + "...";
		}
		ctx.fillText(teachText, 150, 150, 515);

		const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "kirbyteach.jpeg" });
		int.editReply({ files: [attachment] });
	}
}
