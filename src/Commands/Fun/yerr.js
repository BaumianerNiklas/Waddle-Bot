const { MessageAttachment } = require("discord.js");
const { join } = require("path");

module.exports.run = async (bot, msg, args) => {
	const path = join(process.env.BASE_PATH, "Assets/yerr.png");
	const yerr = new MessageAttachment(path, "yerr.png");
	msg.channel.send("", yerr);
};

module.exports.help = {
	name: "yerr",
	category: "Hidden",
	description: "Yerrrrrrr",
	usage: "yerr",
	example: "yerr",
};
