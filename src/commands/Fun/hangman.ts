import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import type { CommandInteraction } from "discord.js";

@CommandData({
	name: "hangman",
	description: "Play a game of hangman!",
	category: "Fun",
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {}
}
