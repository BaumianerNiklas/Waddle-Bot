const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment } = require("discord.js");
const { join } = require("path");

module.exports.run = async (bot, msg, args) => {
	msg.channel.startTyping();
	// Create canvas and load background
	const canvas = createCanvas(1000, 750);
	const ctx = canvas.getContext("2d");

	const background = await loadImage(join(process.env.BASE_PATH, "Assets/kirbyteach.jpeg"));
	ctx.drawImage(background, 0, 0, 1000, 750);

	// Write text
	ctx.font = "32px Arial";
	const text = args.join(" ").chunk(37).join("\n");
	ctx.fillText(text, 150, 150, 515);

	// Send final picture
	const final = new MessageAttachment(canvas.toBuffer(), "kirbyteach.jpeg");
	msg.channel.stopTyping();
	msg.channel.send(final);
};

module.exports.help = {
	name: "kirbyteach",
	aliases: ["kirbyfact", "teach"],
	category: "Image",
	description: "Let kirby teach a fact!",
	usage: "kirbyteach <Text>",
	example: "kirbyteach Wear a fucking mask",
	requiredArguments: 1,
};
