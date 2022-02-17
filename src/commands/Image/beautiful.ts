import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, MessageAttachment } from "discord.js";
import Canvas from "canvas";
const { createCanvas, loadImage } = Canvas;

@CommandData({
	name: "beautiful",
	description: "Show everyone that you (or someone else) is beautiful!",
	category: "Image",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "The user that should be portrayed as beautiful",
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		// TODO: support for uploading attachments once a attachments option releases for interactions
		await int.deferReply();
		const image = (int.options.getUser("user") ?? int.user).displayAvatarURL({ extension: "jpg" });

		const canvas = createCanvas(623, 655);
		const ctx = canvas.getContext("2d");

		const background = await loadImage("./assets/image/beautiful.jpeg");
		ctx.drawImage(background, 0, 0, 623, 655);

		ctx.rotate(-0.02);
		const beautiful1 = await loadImage(image);
		ctx.drawImage(beautiful1, 422, 49, 150, 177.5);

		const beautiful2 = await loadImage(image);
		ctx.drawImage(beautiful2, 418.5, 378, 150, 177.5);

		const result = new MessageAttachment(canvas.toBuffer(), "beautiful.png");
		int.editReply({ files: [result] });
	}
}
