import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import type { WaddleBot } from "#structures/WaddleBot.js";
import { BOT_OWNER_ID, COLOR_BOT } from "#util/constants.js";
import { ErrorEmbed } from "#util/embeds.js";
import { discordTimestamp } from "#util/functions.js";
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, version as djsVersion } from "discord.js";
import ms from "ms";
import fetch from "node-fetch";

@CommandData({
	name: "botinfo",
	description: "Get information about me!",
	category: "Bot",
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		await int.deferReply();

		const res = await fetch("https://api.github.com/repos/BaumianerNiklas/Waddle-Bot");
		if (!res.ok) {
			return int.editReply({
				embeds: [new ErrorEmbed("Sorry, something went wrong while trying to execute this command.")],
			});
		}
		const ghData = (await res.json()) as GithubData;

		const client = int.client as WaddleBot;
		const creator = await client.users.fetch(BOT_OWNER_ID);

		const embed = new MessageEmbed()
			.setTitle(`${int.client.user?.username ?? "Waddle Bot"} - Info`)
			.setColor(int.guild?.me?.displayColor ?? COLOR_BOT)
			.setDescription("Here's some information about me!")
			.addField("Server Count", (await client.guilds.fetch()).size.toString(), true)
			.addField("Uptime", ms(client.uptime ?? 0), true) // uptime should only be null when the bot is not logged in
			.addField("Last Pushed Commit", discordTimestamp(new Date(ghData.pushed_at).getTime(), "R"), true)
			.addField("Memory Usage", this.formatMemoryUsage(process.memoryUsage().heapUsed), true)
			.addField("Node.js Version", process.version, true)
			.addField("discord.js Version", djsVersion, true)
			.setFooter(`Created by ${creator.tag}`, creator.displayAvatarURL({ dynamic: true }));

		if (client.user) embed.setThumbnail(client.user.displayAvatarURL());

		const components = [
			new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel("Source code on GitHub")
					.setURL("https://github.com/BaumianerNiklas/Waddle-Bot")
					.setStyle("LINK"),
				new MessageButton()
					.setLabel("Invite me!")
					.setURL(
						"https://discord.com/api/oauth2/authorize?client_id=723224456671002674&permissions=8&scope=bot"
					)
					.setStyle("LINK")
			),
		];
		int.editReply({ embeds: [embed], components });
	}

	private formatMemoryUsage(bytes: number): string {
		return (bytes / 1024 / 1024).toFixed(2) + "MB";
	}
}

interface GithubData {
	pushed_at: Date;
}
