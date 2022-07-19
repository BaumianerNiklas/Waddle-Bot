import { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { Embed } from "#util/builders.js";
import { createCanvas } from "@napi-rs/canvas";
import { loadImage } from "#util/functions.js";
import { ChatInputCommand } from "iubus";

export default new ChatInputCommand({
	name: "bonk",
	description: "Bonk someone!",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "The user you want to bonk!",
			required: true,
		},
	],
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

		const authPfp = await loadImage(author.displayAvatarURL({ extension: "png" }), true);
		ctx.drawImage(authPfp, 93, 40, 150, 150);

		const targetPfp = await loadImage(target.displayAvatarURL({ extension: "png" }), true);
		ctx.drawImage(targetPfp, 337, 168, 110, 110);

		const member = await int.guild?.members.fetch(target.id);
		const final = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "bonk.png" });

		const embed = Embed({
			title: `${author.username} bonks ${bonkMsg}`,
			image: { url: "attachment://bonk.png" },
			color: member?.displayColor ?? 0,
		});

		int.editReply({ files: [final], embeds: [embed] });
	},
});
