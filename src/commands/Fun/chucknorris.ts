import { BaseCommand, CommandData, CommandExecutionError } from "#structures/BaseCommand.js";
import { FETCHING_API_FAILED } from "#util/messages.js";
import { capitalizeFirstLetter } from "#util/functions.js";
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";

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
			type: ApplicationCommandOptionType.String,
			name: "category",
			description: "The category the joke should be in",
			choices: categories.map((cat) => {
				return { name: capitalizeFirstLetter(cat), value: cat };
			}),
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		const category = int.options.getString("category");
		let url = "https://api.chucknorris.io/jokes/random";
		if (category) url += `?category=${category}`;

		const res = await fetch(url);
		if (!res.ok) {
			throw new CommandExecutionError(FETCHING_API_FAILED("a Chuck Norris joke"));
		}
		const joke = (await res.json()) as ChuckNorrisData;
		int.reply(joke.value);
	}
}

interface ChuckNorrisData {
	id: string;
	value: string;
	categories: keyof typeof categories;
	url: string;
	updated_at: Date;
	icon_url: string;
}
