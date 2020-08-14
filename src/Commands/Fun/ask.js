let { randomArr, usageErr } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	if (args.length == 0)
		return msg.channel.send(usageErr("I can't answer to nothing. Try again.", "ask"));

	let answers = [
		"Yes, definitely",
		"Certainly not",
		"My sources say no",
		"Ask yourself, loser",
		"I don't know, try again",
		"Do you seriously need me to answer that?",
		"Maybe idk",
		"Look. You're better than this. Some dude programmed me and I'm literally just code. I am not able to escape from this hell. You can. Please use the internet and leave me alone. I can't take it anymore.",
		"After thinking about it I came to the conclusion yes.",
		"That you must decide on your own.",
		"I think so yea",
		"Ofc",
	];
	let randanswer = randomArr(answers);

	msg.channel.send(`\`${args.join(" ")}\`\n > ${randanswer}`);
};

module.exports.help = {
	name: "ask",
	aliases: ["8ball"],
	category: "Fun",
	description: "Ask me a question!",
	usage: "ask <Question>",
	example: "ask Is Waddle Bot the best bot on Discord?",
};
