let { orange, botDev } = require("../../Utilities/constants.js");
const Discord = require("discord.js");
const ms = require("ms");
const { getAvatar, emoteToUrl } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	let embed = new Discord.MessageEmbed()
		.setTitle("Waddle Bot - Info")
		.setDescription("Here's some Information about me!")
		.addField("Server Count", bot.guilds.cache.size, true)
		.addField("User Count", bot.users.cache.size, true)
		.addField("Library", "discord.js", true)
		.addField(
			"Versions",
			`**Discord.js:** v${Discord.version}\n**NodeJS:** ${process.version}`,
			true,
		)
		.addField("Uptime", ms(bot.uptime), true)
		.addField(
			"Invite Me",
			"[Link](https://discord.com/oauth2/authorize?client_id=723224456671002674&scope=bot&permissions=8)",
			true,
		)
		.setFooter(
			`Developed by: ${bot.users.cache.get(process.env.OWNER_ID).tag}`,
			emoteToUrl(botDev),
		)
		.setThumbnail(getAvatar(bot.user))
		.setColor(orange);
	msg.channel.send(embed);
};

module.exports.help = {
	name: "info",
	aliases: ["bot", "stats", "botinfo", "botstats"],
	category: "Bot",
	description: "Display information about me!",
	usage: "info",
	example: "info",
};
