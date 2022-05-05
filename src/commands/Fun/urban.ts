import { BaseCommand, CommandData, CommandExecutionError } from "#structures/BaseCommand.js";
import { Embed } from "#util/builders.js";
import { COLOR_BOT } from "#util/constants.js";
import { FETCHING_API_FAILED } from "#util/messages.js";
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import fetch from "node-fetch";

@CommandData({
	name: "urban",
	description: "Look up the definition of a word or phrase on Urban Dictionary!",
	category: "",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "term",
			description: "The word or phrase you want to look up (case sensitive!)",
			required: true,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();

		const term = int.options.getString("term", true);

		const result = await fetch(`https://api.urbandictionary.com/v0/define?term=${term}`);
		if (!result.ok) {
			throw new CommandExecutionError(FETCHING_API_FAILED("a definition for that phrase"));
		}
		const data = (await result.json()) as UrbanDictionaryData;
		if (!data.list.length) {
			return int.editReply(`I couldn't find any definition for the term **${term}**.`);
		}

		const definition = data.list[0];

		const embed = Embed({
			title: definition.word,
			url: definition.permalink,
			description: this.cleanResult(definition.definition),
			author: { name: definition.author },
			footer: { text: `👍 ${definition.thumbs_up} 👎 ${definition.thumbs_down}` },
			timestamp: definition.written_on.toDateString(),
			color: COLOR_BOT,
		});

		if (definition.example) embed.fields?.push({ name: "Example", value: this.cleanResult(definition.example) });

		return int.editReply({ embeds: [embed] });
	}

	private cleanResult(data: string): string {
		return data.replace(/[[\]]/g, "").slice(0, 4096);
	}
}

interface UrbanDictionaryData {
	list: DefinitionData[];
}

interface DefinitionData {
	word: string;
	definition: string;
	example?: string;
	author: string;
	permalink: string;
	thumbs_up: number;
	thumbs_down: number;
	written_on: Date;
}
