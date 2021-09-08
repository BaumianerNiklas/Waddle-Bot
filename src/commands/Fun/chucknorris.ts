import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { ErrorEmbed } from "#util/embeds.js";
import { FETCHING_API_FAILED } from "#util/errorMessages.js";
import { capitalizeFirstLetter } from "#util/functions.js";
import type { CommandInteraction } from "discord.js";
import fetch from "node-fetch";

const categories = [
	"animal",
	"career",
	"celebrity",
	"dev",
	"fashion",
	"food",
	"history",
	"money",
	"music",
	"movie",
	"science",
	"sport",
	"travel",
] as const; // There are also categories "explicit", "political" and "religion" that aren't included here because ehhh

@CommandData({
	name: "chucknorris",
	description: "Get a random Chuck Norris joke from https://chucknorris.io",
	category: "fun",
	options: [
		{
			type: "STRING",
			name: "category",
			description: "The category the joke should be in",
			choices: categories.map((cat) => {
				return { name: capitalizeFirstLetter(cat), value: cat };
			}),
		},
	],
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		const category = int.options.getString("category");
		let url = "https://api.chucknorris.io/jokes/random";
		if (category) url += `?category=${category}`;

		const res = await fetch(url);
		if (!res.ok) {
			return int.reply({ embeds: [new ErrorEmbed(FETCHING_API_FAILED("a Chuck Norris joke"))] });
		}
		const joke = (await res.json()) as ChuckNorrisData;
		int.reply(joke.value);
	}
}

interface ChuckNorrisData {
	id: string;
	value: string;
	categories: typeof categories[number];
	url: string;
	updated_at: Date;
	icon_url: string;
}
