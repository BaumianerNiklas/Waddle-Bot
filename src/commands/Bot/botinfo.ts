import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import type { WaddleBot } from "#structures/WaddleBot.js";
import { BOT_OWNER_ID, COLOR_BOT } from "#util/constants.js";
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, version } from "discord.js";
import ms from "ms";

@CommandData({
	name: "botinfo",
	description: "Get information about me!",
	category: "Bot",
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		const client = int.client as WaddleBot;

		const embed = new MessageEmbed()
			.setTitle(`${int.client.user?.username ?? "Waddle Bot"} - Info`)
			.setColor(int.guild?.me?.displayColor ?? COLOR_BOT)
			.setDescription("Here's some information about me!")
			.addField("Server Count", (await client.guilds.fetch()).size.toString(), true)
			.addField("Uptime", ms(client.uptime ?? 0), true) // uptime should only be null when the bot is not logged in
			.addField("Node.js Version", process.version, true)
			.addField("discord.js Version", version, true)
			.setFooter(`Created by ${(await client.users.fetch(BOT_OWNER_ID)).tag}`);

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
		int.reply({ embeds: [embed], components });
	}
}
