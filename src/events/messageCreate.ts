import { BaseEvent } from "#structures/BaseEvent.js";
import { WaddleBot } from "#structures/WaddleBot.js";
import { APPLICATION_ID } from "#util/constants.js";
import { ErrorEmbed } from "#util/embeds.js";
import { stripIndents } from "common-tags";
import { Message, ActionRow, ButtonComponent, Embed, ButtonStyle } from "discord.js";

export class Event extends BaseEvent {
	constructor() {
		super({
			name: "messageCreate",
			once: false,
		});
	}

	async run(bot: WaddleBot, message: Message) {
		if (!message.guild) return;

		const botMentionRegex = RegExp(`<@!?${APPLICATION_ID}>`, "g");
		if (!message.content.match(botMentionRegex)) return;

		const messageLinkRegex =
			/https?:\/\/((canary\.)|(ptb\.))?discord\.com\/channels\/(?<guildId>\d{17,19})\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})/g;
		const messageLink = messageLinkRegex.exec(message.content);
		if (!messageLink?.length) return;

		const { guildId, channelId, messageId } = messageLink.groups!;

		const guild = bot.guilds.cache.get(guildId);
		if (!guild) return this.messageNotFound(message);

		const channel = await guild.channels.fetch(channelId);
		if (!channel || !channel.isText()) return this.messageNotFound(message);

		const quotedMsg = await channel?.messages.fetch(messageId);
		if (!quotedMsg) return this.messageNotFound(message);

		const embed = new Embed()
			.setAuthor({ name: quotedMsg.author.tag, iconURL: quotedMsg.author.displayAvatarURL() })
			.setDescription(quotedMsg.content)
			// TODO: re-add random color when member has no role color
			.setColor(quotedMsg.member?.displayColor ?? 0)
			.setTimestamp(quotedMsg.createdAt)
			.setFooter({ text: `${guild?.name} - #${channel.name}` });

		if (quotedMsg.attachments.size) embed.setImage(quotedMsg.attachments.first()!.url);

		const components = [
			new ActionRow().addComponents(
				new ButtonComponent()
					.setLabel("Jump to Message")
					.setStyle(ButtonStyle.Link)
					.setURL(`https://discord.com/channels/${guild.id}/${channel.id}/${quotedMsg.id}`)
			),
		];

		message.reply({ embeds: [embed], components, allowedMentions: { parse: [] } });
	}

	private messageNotFound(message: Message) {
		const text = stripIndents`Sorry, I could not fetch this message. Make sure the link leads to a valid message that is on a server and channel that I have access!`;
		return void message.reply({ embeds: [new ErrorEmbed(text)] });
	}
}
