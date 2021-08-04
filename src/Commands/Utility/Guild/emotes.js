const { error } = require("../../../Utilities/functions");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	let staticEmotes = msg.guild.emojis.cache.filter((e) => e.animated === false).map((e) => `<:${e.identifier}>`);

	let animatedEmotes = msg.guild.emojis.cache.filter((e) => e.animated === true).map((e) => `<${e.identifier}>`);

	try {
		let embed = new MessageEmbed()
			.setTitle(`${msg.guild.name} - Emotes`)
			.setFooter(`Emote Count - Static: ${staticEmotes.length} | Animated: ${animatedEmotes.length}`)
			.setColor(msg.member.displayColor)
			.setDescription(staticEmotes.join("") || "None")
			.addField("Animated", animatedEmotes.join("") || "None");
		msg.channel.send(embed);
	} catch (err) {
		console.error(err);
		let errEmbed = error("Sorry, there are too many emotes on this server for me to display.").setFooter(
			`Emote Count - Static: ${staticEmotes.length} | Animated: ${animatedEmotes.length}`
		);
		msg.channel.send(errEmbed);
	}
};

module.exports.help = {
	name: "emotes",
	aliases: ["emojis", "ems", "emotelist", "emlist"],
	category: "Utility",
	description: "Get a list of all server emotes",
	usage: "emotes",
	example: "emotes",
};
