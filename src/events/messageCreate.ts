import { BaseEvent } from "#structures/BaseEvent.js";
import { WaddleBot } from "#structures/WaddleBot.js";
import { APPLICATION_ID } from "#util/constants.js";
import { ErrorEmbed } from "#util/embeds.js";
import { stripIndents } from "common-tags";
import { Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

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

		const embed = new MessageEmbed()
			.setAuthor(quotedMsg.author.tag, quotedMsg.author.displayAvatarURL({ dynamic: true }))
			.setDescription(quotedMsg.content)
			.setColor(quotedMsg.member?.displayColor ?? "RANDOM")
			.setTimestamp(quotedMsg.createdAt)
			.setFooter(`${guild?.name} - #${channel.name}`);

		if (quotedMsg.attachments.size) embed.setImage(quotedMsg.attachments.first()!.url);

		const components = [
			new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel("Jump to Message")
					.setStyle("LINK")
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
