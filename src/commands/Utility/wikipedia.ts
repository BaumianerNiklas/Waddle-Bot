import { BaseCommand, CommandData, CommandExecutionError } from "#structures/BaseCommand.js";
import { ActionRow, Embed, LinkButton } from "#util/builders.js";
import { COLOR_BOT, USER_AGENT } from "#util/constants.js";
import { FETCHING_API_FAILED } from "#util/messages.js";
import {
	ApplicationCommandOptionChoiceData,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} from "discord.js";

// Top 25 mostly used Languages of Wikipedia, according to https://en.wikipedia.org/wiki/List_of_Wikipedias
// Only 25 are listed here because you can have a maximum of 25 choices per option and
// I cba to add some sort of validation method to check if arbitrary string input is a valid country code
const wikipediaLangs = {
	en: "English",
	fr: "French",
	de: "German",
	es: "Spanish",
	ja: "Japanese",
	ru: "Russian",
	it: "Italian",
	zh: "Chinese",
	pt: "Portugese",
	ar: "Arabian",
	fa: "Persian",
	pl: "Polish",
	nl: "Dutch",
	id: "Indonesian",
	uk: "Ukrainian",
	he: "Hebrew",
	sv: "Swedish",
	cs: "Czech",
	ko: "Korean",
	vi: "Vietnamese",
	ca: "Catalan",
	no: "Norwegian",
	fi: "Finnish",
	hu: "Hungarian",
	tr: "Turkish",
};

function languagesToChoices() {
	const res: ApplicationCommandOptionChoiceData[] = [];
	for (const [langCode, language] of Object.entries(wikipediaLangs)) {
		res.push({ name: language, value: langCode });
	}
	return res;
}

@CommandData({
	name: "wikipedia",
	description: "Get the summary of a Wikipedia page",
	category: "Utility",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "page",
			description: "The title of the page to get information about (case-sensitive!)",
			required: true,
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "language",
			description: "Which language of Wikipedia to use",
			choices: languagesToChoices(),
			required: false,
		},
	],
	guildOnly: false,
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();
		const queryPage = int.options.getString("page", true);
		const language = int.options.getString("language") ?? "en";

		const result = await fetch(
			`https://${language}.wikipedia.org/api/rest_v1/page/summary/${this.formatQuery(queryPage)}`,
			{
				headers: {
					"User-Agent": USER_AGENT,
				},
			}
		);

		if (result.status === 404) {
			throw new CommandExecutionError(
				`There doesn't seem to be a Wikipedia page titled "${queryPage}".\nNote: page titles are *case-sensitive*!)`
			);
		}

		if (!result.ok) {
			throw new CommandExecutionError(FETCHING_API_FAILED("this wikipedia page"));
		}

		const data = (await result.json()) as WikipediaSummaryData;
		let description = "";

		if (data.type === "disambiguation") {
			// This is really lazy but the REST API doesn't provide raw text of the page beyond 'extract'
			// And I'm not to keen on parsing HTML
			description = `${data.titles.normalized} seems to have multiple meanings. Go to the [full page](${data.content_urls.desktop.page}) for a disambiguation.`;
		} else description = data.extract;

		const embed = Embed({
			title: data.titles.normalized,
			description,
			color: int.guild?.members.me?.displayColor ?? COLOR_BOT,
		});

		if (data.thumbnail) embed.thumbnail = { url: data.thumbnail.source };

		const components = [ActionRow(LinkButton({ label: "Full Page", url: data.content_urls.desktop.page }))];

		int.editReply({ embeds: [embed], components });
	}

	private formatQuery(query: string): string {
		return query.replace(/ /g, "_");
	}
}

interface WikipediaSummaryData {
	type: "standard" | "disambiguation" | string; // There are probably other types I did not come across
	titles: {
		canonical: string;
		normalized: string;
		display: string;
	};
	extract: string;
	thumbnail?: {
		source: string;
	};
	content_urls: {
		desktop: {
			page: string;
		};
	};
}
