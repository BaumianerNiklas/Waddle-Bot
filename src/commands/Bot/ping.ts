import { BaseCommand, CommandData } from "#BaseCommand";
import { CommandInteraction, Message } from "discord.js";

@CommandData({ name: "ping", description: "Show the bot's ping!", category: "Bot" })
export class Command extends BaseCommand {
	async run(interaction: CommandInteraction) {
		const botMsg = (await interaction.reply({ content: "🏓  Pong!", fetchReply: true })) as Message;
		await interaction.editReply(`🏓  Pong! \`${Date.now() - botMsg.createdTimestamp}ms\``);
	}
}
