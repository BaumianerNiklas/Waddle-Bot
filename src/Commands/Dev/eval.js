const fcs = require("../../Utilities/functions.js");
const consts = require("../../Utilities/constants.js");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");

function clean(text) {
	if (typeof text === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}

module.exports.run = async (bot, msg, args) => {
	if (msg.author.id !== process.env.OWNER_ID) return;
	let result;

	try {
		const code = args.join(" ");
		result = eval(code);

		if (typeof evaled !== "string") {
			result = require("util").inspect(result);
		}
		result = clean(result);
	} catch (err) {
		result = clean(err);
	}

	let embed = new MessageEmbed().setTitle("Eval").setTimestamp().setColor(consts.orange);
	if (result.length > 2048) {
		const haste = await fcs.hastebin(result);
		embed.setDescription(`Result exceeded the 2048 character limit. [[Hastebin Link]](${haste})`);
	} else {
		embed.setDescription("```xs\n" + result + "```");
	}
	msg.channel.send(embed);
};

module.exports.help = {
	name: "eval",
	aliases: ["e", "ev"],
	category: "Dev",
	description: "Eval some code",
	usage: "eval <code>",
	example: "eval 1+1",
};
