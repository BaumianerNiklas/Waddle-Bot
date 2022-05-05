import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { Embed } from "#util/builders.js";
import { COLOR_BOT, EMBED_MAX_LENGTH } from "#util/constants.js";
import { ErrorEmbed, SuccessEmbed } from "#util/embeds.js";
import { discordTimestamp, embedLength } from "#util/functions.js";
import { EMOTE_NOT_ON_SERVER } from "#util/messages.js";
import { stripIndents } from "common-tags";
import {
	ChatInputCommandInteraction,
	Guild,
	GuildEmoji,
	GuildMember,
	PermissionFlagsBits,
	ApplicationCommandOptionType,
} from "discord.js";

@CommandData({
	name: "emote",
	description: "Create, delete or view emotes on the server",
	category: "Utility",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "add",
			description: "Add an emote to the server",
			requiredPermissions: [PermissionFlagsBits.ManageEmojisAndStickers],
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "emote",
					description: "A link to the emote to add (must end in a valid image extension)",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "name",
					description: "The name to give to the emote",
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "delete",
			description: "Delete an emote from the server",
			requiredPermissions: [PermissionFlagsBits.ManageEmojisAndStickers],
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "emote",
					description: "The emote to delete",
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "view",
			description: "Get information about an emote about the server",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "emote",
					description: "The emote to view",
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "all",
			description: "View all the emotes in the server",
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();

		const subcommand = int.options.getSubcommand(true);

		if (subcommand === "add") {
			const name = int.options.getString("name", true);

			if (name.length < 2 || name.length > 32) {
				return int.editReply({ embeds: [new ErrorEmbed("Emote name length must be between 2 and 32.")] });
			}

			const url = int.options.getString("emote", true);

			try {
				const emote = await int.guild!.emojis.create(url, name);
				return int.editReply({
					embeds: [
						new SuccessEmbed(`Successfully added emote **${emote.name}** to the server!`).setImage(
							emote.url
						),
					],
				});
			} catch (e) {
				const msg = stripIndents`Sorry, I couldn't add this emote to the server. Make sure:
				- The emote is a valid URL and ends in a valid image file extension (.png, .jpg, .jpeg, etc)
				- The file size of the image is not bigger than 256kb`;
				return int.editReply({ embeds: [new ErrorEmbed(msg)] });
			}
		} else if (subcommand === "delete") {
			const toDelete = int.options.getString("emote", true);
			const emote = await this.getEmote(toDelete, int.guild!);

			if (!emote) {
				return int.editReply({ embeds: [new ErrorEmbed(EMOTE_NOT_ON_SERVER(toDelete))] });
			}

			if (emote.deletable) {
				await emote.delete();
				const msg = emote.name
					? `Successfully deleted emote **${emote.name}** from the server!`
					: "Sucessfully deleted that emote from the server!";
				return int.editReply({ embeds: [new SuccessEmbed(msg)] });
			} else {
				const msg = `Sorry, I can't delete ${
					emote.name ? `the emote **${emote.name}**` : "that emote"
				} from this server. This emote was probably added by an external application such as Twitch and not by a regular user or bot.`;
				return int.editReply({ embeds: [new ErrorEmbed(msg)] });
			}
		} else if (subcommand === "view") {
			const emoteStr = int.options.getString("emote", true);
			const emote = await this.getEmote(emoteStr, int.guild!);

			if (!emote) {
				return int.editReply({ embeds: [new ErrorEmbed(EMOTE_NOT_ON_SERVER(emoteStr))] });
			}

			const author = emote.author ? ` by ${emote.author}` : "";

			const embed = Embed({
				title: `Emote - ${emote.name}`,
				thumbnail: { url: emote.url },
				fields: [
					{
						name: "Created",
						value: discordTimestamp(emote.createdTimestamp, "R") + author,
						inline: true,
					},
					{ name: "Animated", value: `${emote.animated}`, inline: true },
					{
						name: "Identifier",
						value: `\`<:${emote.animated ? "a:" : ""}${emote.name}:${emote.id}>\``,
						inline: true,
					},
				],
				color: (int.member as GuildMember).displayColor,
				footer: { text: emote.id },
			});

			int.editReply({ embeds: [embed] });
		} else if (subcommand === "all") {
			const emotes = await int.guild!.emojis.fetch();
			const standardEmotes = emotes.filter((e) => !e.animated);
			const animatedEmotes = emotes.filter((e) => e.animated === true);
			const footer = `Standard: ${standardEmotes.size} | Animated: ${animatedEmotes.size}`;

			const embed = Embed({
				title: `${int.guild?.name} - Emotes`,
				color: int.guild?.me?.displayColor ?? COLOR_BOT,
				footer: { text: footer },
			});

			if (standardEmotes.size) {
				embed.fields?.push({ name: "Standard", value: standardEmotes.map((e) => `<:_:${e.id}>`).join("") });
			}
			if (animatedEmotes.size) {
				embed.fields?.push({ name: "Animated", value: animatedEmotes.map((e) => `<:a:_:${e.id}>`).join("") });
			}
			if (!standardEmotes.size && !animatedEmotes.size) {
				embed.description = `This server doesn't have any emotes! D:\nYou could try adding some using \`/${this.name} add\`! ;)`;
			}

			if (embedLength(embed) > EMBED_MAX_LENGTH) {
				embed.description = "Sorry, this server has too many emotes for me to display!";
				embed.fields = [];
			}

			return int.editReply({ embeds: [embed] });
		}
	}

	private async getEmote(emoteStr: string, guild: Guild): Promise<GuildEmoji | null> {
		const EMOJI_IDENTIFIER_REGEX = /<(?<animated>:a)?:(?<name>\w{2,32}):(?<id>\d{17,19})>/g;

		if (emoteStr.match(EMOJI_IDENTIFIER_REGEX)) {
			// literal emotes/identifiers, eg <:abc:123456789012345678:>
			const match = EMOJI_IDENTIFIER_REGEX.exec(emoteStr);
			const id = match?.groups?.id;

			return id ? await guild.emojis.fetch(id) : null;
		} else if (emoteStr.match(/\d{17,19}/)) {
			// emote Ids
			const emote = await guild.emojis.fetch(emoteStr);

			return emote ?? null;
		} else if (emoteStr.match(/\w{2,32}/)) {
			// emote names (can only be between 2 and 32 characters long)
			const allEmotes = await guild.emojis.fetch();
			const emote = allEmotes.find((e) => e.name === emoteStr);

			return emote ?? null;
		} else {
			return null;
		}
	}
}
