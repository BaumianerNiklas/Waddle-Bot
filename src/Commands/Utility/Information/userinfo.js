let { getTarget, getAvatar } = require("../../../Utilities/functions.js");
const { format } = require("date-fns");
const Discord = require("discord.js");
const { botTag } = require("../../../Utilities/constants.js");

module.exports.run = async (bot, msg, args) => {
	let target = getTarget(msg, args[0]);

	let rawRoles = target.roles.cache;
	let roles = rawRoles.filter(r => r.rawPosition !== 0);
	let rolemap = roles.size >= 20 ? "many" : roles.map(r => `<@&${r.id}>`);
	let bitFieldFlags = await target.user.fetchFlags();
	let flags = bitFieldFlags.toArray().length ? bitFieldFlags.toArray() : "none";

	let embed = new Discord.MessageEmbed()
		.setAuthor(target.user.tag, getAvatar(target.user))
		.setTitle("User Information")
		.setThumbnail(getAvatar(target.user))
		.setFooter(`ID: ${target.id}`)
		.setTimestamp()
		.addField("Created At", format(target.user.createdAt, "dd/MM/yyyy"), true)
		.addField("Joined At", format(target.joinedAt, "dd/MM/yyyy"), true)
		.addField(`Roles [${roles.size}]`, rolemap)
		.setColor(target.displayColor);
	msg.channel.send(embed);
};

module.exports.help = {
	name: "userinfo",
	aliases: ["whois", "ui"],
	category: "Utility",
	description: "Get information about a user",
	usage: "userinfo [User]",
	example: "userinfo @Pas",
};
