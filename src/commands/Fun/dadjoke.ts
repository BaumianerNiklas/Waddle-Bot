import { BaseCommand, CommandData, CommandExecutionError } from "#structures/BaseCommand.js";
import { USER_AGENT } from "#util/constants.js";
import { FETCHING_API_FAILED } from "#util/messages.js";
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
				"User-Agent": USER_AGENT,
				Accept: "text/plain",
			},
		});

		if (!res.ok) {
			throw new CommandExecutionError(FETCHING_API_FAILED("a joke"));
		}

		const joke = await res.text();
		int.reply({ content: joke });
	}
}
