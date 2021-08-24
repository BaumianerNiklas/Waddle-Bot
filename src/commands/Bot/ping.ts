import { BaseCommand } from "#BaseCommand";
import { CommandInteraction, Message } from "discord.js";

export class Command extends BaseCommand {
	constructor() {
		super({
			name: "ping",
			description: "Show the bot's ping!",
			category: "Bot",
			options: [],
		});
	}

	async run(interaction: CommandInteraction) {
		const botMsg = (await interaction.reply({ content: "🏓  Pong!", fetchReply: true })) as Message;
		await interaction.editReply(`🏓  Pong! \`${Date.now() - botMsg.createdTimestamp}ms\``);
	}
}
