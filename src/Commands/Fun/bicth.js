let { orange } = require("../../Utilities/constants.js");
const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	let embed = new Discord.MessageEmbed()
		.setImage("https://media.tenor.com/images/3fc694bf5d7fd731d46f8f77d2c91469/tenor.gif")
		.setColor(orange);

	let newEmbed = new Discord.MessageEmbed()
		.setImage("https://media.tenor.com/images/4bd3853cdf83931915c8439ff6e04234/tenor.gif")
		.setColor(orange);

	msg.channel.send(embed).then(botmsg => {
		setTimeout(() => {
			botmsg.edit(newEmbed);
		}, 3430);
	});
};

module.exports.help = {
	name: "bicth",
	category: "Hidden",
	description: "She is a bicth",
	usage: "bicth",
	example: "bicth",
};
