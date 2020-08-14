const { getAvatar } = require("../../Utilities/functions.js");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	let embed = new MessageEmbed()
		.setTitle("New Poll!")
		.setAuthor(`Asked by ${msg.author.username}`, getAvatar(msg.author))
		.setColor(msg.member.displayColor)
		.setDescription(args.join(" "))
		.setFooter("React to Vote!");

	await msg.react("✅");
	const botMsg = await msg.channel.send(embed);
	await botMsg.react("✅");
	await botMsg.react("❌");
	await msg.delete({ timeout: 3000 });
};

module.exports.help = {
	name: "quickpoll",
	aliases: ["qpoll", "yesno"],
	category: "Utility",
	description: "Creates a simple Yes/No Poll",
	note:
		"What differs this from the poll command is that this only has 2 options (Yes and No), while with poll you choose up to 5",
	usage: "poll <Question>",
	example: "poll Do you like Waddle Dees?",
	requiredArguments: 1,
};

module.exports.permissions = {
	server: "MANAGE_MESSAGES",
};
