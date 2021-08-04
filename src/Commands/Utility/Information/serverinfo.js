let { format } = require("date-fns");
const Discord = require("discord.js");
const { online, idle, dnd, offline } = require("../../../Utilities/constants");

module.exports.run = async (bot, msg, args) => {
	let server = msg.guild;

	let botcount = server.members.cache.filter((m) => m.user.bot).size;
	let onlineCount = server.members.cache.filter((m) => m.user.presence.status === "online").size;
	let idleCount = server.members.cache.filter((m) => m.user.presence.status === "idle").size;
	let dndCount = server.members.cache.filter((m) => m.user.presence.status === "dnd").size;
	let offlineCount = server.members.cache.filter((m) => m.user.presence.status === "offline").size;

	let categcount = server.channels.cache.filter((c) => c.type == "category").map((c) => c.name).length;
	let vccount = server.channels.cache.filter((c) => c.type == "voice").map((c) => c.name).length;

	let embed = new Discord.MessageEmbed()
		.setAuthor(server.name, server.iconURL({ format: "png", dynamic: true, size: 1024 }))
		.setTitle("Server Information")
		.setColor(msg.member.displayColor)
		.setFooter(`ID: ${server.id}`)
		.setThumbnail(server.iconURL({ format: "png", dynamic: true, size: 1024 }))
		.setTimestamp()
		.addFields([
			{ name: "Owner", value: `<@${server.owner.user.id}>`, inline: true },
			{
				name: `Member Count (${server.memberCount})`,
				value: `${online}${onlineCount} ${idle}${idleCount} ${dnd}${dndCount} ${offline}${offlineCount} :robot: ${botcount}`,
				inline: true,
			},
			{
				name: "Channels",
				value: `${server.channels.cache.size - categcount} (${vccount} Voice, ${categcount} Categories)`,
				inline: true,
			},
			{
				name: "Boosting Status",
				value: `Level ${server.premiumTier} (${server.premiumSubscriptionCount} Boosts)`,
				inline: true,
			},
			{ name: "Region", value: server.region, inline: true },
			{ name: "Created At", value: format(server.createdAt, "dd/MM/yyyy"), inline: true },
		]);

	msg.channel.send(embed);
};

module.exports.help = {
	name: "serverinfo",
	aliases: ["server", "si", "guildinfo", "guild", "gi"],
	category: "Utility",
	description: "Get information about this server",
	usage: "serverinfo",
	example: "serverinfo",
};
