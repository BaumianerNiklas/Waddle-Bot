let { usageErr } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	if (args.length < 2)
		return msg.channel.send(usageErr("You didn't provide enough arguments!", "space"));

	let seperator = args[0];
	let spaceText = args.slice(1).join(` ${seperator} `);
	let result = `${seperator} ${spaceText} ${seperator}`;
	msg.channel.send(result);
};

module.exports.help = {
	name: "space",
	category: "Fun",
	description: "Space some text with a seperator!",
	usage: "space <Seperator> <Text>",
	example: "space 👏 Waddle Bot is kinda cool.",
};
