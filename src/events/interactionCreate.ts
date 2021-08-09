import BaseEvent from "#structures/BaseEvent.js";
import WaddleBot from "#structures/WaddleBot.js";
import { Interaction } from "discord.js";

export default class extends BaseEvent {
	constructor() {
		super({
			name: "interactionCreate",
			once: false,
		});
	}

	async run(bot: WaddleBot, interaction: Interaction) {
		if (!interaction.isCommand()) return;
		const command = bot.commandHandler.commands.get(interaction.commandName)!;

		if (command.guildOnly && !interaction.guildId) {
			return interaction.reply("Sorry, this command doesn't work in DM's. Try running it on a server!");
		}

		try {
			await command.run?.(interaction);
		} catch (error) {
			await interaction.reply("Sorry, something went wrong trying to execute this command.");
		}
	}
}
