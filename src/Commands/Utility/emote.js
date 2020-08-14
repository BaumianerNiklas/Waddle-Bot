const { usageErr, getEmote } = require("../../Utilities/functions");
const { MessageEmbed } = require("discord.js");
const { format } = require("date-fns");

module.exports.run = async (bot, msg, args) => {
	let emoji = getEmote(args[0], msg.guild);
	if (!emoji)
		return msg.channel.send(
			usageErr("I could not get an emote I could show info about from that.", "emote"),
		);

	let embed = new MessageEmbed()
		.setTitle(`Emote Info - ${emoji.name}`)
		.setThumbnail(emoji.url)
		.setColor(msg.member.displayColor)
		.setFooter(`ID: ${emoji.id}`)
		.addField("Identifier", "`" + emoji.toString() + "`", true)
		.addField("Animated", emoji.animated, true)
		.addField("Created At", format(emoji.createdAt, "dd/MM/yyyy"), true);
	msg.channel.send(embed);
};

module.exports.help = {
	name: "emote",
	aliases: ["emoji", "em"],
	category: "Utility",
	description: "View Information about an emote",
	note: "If no arguments is provided, shows a list of all server emotes.",
	usage: "emote <Emote>",
	example: "emote :widepeepohappy:",
	requiredArguments: 1,
};
