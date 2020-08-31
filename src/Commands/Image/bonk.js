const { MessageAttachment, MessageEmbed } = require("discord.js");
const { getTarget, error, getImage } = require("../../Utilities/functions.js");
const { createCanvas, loadImage } = require("canvas");
const { join } = require("path");

module.exports.run = async (bot, msg, args) => {
	// Target / Argument Management
	msg.channel.startTyping();
	const target = getTarget(msg, args[0], true);
	let toBonk = getImage(msg, target, args[0]);
	const bonker = target !== msg.guild.me ? msg.author : bot.user;
	if (!toBonk) return msg.channel.send(error("Please provide someone/something to bonk!"));

	let bonkMsg;
	if (target) {
		bonkMsg = target === msg.member ? "themselves!" : target.user.username + "!";
		if (target.user.id === bot.user.id) {
			bonkMsg = "you! You really tried to bonk me there? Well good try, but I'm not getting bonked today.";
			toBonk = msg.author.displayAvatarURL({ format: "jpg" });
		}
	} else {
		bonkMsg = "something!";
	}

	// Create Canvas
	const canvas = createCanvas(511, 348);
	const ctx = canvas.getContext("2d");

	// Load Background
	const background = await loadImage(join(process.env.BASE_PATH, "Assets/bonk.png"));
	ctx.drawImage(background, 0, 0, 511, 348);

	// Load Author
	const authPfp = await loadImage(bonker.displayAvatarURL({ format: "jpg" }));
	ctx.drawImage(authPfp, 93, 40, 150, 150);

	// Load Target
	const targetPfp = await loadImage(toBonk);
	ctx.drawImage(targetPfp, 337, 168, 110, 110);

	// Send Final Picture
	const final = new MessageAttachment(canvas.toBuffer(), "bonk.png");
	const embed = new MessageEmbed()
		.attachFiles(final)
		.setImage("attachment://bonk.png")
		.setTitle(`${bonker.username} bonks ${bonkMsg}`)
		.setColor(msg.member.displayColor);
	await msg.channel.stopTyping();
	msg.channel.send(embed);
};

module.exports.help = {
	name: "bonk",
	category: "Image",
	description: "Bonk someone!",
	usage: "bonk <User>",
	example: "bonk @MEE6",
	requiredArguments: 1,
};
