const { error, getTarget, getImage } = require("../../Utilities/functions.js");
const { createCanvas, loadImage } = require("canvas");
const { join } = require("path");
const { MessageAttachment } = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	msg.channel.startTyping();
	let target = getTarget(msg, args[0]);
	let image = getImage(msg, target, args[0]);

	const canvas = createCanvas(623, 655);
	const ctx = canvas.getContext("2d");

	const background = await loadImage(join(process.env.BASE_PATH, "Images/beautiful.jpg"));
	ctx.drawImage(background, 0, 0, 623, 655);

	ctx.rotate(-0.02);
	const beautiful1 = await loadImage(image);
	ctx.drawImage(beautiful1, 422, 49, 150, 177.5);

	const beautiful2 = await loadImage(image);
	ctx.drawImage(beautiful2, 418.5, 378, 150, 177.5);

	const result = new MessageAttachment(canvas.toBuffer(), "beautiful.png");
	await msg.channel.stopTyping();
	msg.channel.send(result);
};

module.exports.help = {
	name: "beautiful",
	aliases: ["beauty"],
	category: "Image",
	description: "You are indeed very beautiful.",
	usage: "beautiful [User|Image]",
	example: "beautiful @Pas",
};
