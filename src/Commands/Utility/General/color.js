const { usageErr, cleanColor } = require("../../../Utilities/functions");
const { MessageEmbed } = require("discord.js");
const Color = require("color");

module.exports.run = async (bot, msg, args) => {
	let input = cleanColor(args[0]);
	try {
		let color = Color(input);
		let hex = color.hex();
		let embed = new MessageEmbed()
			.addField("Hex Value", hex)
			.addField("RGB Value", color.rgb().array().join(", "))
			.addField("Decimal Value", color.rgbNumber())
			.setColor(hex)
			.setThumbnail(`https://colorhexa.com/${hex.slice(1)}.png`);
		msg.channel.send(embed);
	} catch (err) {
		console.error(err);
		msg.channel.send(usageErr("Invalid Color!", "color"));
	}
};

module.exports.help = {
	name: "color",
	aliases: ["colour", "col"],
	category: "Utility",
	description: "Get information about a color",
	usage: "color <Color Hex Code>",
	example: "color #123ABC",
};
