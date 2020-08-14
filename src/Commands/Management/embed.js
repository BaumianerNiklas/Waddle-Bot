const Discord = require("discord.js");
const { usageErr } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	if (args.length == 0) return msg.channel.send(usageErr("Please provide valid JSON.", "embed"));

	let json;
	try {
		json = JSON.parse(args.join(" "));
	} catch (err) {
		return msg.channel.send(usageErr("The provided JSON was invalid.", "embed"));
	}

	msg.react("✅").then(m => {
		msg.channel.send("", { embed: json });
		msg.delete({ timeout: 5000 });
	});
};

module.exports.help = {
	name: "embed",
	category: "Utility",
	description: "Let me create an embed",
	usage: "embed <JSON>",
	example: "embed {'title': 'hi', 'description': 'hi'}",
};

module.exports.permissions = {
	server: "MANAGE_MESSAGES",
};
