module.exports.run = async (bot, msg, args) => {
	let argString = args.join(" ");
	argString = argString
		.replace(/O/g, "OwO")
		.replace(/o/g, "owo")
		.replace(/U/g, "UwU")
		.replace(/u/g, "uwu")
		.replace(/L/g, "W")
		.replace(/l/g, "w")
		.replace(/R/g, "W")
		.replace(/r/g, "w");
	msg.channel.send(argString);
};

module.exports.help = {
	name: "uwuify",
	aliases: ["uwu"],
	category: "Fun",
	description: "uwuify some text!",
	usage: "uwuify <Text>",
	example: "uwuify Feel the uwu",
	requiredArguments: 1,
};
