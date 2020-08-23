module.exports.run = async (bot, msg, args) => {
	let randchoice = args.random();
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
	requiredArguments: 2,
};
