import { ActionRow, Embed, LinkButton } from "#util/builders.js";
import { BOT_OWNER_ID } from "#util/constants.js";
import { discordTimestamp, getBotColor } from "#util/functions.js";
import { ChatInputCommandInteraction, version as djsVersion } from "discord.js";
import { ChatInputCommand } from "iubus";
import ms from "ms";

export default new ChatInputCommand({
	name: "botinfo",
	description: "Get information about me!",

	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();

		const res = await fetch("https://api.github.com/repos/BaumianerNiklas/Waddle-Bot");
		let ghData: GithubData | null = null;
		if (res.ok) ghData = (await res.json()) as GithubData;

		const client = int.client;
		const creator = await client.users.fetch(BOT_OWNER_ID);

		const embed = Embed({
			title: `${int.client.user?.username ?? "Waddle Bot"} - Info`,
			color: getBotColor(int.guild),
			description: "Here's some information about me!",
			fields: [
				{ name: "Server Count", value: (await client.guilds.fetch()).size.toString(), inline: true },
				{ name: "Uptime", value: ms(client.uptime ?? 0), inline: true }, // uptime should only be null when the bot is not logged in
				{
					name: "Memory Usage",
					value: formatMemoryUsage(process.memoryUsage().heapUsed),
					inline: true,
				},
				{ name: "Node.js Version", value: process.version, inline: true },
				{ name: "discord.js Version", value: djsVersion, inline: true },
			],
			footer: { text: `Created by ${creator.tag}`, icon_url: creator.displayAvatarURL() },
		});

		if (ghData) {
			embed.fields?.push({
				name: "Last Pushed Commit",
				value: discordTimestamp(new Date(ghData.pushed_at).getTime(), "R"),
				inline: true,
			});
		}

		if (client.user) embed.thumbnail = { url: client.user.displayAvatarURL() };

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
	},
});

function formatMemoryUsage(bytes: number): string {
	return (bytes / 1024 / 1024).toFixed(2) + "MB";
}

interface GithubData {
	pushed_at: Date;
}
