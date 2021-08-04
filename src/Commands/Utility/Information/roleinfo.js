const { MessageEmbed } = require("discord.js");
const { format } = require("date-fns");
const { error, getRole } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	const role = getRole(msg, args.join(""));
	if (!role) return msg.channel.send(error("I couldn't find that role."));

	let embed = new MessageEmbed()
		.setTitle("Role Information - " + role.name)
		.setColor(role.color)
		.setFooter(`ID: ${role.id}`)
		.addField("Members", role.members.size, true)
		.addField("Color", role.hexColor, true)
		.addField("Position", role.position, true)
		.addField("Hoisted", role.hoist, true)
		.addField("Mentionable", role.mentionable, true)
		.addField("Created At", format(role.createdAt, "dd/MM/yyyy"), true)
		.addField("Permissions", role.permissions.toArray().join(", ").toLowerCase().replace(/_/g, " "), true);
	msg.channel.send(embed);
};

module.exports.help = {
	name: "roleinfo",
	aliases: ["role", "ri"],
	category: "Utility",
	description: "Get information about a role",
	usage: "roleinfo <Role>",
	example: "roleinfo Member",
	requiredArguments: 1,
};
