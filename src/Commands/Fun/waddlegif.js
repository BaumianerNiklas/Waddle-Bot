let { randomArr, orange } = require("../../Utilities/functions.js");
const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	let waddlegifs = [
		"https://media.giphy.com/media/T7Qs5h0EaJrk4/giphy.gif",
		"https://media.giphy.com/media/T7Qs5h0EaJrk4/giphy.gif",
		"http://images.wikia.com/fantendo/images/6/64/Waddle_Dee_Dance.gif",
		"https://orig00.deviantart.net/e186/f/2015/168/3/6/waddle_dee__animation__by_spoofen-d8xowan.gif",
		"http://pa1.narvii.com/6361/fa84df63b9275b6f6b158d19564ff612a8f0f0a2_00.gif",
		"https://78.media.tumblr.com/4651c2e2322eaddb9ec313db0bb4b77f/tumblr_osxqtnDmuT1wunvcno1_500.gif",
		"https://orig00.deviantart.net/93a2/f/2009/168/5/e/bouncy_waddle_dee_by_peeka13.gif",
		"https://66.media.tumblr.com/b6b7190d54d243a1af17d9a712f80f3c/tumblr_pw1rron9JT1rc3hjeo1_400.gif",
		"http://www.avatarist.com/avatars/Games/Kirby/Waddle-Dee-xmas-dance.gif",
		"https://66.media.tumblr.com/0f0da10fc4fb1accdc8d631c87ad5e84/tumblr_nefwzonRvu1se3groo1_500.gif",
		"http://pa1.narvii.com/5788/01e1c82bdaf77cb372bcbc4490de26fe6b2f25ef_00.gif",
		"https://i.redd.it/utu0bjrkcjt01.gif",
		"https://thumbs.gfycat.com/CheerfulMajesticDinosaur-size_restricted.gif",
	];

	let randwaddlegif = randomArr(waddlegifs);
	var embed = new Discord.MessageEmbed()
		.setTitle("Here you go!")
		.setImage(randwaddlegif)
		.setColor(orange);
	msg.channel.send(embed);
	console.log(randwaddlegif);
};

module.exports.help = {
	name: "waddlegif",
	aliases: ["wg"],
	category: "Fun",
	description: "Show a random gif of a Waddle Dee",
	usage: "waddlegif",
	example: "waddlegif",
};
