import BaseEvent from "#BaseEvent";
import WaddleBot from "#WaddleBot";
import { Interaction } from "discord.js";

export default class extends BaseEvent {
	constructor() {
		super({
			name: "interactionCreate",
			once: false,
		});
	}

	async run(bot: WaddleBot, interaction: Interaction) {
		if (!interaction.isCommand() && !interaction.isContextMenu()) return;
		const command = bot.commandHandler.commands.get(interaction.commandName);

		if (!command) {
			return interaction.reply({ content: "This command has not yet been implemented!", ephemeral: true });
		}

		if (command.guildOnly && !interaction.guildId) {
			return interaction.reply(
				"Sorry, this command doesn't work in Direct Messages. Try running it on a server!"
			);
		}

		try {
			await command.run?.(interaction);
		} catch (error) {
			console.log(error);
			bot.logger.fatal("Failed to execute a command.");

			if (interaction.replied || interaction.deferred) {
				await interaction.editReply("Sorry, something went wrong while trying to execute this command.");
			} else {
				await interaction.reply("Sorry, something went wrong while trying to execute this command.");
			}
		}
	}
}
