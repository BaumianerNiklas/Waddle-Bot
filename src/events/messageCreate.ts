import { BaseEvent } from "#structures/BaseEvent.js";
import { WaddleBot } from "#structures/WaddleBot.js";
import { ActionRow, Embed, LinkButton } from "#util/builders.js";
import { APPLICATION_ID, COLOR_BOT } from "#util/constants.js";
import { ErrorEmbed } from "#util/embeds.js";
import { stripIndents } from "common-tags";
import { Message } from "discord.js";

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

		const embed = Embed({
			author: { name: quotedMsg.author.tag, icon_url: quotedMsg.author.displayAvatarURL() },
			description: quotedMsg.content,
			color: quotedMsg.member?.displayColor ?? COLOR_BOT,
			timestamp: quotedMsg.createdAt.toDateString(),
			footer: { text: `${guild?.name} - #${channel.name}` },
		});

		if (quotedMsg.attachments.size) embed.image = { url: quotedMsg.attachments.first()!.url };

		const components = [
			ActionRow(
				LinkButton({
					label: "Jump to message",
					url: `https://discord.com/channels/${guild.id}/${channel.id}/${quotedMsg.id}`,
				})
			),
		];

		message.reply({ embeds: [embed], components, allowedMentions: { parse: [] } });
	}

	private messageNotFound(message: Message) {
		const text = stripIndents`Sorry, I could not fetch this message. Make sure the link leads to a valid message that is on a server and channel that I have access!`;
		return void message.reply({ embeds: [new ErrorEmbed(text)] });
	}
}
