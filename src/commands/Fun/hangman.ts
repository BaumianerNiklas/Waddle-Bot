import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { chunkArray, randomItemFromArray } from "#util/functions.js";
import { ButtonInteraction, CommandInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import { readFile } from "fs/promises";

@CommandData({
	name: "hangman",
	description: "Play a game of Hangman!",
	category: "Fun",
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		// Wordlist from https://github.com/Tom25/Hangman/blob/master/wordlist.txt
		const wordlist = await readFile("./assets/hangmanWordlist.txt");
		const words = wordlist
			.toString()
			.split("\n")
			.filter((word) => !word.includes("j")); // Discord only allows for 25 buttons per message, so J as the rarest letter is excluded
		const word = randomItemFromArray(words);

		let guessed = "_".repeat(word.length);
		let wrongGuesses = 0;
		const wrongLetters: string[] = [];
		const usedLetters: string[] = [];

		int.editReply({
			content: this.generateContent(guessed, wrongGuesses, wrongLetters),
			components: this.generateComponents(usedLetters),
		});

		const filter = (i: ButtonInteraction) => i.user.id === int.user.id;
		const collector = botMsg.createMessageComponentCollector({ filter, componentType: "BUTTON", time: 60e3 });

		collector.on("collect", (btn) => {
			const letter = btn.customId;

			if (word.includes(letter)) {
				const indices: number[] = [];
				let i = 0;

				// This is a REALLY convoluted way of replacing specific indices of a string with a letter, but oh well
				while (i < word.length) {
					const index = word.indexOf(letter, i);
					if (index !== -1) {
						indices.push(index);
						i = index + 1;
					} else break;
				}

				indices.forEach((index) => {
					guessed = guessed.substring(0, index) + letter + guessed.substring(index + 1, word.length);
				});
			} else {
				wrongLetters.push(letter);
				wrongGuesses += 1;

				if (wrongGuesses >= 8) {
					collector.stop("GAME_OVER");
					return btn.update({ content: `You lost! The word was \`${word}\`.`, components: [] });
				}
			}

			if (!guessed.includes("_")) {
				collector.stop("GAME_OVER");
				return btn.update({ content: `You won! The word was \`${word}\`.`, components: [] });
			}

			usedLetters.push(letter);
			collector.resetTimer();
			btn.update({
				content: this.generateContent(guessed, wrongGuesses, wrongLetters),
				components: this.generateComponents(usedLetters),
			});
		});

		collector.on("end", (_, reason) => {
			if (reason !== "GAME_OVER")
				botMsg.edit({
					components: [],
					content:
						botMsg.content +
						`\n*This session has timed out. You can start a new one with \`/${this.name}\`*.`,
				});
		});
	}

	private generateContent(guessed: string, wrongGuesses: number, wrongLetters: string[]): string {
		let displayWrongLetters = "";
		if (wrongLetters.length) {
			displayWrongLetters = `\nWrong Letters: ${wrongLetters.join(", ")}`;
		}
		return `\`\`\`${hangmanStages[wrongGuesses]}\n${guessed.replace(/\S/g, (match) => {
			return match + " ";
		})}${displayWrongLetters}\`\`\``;
	}

	private generateComponents(usedLetters: string[]) {
		// UTF-16 char code is "a" followed by the other lowercase latin letters
		const letters = [...Array(26)].map((_, i) => String.fromCharCode(97 + i)).filter((letter) => letter !== "j");
		const components: MessageActionRow[] = [];

		const chunkedLetters = chunkArray(letters, 5);
		chunkedLetters.forEach((chunk) => {
			const row = new MessageActionRow();

			chunk.forEach((letter) => {
				row.addComponents(
					new MessageButton()
						.setCustomId(letter)
						.setLabel(letter.toUpperCase())
						.setStyle("PRIMARY")
						.setDisabled(usedLetters.includes(letter))
				);
			});
			components.push(row);
		});

		return components;
	}
}

const hangmanStages = [
	`
    +---+
        |
        |
        |
        |
        |
    =========
`,
	`
    +---+
    |   |
        |
        |
        |
        |
    =========
`,
	`
    +---+
    |   |
    O   |
        |
        |
        |
    =========
`,
	`
    +---+
    |   |
    O   |
    |   |
        |
        |
    =========
`,
	`
    +---+
    |   |
    O   |
   /|   |
        |
        |
    =========
`,
	`
    +---+
    |   |
    O   |
   /|\\  |
        |
        |
    =========
`,
	`
    +---+
    |   |
    O   |
   /|\\  |
   /    |
        |
    =========
`,
	`
    +---+
    |   |
    O   |
   /|\\  | 
   / \\  | 
        |
    =========
`,
];
