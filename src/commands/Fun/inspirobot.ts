import BaseCommand from "#structures/BaseCommand.js";
import axios from "axios";
import { CommandInteraction, MessageEmbed } from "discord.js";

export default class extends BaseCommand {
	constructor() {
		super({
			name: "inspirobot",
			description: "Get an inspirational quote from InspiroBot! (https://inspirobot.me)",
			category: "Fun",
		});
	}

	async run(int: CommandInteraction) {
		await int.deferReply();

		const result = await axios.get("https://inspirobot.me/api?generate=true");

		const embed = new MessageEmbed()
			.setAuthor(
				"Get Inspired!",
				"https://pbs.twimg.com/profile_images/815624354876760064/zPmAZWP4_400x400.jpg",
				result.data
			)
			.setColor(0xa890b)
			.setImage(result.data);

		int.editReply({ embeds: [embed] });
	}
}
