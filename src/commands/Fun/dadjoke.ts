import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { ErrorEmbed } from "#util/embeds.js";
import { FETCHING_API_FAILED } from "#util/errorMessages.js";
import type { CommandInteraction } from "discord.js";
import fetch from "node-fetch";

@CommandData({
	name: "dadjoke",
	description: "Get a random dadjoke! (Data from https://canihazdadjoke.com)",
	category: "Fun",
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		const res = await fetch("https://icanhazdadjoke.com", {
			method: "GET",
			headers: {
				"User-Agent": "Waddle Bot (https://github.com/BaumianerNiklas/Waddle-Bot)",
				Accept: "text/plain",
			},
		});

		if (!res.ok) {
			return int.reply({ embeds: [new ErrorEmbed(FETCHING_API_FAILED("a joke"))] });
		}

		const joke = await res.text();
		int.reply({ content: joke });
	}
}