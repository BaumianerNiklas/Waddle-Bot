import { BaseCommand } from "#structures/BaseCommand.js";
import {
	ButtonInteraction,
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";
import fetch from "node-fetch";
import he from "he";
const { decode } = he;
import { capitalizeFirstLetter, shuffleArray } from "#functions";
import { COLOR_BOT } from "#util/constants.js";

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

	async run(int: CommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		const result = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

		if (!result.ok) {
			return int.reply("Sorry, something went wrong while trying to fetch Trivia Data.");
		}

		const data = ((await result.json()) as TriviaData).results[0] as TriviaQuestion;
		const { correct_answer: correctAnswer, incorrect_answers: incorrectAnswers } = data;

		const allAnswers = shuffleArray([correctAnswer, ...incorrectAnswers]);
		const correctAnswerIndex = allAnswers.findIndex((a) => a === correctAnswer);

		const embed = new MessageEmbed()
			.setTitle(decode(data.question))
			.setDescription(allAnswers.map((a, i) => `${answerEmojis[i]} ${decode(a)}`).join("\n"))
			.setFooter(`Difficulty: ${capitalizeFirstLetter(data.difficulty)}`)
			.setAuthor(`Category: ${data.category}`)
			.setColor(COLOR_BOT);

		int.editReply({ embeds: [embed], components: this.generateComponents() });

		const filter = (i: ButtonInteraction) => i.user.id === int.user.id;
		const collector = botMsg.createMessageComponentCollector({ filter, time: 30e3, componentType: "BUTTON" });

		collector.on("collect", (btn) => {
			const index = parseInt(btn.customId);
			btn.reply({ ephemeral: true, content: index === correctAnswerIndex ? "Correct!" : "Wrong!" });
			collector.stop();
		});

		collector.on("end", () => {
			botMsg.edit({ components: [] });
		});
	}

	private generateComponents(): MessageActionRow[] {
		return [
			new MessageActionRow().addComponents(
				new MessageButton().setCustomId("0").setLabel("A").setStyle("PRIMARY"),
				new MessageButton().setCustomId("1").setLabel("B").setStyle("PRIMARY"),
				new MessageButton().setCustomId("2").setLabel("C").setStyle("PRIMARY"),
				new MessageButton().setCustomId("3").setLabel("D").setStyle("PRIMARY")
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
