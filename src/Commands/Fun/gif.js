let { randGiphy, usageErr } = require("../../Utilities/functions.js");
const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	if (args.length <= 0) msg.channel.send(usageErr("You need to specify a search term!", "gif"));
	let gif = randGiphy(args.join(" "));

	let embed = new Discord.MessageEmbed()
		.setTitle(`**Here you go!**`)
		.setImage(gif)
		.setColor(msg.member.displayColor);
	msg.channel.send(embed);
	console.log(gif);
};

module.exports.help = {
	name: "gif",
	aliases: ["giphy"],
	category: "Fun",
	description: "Search for a gif on Giphy [Broken atm, dunno if theres a fix]",
	usage: "gif [Term]",
	example: "gif Panda",
};
