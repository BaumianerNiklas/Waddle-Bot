import { ActionRow, Button } from "#util/builders.js";
import { chunkArray, randomItemFromArray } from "#util/functions.js";
import { APIActionRowComponent, APIMessageActionRowComponent } from "discord-api-types/v10";
import { ButtonInteraction, ChatInputCommandInteraction, Message, ButtonStyle, ComponentType } from "discord.js";
import { ChatInputCommand } from "iubus";
import { readFile } from "node:fs/promises";

export default new ChatInputCommand({
	name: "hangman",
	description: "Play a game of Hangman!",
	async run(int: ChatInputCommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		// Wordlist from https://github.com/Tom25/Hangman/blob/master/wordlist.txt with all words containing 'j' filtered out
		// Discord only allows 25 buttons per message and 'j' seems to be the least common letter
		const wordlist = await readFile("./assets/text/hangmanWordlist.txt");
		const words = wordlist.toString().split("\n");
		const word = randomItemFromArray(words);

		let guessed = "_".repeat(word.length);
		let wrongGuesses = 0;
		const wrongLetters: string[] = [];
		const usedLetters: string[] = [];

		int.editReply({
			content: generateContent(guessed, wrongGuesses, wrongLetters),
			components: generateComponents(usedLetters),
		});

		const filter = (i: ButtonInteraction) => i.user.id === int.user.id;
		const collector = botMsg.createMessageComponentCollector({
			filter,
			componentType: ComponentType.Button,
			time: 60e3,
		});

		collector.on("collect", (btn) => {
			const letter = btn.customId;

			if (word.includes(letter)) {
				const indices: number[] = [];
				let i = 0;

				// This is a REALLY convoluted way of replacing specific indices of a string with a letter, but oh well
				while (i < word.length) {
					const index = word.indexOf(letter, i);
					if (index === -1) break;
					indices.push(index);
					i = index + 1;
				}

				indices.forEach((index) => {
					guessed = guessed.substring(0, index) + letter + guessed.substring(index + 1, word.length);
				});
			} else {
				wrongLetters.push(letter);
				wrongGuesses += 1;

				if (wrongGuesses >= 8) {
					collector.stop("GAME_OVER");
					return void btn.update({ content: `You lost! The word was \`${word}\`.`, components: [] });
				}
			}

			if (!guessed.includes("_")) {
				collector.stop("GAME_OVER");
				return void btn.update({ content: `You won! The word was \`${word}\`.`, components: [] });
			}

			usedLetters.push(letter);
			collector.resetTimer();
			btn.update({
				content: generateContent(guessed, wrongGuesses, wrongLetters),
				components: generateComponents(usedLetters),
			});
		});

		collector.on("end", (_, reason) => {
			if (reason === "GAME_OVER") return;
			botMsg.edit({
				components: [],
				content: botMsg.content + `\n*This session has timed out. You can start a new one with \`/${name}\`*.`,
			});
		});
	},
});

function generateContent(guessed: string, wrongGuesses: number, wrongLetters: string[]): string {
	let displayWrongLetters = "";
	if (wrongLetters.length) {
		displayWrongLetters = `\nWrong Letters: ${wrongLetters.join(", ")}`;
	}
	return `\`\`\`${hangmanStages[wrongGuesses]}\n${guessed.replace(/\S/g, (match) => {
		return match + " ";
	})}${displayWrongLetters}\`\`\``;
}

function generateComponents(usedLetters: string[]) {
	// UTF-16 char code 97 is "a" followed by the other lowercase latin letters
	const letters = [...Array(26)].map((_, i) => String.fromCharCode(97 + i)).filter((letter) => letter !== "j");
	const components: APIActionRowComponent<APIMessageActionRowComponent>[] = [];

	const chunkedLetters = chunkArray(letters, 5);
	chunkedLetters.forEach((chunk) => {
		const row = ActionRow();

		chunk.forEach((letter) => {
			row.components.push(
				Button({
					custom_id: letter,
					label: letter.toUpperCase(),
					style: ButtonStyle.Primary,
					disabled: usedLetters.includes(letter),
				})
			);
		});

		components.push(row);
	});

	return components;
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
] as const;
