let { randomArr, usageErr } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	if (args.length <= 1)
		return msg.channel.send(usageErr("I can't choose from none or one thing alone.", "choose"));
	let randchoice = randomArr(args);
	let choicestring = args.join(", ");
	msg.channel.send(`From \`${choicestring}\` I choose **${randchoice}**.`);
};

module.exports.help = {
	name: "choose",
	aliases: ["select"],
	category: "Fun",
	description: "Choose between two or more options",
	usage: "choose <Option 1> <Opt2> [Opt3]...",
	example: "choose Kirby King-Dedede Waddle_Dee",
};
