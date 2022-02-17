import { BaseCommand, CommandExecutionError } from "#structures/BaseCommand.js";
import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Message,
	ActionRow,
	ButtonComponent,
	Embed,
	ButtonStyle,
	ComponentType,
} from "discord.js";
import fetch from "node-fetch";
import he from "he";
const { decode } = he;
import { capitalizeFirstLetter, shuffleArray } from "#util/functions.js";
import { COLOR_BOT } from "#util/constants.js";
import { FETCHING_API_FAILED } from "#util/messages.js";

export class Command extends BaseCommand {
	constructor() {
		super({
			name: "trivia",
			description: "Play a game of Trivia! Data by https://opentdb.com/",
			category: "Fun",
			options: [],
			guildOnly: false,
		});
	}

	async run(int: ChatInputCommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		const result = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

		if (!result.ok) {
			throw new CommandExecutionError(FETCHING_API_FAILED("Trivia data"));
		}

		const data = ((await result.json()) as TriviaData).results[0] as TriviaQuestion;
		const { correct_answer: correctAnswer, incorrect_answers: incorrectAnswers } = data;

		const allAnswers = shuffleArray([correctAnswer, ...incorrectAnswers]);
		const correctAnswerIndex = allAnswers.findIndex((a) => a === correctAnswer);

		const embed = new Embed()
			.setTitle(decode(data.question))
			.setDescription(allAnswers.map((a, i) => `${answerEmojis[i]} ${decode(a)}`).join("\n"))
			.setFooter({ text: `Difficulty: ${capitalizeFirstLetter(data.difficulty)}` })
			.setAuthor({ name: `Category: ${data.category}` })
			.setColor(COLOR_BOT);

		int.editReply({ embeds: [embed], components: this.generateComponents() });

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
	}

	private generateComponents(): ActionRow[] {
		return [
			new ActionRow().addComponents(
				new ButtonComponent().setCustomId("0").setLabel("A").setStyle(ButtonStyle.Primary),
				new ButtonComponent().setCustomId("1").setLabel("B").setStyle(ButtonStyle.Primary),
				new ButtonComponent().setCustomId("2").setLabel("C").setStyle(ButtonStyle.Primary),
				new ButtonComponent().setCustomId("3").setLabel("D").setStyle(ButtonStyle.Primary)
			),
		];
	}
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
