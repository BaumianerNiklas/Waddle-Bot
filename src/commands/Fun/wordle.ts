import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { randomItemFromArray } from "#util/functions.js";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers";

const WORD_LIST = (await readFile("./assets/text/fiveLetterWords.txt")).toString().split("\n");

@CommandData({
	name: "wordle",
	description: "Play a game of Wordle! (https://powerlanguage.co.uk/wordle)",
	category: "Fun",
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		if (!int.channel) return;

		const word = randomItemFromArray(WORD_LIST);
		let embedContent = "";
		let guesses = 0;

		const embed = new MessageEmbed()
			.setTitle("Wordle")
			.setDescription("*Send a message in this channel to make your first guess!*")
			.setColor(0x538d4e)
			.setFooter({ text: "Play the original at https://powerlanguage.co.uk/wordle" });

		const botMsg = (await int.reply({ embeds: [embed], fetchReply: true })) as Message;

		const filter = (m: Message) => m.author.id === int.user.id;
		const collector = int.channel.createMessageCollector({ filter, time: 60e3 });

		collector.on("collect", async (msg) => {
			const guess = msg.content.toLowerCase();
			if (msg.deletable) msg.delete();
			collector.resetTimer();

			if (guess.length !== 5) {
				const resp = await int.channel!.send("Your word has to be 5 in length!");

				if (resp.deletable) {
					setTimeout(() => resp.delete(), 5e3);
				}

				return;
			}
			if (!WORD_LIST.includes(guess)) {
				const resp = await int.channel!.send(`'${guess}' is not in the word list!`);

				if (resp.deletable) {
					setTimeout(() => resp.delete(), 5e3);
				}
				return;
			}

			const data = this.generateGuessData(guess, word);
			embedContent += data.embedContent;

			embed.setDescription(embedContent).setColor(data.embedColor);
			botMsg.edit({ embeds: [embed] });

			if (guess === word) {
				int.channel!.send("You won! 🎊");
				return collector.stop();
			}

			guesses++;
			if (guesses === 6) {
				int.channel!.send(`You lost! The word was '${word}'.`);
				return collector.stop();
			}
		});
	}

	private generateGuessData(guess: string, correctWord: string): GuessData {
		const colors: GuessColors[] = [];
		let embedColor: EmbedColors = EmbedColors.Black;

		for (const [i, letter] of guess.split("").entries()) {
			if (correctWord.at(i) === letter) {
				colors.push(GuessColors.Green);
				embedColor = EmbedColors.Green;
			} else if (correctWord.includes(letter)) {
				colors.push(GuessColors.Yellow);
				if (embedColor !== EmbedColors.Green) embedColor = EmbedColors.Yellow;
			} else colors.push(GuessColors.Black);
		}

		const embedContent = "```\n" + `${guess.toUpperCase().split("").join("  ")}\n${colors.join(" ")}` + "```\n";

		return {
			guess,
			colors,
			embedContent,
			embedColor,
		};
	}
}

interface GuessData {
	guess: string;
	colors: GuessColors[];
	embedContent: string;
	embedColor: EmbedColors;
}

enum GuessColors {
	Green = "🟩",
	Yellow = "🟨",
	Black = "⬛",
}

enum EmbedColors {
	Green = 0x538d4e,
	Yellow = 0xb59f3b,
	Black = 0x3a3a3c,
}
