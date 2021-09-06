import { BaseCommand } from "#structures/BaseCommand.js";
import fetch from "node-fetch";
import { CommandInteraction, MessageEmbed } from "discord.js";

export class Command extends BaseCommand {
	constructor() {
		super({
			name: "inspirobot",
			description: "Get an inspirational quote from InspiroBot! (https://inspirobot.me)",
			category: "Fun",
		});
	}

	async run(int: CommandInteraction) {
		await int.deferReply();

		const result = await fetch("https://inspirobot.me/api?generate=true");

		if (!result.ok) {
			return int.editReply("Sorry, something went wrong while trying to fetch a quote.");
		}

		const quote = await result.text();

		const embed = new MessageEmbed()
			.setAuthor(
				"Get Inspired!",
				"https://pbs.twimg.com/profile_images/815624354876760064/zPmAZWP4_400x400.jpg",
				quote
			)
			.setColor(0xa890b)
			.setImage(quote);

		int.editReply({ embeds: [embed] });
	}
}
