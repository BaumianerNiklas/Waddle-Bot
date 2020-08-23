const { error } = require("../../Utilities/functions.js");
const { text: ascii } = require("figlet");

module.exports.run = async (bot, msg, args) => {
	let text = args.join(" ").substring(0, 20);

	ascii(text, { font: "Standard" }, async (err, data) => {
		if (err) return console.error(err);
		if (data.length > 1994) return msg.channel.send(error("That text is too long!"));
		await msg.channel.send("```" + data + "```");
	});
};

module.exports.help = {
	name: "ascii",
	category: "Fun",
	description: "Convert some text to ascii",
	usage: "ascii <Text>",
	example: "ascii OwO",
	requiredArguments: 1,
};
