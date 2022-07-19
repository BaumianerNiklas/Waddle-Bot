import type { ChatInputCommandInteraction, Message } from "discord.js";
import { ChatInputCommand } from "iubus";

export default new ChatInputCommand({
	name: "ping",
	description: "Show the bot's ping!",
	async run(interaction: ChatInputCommandInteraction) {
		const botMsg = (await interaction.reply({ content: "🏓  Pong!", fetchReply: true })) as Message;
		await interaction.editReply(`🏓  Pong! \`${Date.now() - botMsg.createdTimestamp}ms\``);
	},
});
