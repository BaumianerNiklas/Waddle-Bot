const { MessageEmbed } = require("discord.js");
const { format } = require("date-fns");
const { error, getChannel } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	const channel = getChannel(msg, args.join(" "));
	if (!channel) return msg.channel.send(error("I couldn't find that channel."));

	let embed = new MessageEmbed()
		.setTitle("Channel Information - " + channel.name)
		.setColor(msg.member.displayColor)
		.setFooter(`ID: ${channel.id}`)
		.addField("Category", channel.parent.name, true)
		.addField("Position", channel.rawPosition + 1, true)
		.addField("Slowmode", channel.rateLimitPerUser, true)
		.addField("NSFW", channel.nsfw, true)
		.addField("People with access to channel", channel.members.size, true)
		.addField("Created At", format(channel.createdAt, "dd/MM/yyyy"), true);
	msg.channel.send(embed);
};

module.exports.help = {
	name: "channelinfo",
	aliases: ["ci", "chi", "chaninfo"],
	category: "Utility",
	description: "Get information about a channel.",
	usage: "channelinfo [Channel]",
	example: "channelinfo #general",
};
