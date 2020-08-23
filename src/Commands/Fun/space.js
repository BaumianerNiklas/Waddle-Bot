module.exports.run = async (bot, msg, args) => {
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
	requiredArguments: 2,
};
