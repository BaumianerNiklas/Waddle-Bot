import { ActionRow, Embed, ErrorEmbed, LinkButton } from "#util/builders.js";
import { APPLICATION_ID, COLOR_BOT } from "#util/constants.js";
import { stripIndents } from "common-tags";
import { ChannelType, Message } from "discord.js";
import { container, Event } from "iubus";

export default new Event({
	name: "messageCreate",
	async run(message: Message) {
		if (!message.guild) return;

		const botMentionRegex = RegExp(`<@!?${APPLICATION_ID}>`, "g");
		if (!message.content.match(botMentionRegex)) return;

		const messageLinkRegex =
			/https?:\/\/((canary\.)|(ptb\.))?discord\.com\/channels\/(?<guildId>\d{17,19})\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})/g;
		const messageLink = messageLinkRegex.exec(message.content);
		if (!messageLink?.length) return;

		const { guildId, channelId, messageId } = messageLink.groups!;

		const guild = container.client.guilds.cache.get(guildId);
		if (!guild) return messageNotFound(message);

		const channel = await guild.channels.fetch(channelId);
		if (!channel || !(channel.type === ChannelType.GuildText)) return messageNotFound(message);

		const quotedMsg = await channel?.messages.fetch(messageId);
		if (!quotedMsg) return messageNotFound(message);

		const embed = Embed({
			author: { name: quotedMsg.author.tag, icon_url: quotedMsg.author.displayAvatarURL() },
			description: quotedMsg.content,
			color: quotedMsg.member?.displayColor ?? COLOR_BOT,
			timestamp: quotedMsg.createdAt.toISOString(),
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
	},
});

function messageNotFound(message: Message) {
	const text = stripIndents`Sorry, I could not fetch this message. Make sure the link leads to a valid message that is on a server and channel that I have access!`;
	return void message.reply({ embeds: [ErrorEmbed(text)] });
}
