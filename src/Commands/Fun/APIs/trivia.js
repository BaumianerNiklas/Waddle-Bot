const {
	default: { get },
} = require("axios");
const { MessageEmbed } = require("discord.js");
const { decode } = require("he");

let correctEmoji;
module.exports.run = async (bot, msg, args) => {
	// Get and parse trivia data
	const response = await (await get("https://opentdb.com/api.php?amount=1&type=multiple")).data.results[0];

	const question = decode(response.question);
	const category = decode(response.category);
	const correctAnswer = decode(response.correct_answer);
	const incorrectAnswers = response.incorrect_answers.map((a) => decode(a));
	const answers = incorrectAnswers.concat(correctAnswer);

	// Create the embed
	let embed = new MessageEmbed()
		.setTitle(question)
		.setColor(msg.member.displayColor)
		.setDescription(
			getEmojis(answers.shuffle(), correctAnswer)
				.map((a, i) => {
					return `${reactions[i + 1]} - ${a}`;
				})
				.join("\n")
		)
		.setAuthor(`Category: ${category} | Difficulty: ${response.difficulty}`)
		.setFooter("React to the correct answer within 15 seconds!");

	// Send the embed and react to it
	const botMsg = await msg.channel.send(embed);
	botMsg.react(reactions[1]);
	botMsg.react(reactions[2]);
	botMsg.react(reactions[3]);
	botMsg.react(reactions[4]);

	// Create the reaction collector
	let reacted = false;
	const collector = botMsg.createReactionCollector(
		(r, u) => Object.values(reactions).includes(r.emoji.name) && u.id == msg.author.id,
		{ time: 15000 }
	);

	collector.on("collect", (r) => {
		if (reacted) return;
		reacted = true;
		if (r.emoji.name == correctEmoji) {
			msg.channel.send("Correct!");
		} else {
			msg.channel.send("You are literally so stupid.");
		}
		r.message.reactions.removeAll();
	});

	collector.on("end", () => {
		botMsg.reactions.removeAll();
		console.log(correctAnswer, correctEmoji);
	});
};

module.exports.help = {
	name: "trivia",
	aliases: ["randomtrivia", "quiz"],
	category: "Fun",
	description: "Test your knowledge with some trivia!",
	usage: "trivia",
	example: "trivia",
};

const reactions = {
	1: "🇦",
	2: "🇧",
	3: "🇨",
	4: "🇩",
};

function getEmojis(answers, correctAnswer) {
	let result = [];
	answers.forEach((a, i) => {
		if (a == correctAnswer) {
			correctEmoji = reactions[i + 1];
		}
		result.push(a);
	});
	return result;
}
