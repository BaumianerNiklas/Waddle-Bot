import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import type { WaddleBot } from "#structures/WaddleBot.js";
import { ActionRow, LinkButton } from "#util/builders.js";
import { BOT_OWNER_ID, COLOR_BOT } from "#util/constants.js";
import { discordTimestamp } from "#util/functions.js";
import { ChatInputCommandInteraction, version as djsVersion, EmbedBuilder } from "discord.js";
import ms from "ms";
import fetch from "node-fetch";

@CommandData({
	name: "botinfo",
	description: "Get information about me!",
	category: "Bot",
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();

		const res = await fetch("https://api.github.com/repos/BaumianerNiklas/Waddle-Bot");
		let ghData: GithubData | null = null;
		if (res.ok) ghData = (await res.json()) as GithubData;

		const client = int.client as WaddleBot;
		const creator = await client.users.fetch(BOT_OWNER_ID);

		const embed = new EmbedBuilder()
			.setTitle(`${int.client.user?.username ?? "Waddle Bot"} - Info`)
			.setColor(int.guild?.me?.displayColor ?? COLOR_BOT)
			.setDescription("Here's some information about me!")
			.addFields([
				{ name: "Server Count", value: (await client.guilds.fetch()).size.toString(), inline: true },
				{ name: "Uptime", value: ms(client.uptime ?? 0), inline: true }, // uptime should only be null when the bot is not logged in
				{
					name: "Memory Usage",
					value: this.formatMemoryUsage(process.memoryUsage().heapUsed),
					inline: true,
				},
				{ name: "Node.js Version", value: process.version, inline: true },
				{ name: "discord.js Version", value: djsVersion, inline: true },
			])
			.setFooter({ text: `Created by ${creator.tag}`, iconURL: creator.displayAvatarURL() });

		if (ghData)
			if (ghData) {
				embed.addFields([
					{
						name: "Last Pushed Commit",
						value: discordTimestamp(new Date(ghData.pushed_at).getTime(), "R"),
						inline: true,
					},
				]);
			}

		if (client.user) embed.setThumbnail(client.user.displayAvatarURL());

		const comps = ActionRow(
			LinkButton({
				label: "Source code on GitHub",
				url: "https://github.com/BaumianerNiklas/Waddle-Bot",
			}),
			LinkButton({
				label: "Invite me!",
				url: "https://discord.com/api/oauth2/authorize?client_id=723224456671002674&permissions=8&scope=bot",
			})
		);

		int.editReply({ embeds: [embed], components: [comps] });
	}

	private formatMemoryUsage(bytes: number): string {
		return (bytes / 1024 / 1024).toFixed(2) + "MB";
	}
}

interface GithubData {
	pushed_at: Date;
}
