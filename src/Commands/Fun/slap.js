let { randomArr, orange, getTarget } = require("../../Utilities/functions.js");
const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	let target = getTarget(msg, args[0]);
	let slapped = target === msg.member ? "themselves" : target.user.username;

	let gifs = [
		"https://media.tenor.com/images/14a6bfa33517654ab84519eb3af19b57/tenor.gif",
		"http://gifimage.net/wp-content/uploads/2017/07/anime-slap-gif-14.gif",
		"https://media.giphy.com/media/LB1kIoSRFTC2Q/giphy.gif",
		"http://33.media.tumblr.com/4a58a89eaaea25571fcc03d3788b1e55/tumblr_nel3qwSzqw1tblzm8o1_500.gif",
		"https://media.giphy.com/media/L7iHfUrBk3cqY/giphy.gif",
		"https://media.giphy.com/media/upEkeeUzrZZzG/giphy.gif",
		"https://gifimage.net/wp-content/uploads/2017/07/anime-slap-gif-4.gif",
		"https://media.giphy.com/media/tMIWyF5GUrWwM/giphy.gif",
		"https://media1.tenor.com/images/9ea4fb41d066737c0e3f2d626c13f230/tenor.gif",
		"https://media.giphy.com/media/1iw7RG8JbOmpq/giphy.gif",
		"http://i.imgur.com/UXqzzab.gif",
		"http://gifimage.net/wp-content/uploads/2017/07/anime-slap-gif-12.gif",
	];

	let randgif = randomArr(gifs);
	let embed = new Discord.MessageEmbed()
		.setTitle(`**${msg.author.username}** slapped **${slapped}!**`)
		.setImage(randgif)
		.setColor(target.displayColor);
	msg.channel.send(embed);
	console.log(randgif);
};

module.exports.help = {
	name: "slap",
	category: "Fun",
	description: "Slap someone",
	usage: "slap [User]",
	example: "slap @Neko",
};
