import { commandExecutionError } from "#util/commandExecutionError.js";
import { USER_AGENT } from "#util/constants.js";
import { FETCHING_API_FAILED } from "#util/messages.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { ChatInputCommand } from "iubus";

export default new ChatInputCommand({
	name: "dadjoke",
	description: "Get a random dadjoke! (Data from https://canihazdadjoke.com)",
	async run(int: ChatInputCommandInteraction) {
		const res = await fetch("https://icanhazdadjoke.com", {
			method: "GET",
			headers: {
				"User-Agent": USER_AGENT,
				Accept: "text/plain",
			},
		});

		if (!res.ok) {
			await commandExecutionError(int, FETCHING_API_FAILED("a joke"));
		}

		const joke = await res.text();
		int.reply({ content: joke });
	},
});
