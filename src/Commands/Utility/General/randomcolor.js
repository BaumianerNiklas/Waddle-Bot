const Color = require("color");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	const random = "#" + Math.floor(Math.random() * 16777215).toString(16);
	let color = Color(random);
	let hex = color.hex();
	console.log(hex);

	let embed = new MessageEmbed()
		.addField("Hex Value", hex)
		.addField("RGB Value", color.rgb().array().join(", "))
		.addField("Decimal Value", color.rgbNumber())
		.setColor(hex)
		.setThumbnail(`https://colorhexa.com/${hex.slice(1)}.png`);
	msg.channel.send(embed);
};

module.exports.help = {
	name: "randomcolor",
	aliases: ["rndmcolor", "randomcolour", "randcol", "rndmcolour"],
	category: "Utility",
	description: "Get a random Color",
	usage: "randomcolor",
	example: "randomcolor",
};
