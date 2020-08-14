const { getAvatar, error } = require("../../Utilities/functions.js");
const { MessageEmbed } = require("discord.js");
const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

module.exports.run = async (bot, msg, args) => {
	let text = "\n";
	let i = 0;
	let j = 0;

	const [question, ...answers] = args.join(" ").split("|");
	if (answers.length > 5)
		return msg.channel.send(error("You provided too many options, the maximum is **5**"));

	while (i < answers.length) {
		text += `${emojis[i]} - ${answers[i]}\n`;
		i++;
	}

	let embed = new MessageEmbed()
		.setTitle(question)
		.setAuthor(`New Poll! Asked by ${msg.author.username}`, getAvatar(msg.author))
		.setColor(msg.member.displayColor)
		.setDescription(text)
		.setFooter("React to Vote!");

	const botMsg = await msg.channel.send(embed);

	while (j < answers.length) {
		await botMsg.react(emojis[j]);
		j++;
	}
};

module.exports.help = {
	name: "poll",
	aliases: ["survey", "vote"],
	category: "Utility",
	description: "Start a poll",
	usage: "poll <Question>",
	example: "poll Who is best? | Waddle Dees (obv) | Kirby | King Dedede | Meta Knight",
	requiredArguments: 3,
};
