const math = require("mathjs");
const Discord = require("discord.js");
let { orange, usageErr } = require("../../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	let expr = args.join(" ");
	let result;
	if (!expr)
		return msg.channel.send(
			usageErr("Please input a valid mathematical expression.", "math"),
		);
	try {
		result = math.evaluate(expr);
	} catch (err) {
		return msg.channel.send(
			usageErr("Please Input a valid mathematical expression.", "math"),
		);
	}

	let embed = new Discord.MessageEmbed()
		.setTitle("Math Evalutation")
		.setTimestamp()
		.setColor(orange)
		.addField("Input", "```xl\n" + expr + "```", true)
		.addField("Output", "```xl\n" + result + "```", true);
	msg.channel.send(embed);
};

module.exports.help = {
	name: "math",
	aliases: ["m", "calc", "c"],
	category: "Utility",
	description: "Evaluate a math expression!",
	usage: "math <Term>",
	example: "math 3*5",
};
