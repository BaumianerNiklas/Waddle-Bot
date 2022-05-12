import { BaseCommand, CommandExecutionError } from "#structures/BaseCommand.js";
import { ChatInputCommandInteraction } from "discord.js";
import { FETCHING_API_FAILED } from "#util/messages.js";
import { Embed } from "#util/builders.js";

export class Command extends BaseCommand {
	constructor() {
		super({
			name: "inspirobot",
			description: "Get an inspirational quote from InspiroBot! (https://inspirobot.me)",
			category: "Fun",
		});
	}

	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();

		const result = await fetch("https://inspirobot.me/api?generate=true");

		if (!result.ok) {
			throw new CommandExecutionError(FETCHING_API_FAILED("an inspirational quote"));
		}

		const quote = await result.text();

		const embed = Embed({
			author: {
				name: "Get inspired!",
				icon_url: "https://pbs.twimg.com/profile_images/815624354876760064/zPmAZWP4_400x400.jpg",
				url: quote,
			},
			color: 0xa890b,
			image: { url: quote },
		});

		int.editReply({ embeds: [embed] });
	}
}
