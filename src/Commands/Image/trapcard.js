const { MessageAttachment } = require("discord.js");
const { error, getTarget, getImage } = require("../../Utilities/functions.js");
const { createCanvas, loadImage } = require("canvas");
const { join } = require("path");

module.exports.run = async (bot, msg, args) => {
	let target = getTarget(msg, args[0], true);
	try {
		msg.channel.startTyping();
		let image = getImage(msg, target, args[0]);

		const canvas = createCanvas(750, 1150);
		const ctx = canvas.getContext("2d");

		const trapcard = await loadImage(join(process.env.BASE_PATH, "Images/trapcard.png"));
		ctx.drawImage(trapcard, 0, 0, 750, 1150);

		ctx.rotate(-0.142);
		const cardImage = await loadImage(image);
		ctx.drawImage(cardImage, 30, 95, 317.5, 317.5);

		const result = new MessageAttachment(canvas.toBuffer(), "trapcard.png");
		await msg.channel.stopTyping();
		msg.channel.send(result);
	} catch (err) {
		console.log(err);
		await msg.channel.send(
			error("I couldn't get an image from that. Please provide a valid image link or user."),
		);
		msg.channel.stopTyping();
	}
};

module.exports.help = {
	name: "trapcard",
	aliases: ["tc"],
	category: "Image",
	description: "Put some image on a trapcard!",
	usage: "trapcard [User/Image Link]",
	example: "trapcard @Lyo",
};
