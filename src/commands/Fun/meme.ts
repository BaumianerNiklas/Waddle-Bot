import { BaseCommand, CommandData, CommandExecutionError } from "#structures/BaseCommand.js";
import { FETCHING_API_FAILED } from "#util/messages.js";
import { randomItemFromArray } from "#util/functions.js";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";

const subreddits = ["dankmemes", "memes", "meme", "me_irl", "antimeme", "BlackPeopleTwitter", "WhitePeopleTwitter"];

@CommandData({
	name: "meme",
	description: "Get some (hopefully) quality memes from Reddit",
	category: "Fun",
	guildOnly: false,
	options: [
		{
			name: "subreddit",
			type: ApplicationCommandOptionType.String,
			description: "The subreddit to get memes from. Defaults to a random one of these.",
			choices: subreddits.map((sr) => {
				return { name: sr, value: sr };
			}),
			required: false,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();

		const choice = int.options.getString("subreddit");
		const subreddit = choice ?? randomItemFromArray(subreddits);
		const result = await fetch(`https://reddit.com/r/${subreddit}/hot.json`);

		if (!result.ok) {
			throw new CommandExecutionError(FETCHING_API_FAILED("a meme"));
		}

		const data = (await result.json()) as RedditData;
		const posts = data.data.children.filter((p) => {
			return !p.data.pinned && !p.data.stickied && !p.data.is_gallery && !p.data.is_video;
			// Pinned/Stickied posts are mostly metaposts about the subreddit
			// Galleries are made up of multiple images and hard to display in embeds
			// Videos don't display in embeds
		});
		const post = randomItemFromArray(posts).data;

		const embed = new EmbedBuilder()
			.setTitle(post.title)
			.setImage(post.url)
			.setAuthor({ name: `r/${subreddit}`, url: `https://reddit.com${post.permalink}` })
			.setFooter({
				text: `${post.ups} (${post.upvote_ratio * 100}%)`,
				iconURL: "https://cdn.discordapp.com/emojis/881256891299295272.png",
			})
			.setColor(0xff5700);
		int.editReply({ embeds: [embed] });
	}
}
// By far not every part of the JSON schema, just the properties relevant to the command
interface RedditData {
	data: {
		children: RedditPost[];
	};
}

interface RedditPost {
	data: {
		title: string;
		url: string;
		permalink: string;
		ups: number;
		upvote_ratio: number;
		pinned: boolean;
		stickied: boolean;
		is_gallery: boolean;
		is_video: boolean;
	};
}
