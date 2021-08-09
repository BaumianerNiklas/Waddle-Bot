import BaseCommand from "#structures/BaseCommand.js";
import { CommandInteraction } from "discord.js";

export default class extends BaseCommand {
	constructor() {
		super({
			name: "ping",
			description: "Show the bot's ping!",
			category: "fun",
			options: [],
		});
	}

	async run(interaction: CommandInteraction) {
		await interaction.reply("Pong!");
		// TODO: show actual ping
	}
}
