import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { randomItemFromArray } from "#util/functions.js";
import axios from "axios";
import { BaseGuildTextChannel, CommandInteraction, GuildChannel, MessageEmbed } from "discord.js";

@CommandData({
	name: "meme",
	description: "Get some (hopefully) quality memes from Reddit",
	category: "Fun",
	guildOnly: false,
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		await int.deferReply();

		const subreddits = [
			"dankmemes",
			"memes",
			"meme",
			"me_irl",
			"antimeme",
			"BlackPeopleTwitter",
			"WhitePeopleTwitter",
		];

		const subreddit = randomItemFromArray(subreddits);
		const { data }: { data: RedditData } = await axios.get(`https://reddit.com/r/${subreddit}/hot.json`);

		const posts = data.data.children.filter((p) => {
			return !p.data.pinned && !p.data.stickied && !p.data.is_gallery && !p.data.is_video;
			// Pinned/Stickied posts are mostly metaposts about the subreddit
			// Galleries are made up of multiple images and hard to display in embeds
			// Videos don't display in embeds
		});
		const post = randomItemFromArray(posts).data;

		const embed = new MessageEmbed()
			.setTitle(post.title)
			.setImage(post.url)
			.setAuthor(`r/${subreddit}`, undefined, `https://reddit.com${post.permalink}`)
			.setFooter(
				`${post.ups} (${post.upvote_ratio * 100}%)`,
				"https://cdn.discordapp.com/emojis/881256891299295272.png"
			)
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