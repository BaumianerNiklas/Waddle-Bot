import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { ChatInputCommandInteraction, Attachment, ApplicationCommandOptionType } from "discord.js";
import Canvas from "canvas";
import { Embed } from "#util/builders.js";
const { createCanvas, loadImage } = Canvas;

@CommandData({
	name: "bonk",
	description: "Bonk someone!",
	category: "Image",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "The user you want to bonk!",
			required: true,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		// TODO: support for uploading attachments to bonk once attachment options release for interactions
		await int.deferReply();

		let author = int.user;
		let target = int.options.getUser("user", true);

		let bonkMsg: string;
		if (author.id === target.id) {
			bonkMsg = "themselves!";
		} else if (target.id === int.client.user?.id) {
			bonkMsg = "you! You really tried to bonk me there? Well good try, but I'm not getting bonked today.";
			target = int.user;
			author = int.client.user;
		} else bonkMsg = `${target.username}!`;

		const canvas = createCanvas(511, 348);
		const ctx = canvas.getContext("2d");

		const background = await loadImage("./assets/image/bonk.png");
		ctx.drawImage(background, 0, 0, 511, 348);

		const authPfp = await loadImage(author.displayAvatarURL({ extension: "png" }));
		ctx.drawImage(authPfp, 93, 40, 150, 150);

		const targetPfp = await loadImage(target.displayAvatarURL({ extension: "png" }));
		ctx.drawImage(targetPfp, 337, 168, 110, 110);

		const member = await int.guild?.members.fetch(target.id);
		const final = new Attachment(canvas.toBuffer(), "bonk.png");

		const embed = Embed({
			title: `${author.username} bonks ${bonkMsg}`,
			image: { url: "attachment://bonk.png" },
			color: member?.displayColor ?? 0,
		});

		int.editReply({ files: [final], embeds: [embed] });
	}
}
