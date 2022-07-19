import { ButtonInteraction, ChatInputCommandInteraction, Message, ButtonStyle, ComponentType } from "discord.js";
import he from "he";
const { decode } = he;
import { capitalizeFirstLetter, getBotColor, shuffleArray } from "#util/functions.js";
import { FETCHING_API_FAILED } from "#util/messages.js";
import { ActionRow, Button, Embed } from "#util/builders.js";
import { ChatInputCommand } from "iubus";
import { commandExecutionError } from "#util/commandExecutionError.js";

export default new ChatInputCommand({
	name: "trivia",
	description: "Play a game of Trivia! Data by https://opentdb.com/",
	async run(int: ChatInputCommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		const result = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

		if (!result.ok) {
			await commandExecutionError(int, FETCHING_API_FAILED("Trivia data"));
		}

		const data = ((await result.json()) as TriviaData).results[0] as TriviaQuestion;
		const { correct_answer: correctAnswer, incorrect_answers: incorrectAnswers } = data;

		const allAnswers = shuffleArray([correctAnswer, ...incorrectAnswers]);
		const correctAnswerIndex = allAnswers.findIndex((a) => a === correctAnswer);

		const embed = Embed({
			title: decode(data.question),
			description: allAnswers.map((a, i) => `${answerEmojis[i]} ${decode(a)}`).join("\n"),
			footer: { text: `Difficulty: ${capitalizeFirstLetter(data.difficulty)}` },
			author: { name: `Category: ${data.category}` },
			color: getBotColor(int.guild),
		});

		int.editReply({ embeds: [embed], components: generateComponents() });

		const filter = (i: ButtonInteraction) => i.user.id === int.user.id;
		const collector = botMsg.createMessageComponentCollector({
			filter,
			time: 30e3,
			componentType: ComponentType.Button,
		});

		collector.on("collect", (btn) => {
			const index = parseInt(btn.customId);
			btn.reply({ ephemeral: true, content: index === correctAnswerIndex ? "Correct!" : "Wrong!" });
			collector.stop();
		});

		collector.on("end", () => {
			botMsg.edit({ components: [] });
		});
	},
});
function generateComponents() {
	return [
		ActionRow(
			Button({ custom_id: "0", label: "A", style: ButtonStyle.Primary }),
			Button({ custom_id: "1", label: "B", style: ButtonStyle.Primary }),
			Button({ custom_id: "2", label: "C", style: ButtonStyle.Primary }),
			Button({ custom_id: "3", label: "D", style: ButtonStyle.Primary })
		),
	];
}
interface TriviaData {
	results: TriviaQuestion[];
}

interface TriviaQuestion {
	category: string;
	type: string;
	difficulty: string;
	question: string;
	correct_answer: string;
	incorrect_answers: string[];
}

const answerEmojis: Record<number, string> = {
	0: "🇦",
	1: "🇧",
	2: "🇨",
	3: "🇩",
};
