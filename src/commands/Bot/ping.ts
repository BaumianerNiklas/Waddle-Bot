import BaseCommand from "#structures/BaseCommand.js";
import { CommandInteraction, Message } from "discord.js";

export default class extends BaseCommand {
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
