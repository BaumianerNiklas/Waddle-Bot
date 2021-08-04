const { success } = require("../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	let input = args ? args.join(" ").substring(0, 32) : "";
	let onSuccess = input ? `changed my nickname on this server to **${input}**` : "reset my nickname on this server";

	await msg.guild.me.setNickname(input);
	msg.channel.send(success(onSuccess));
};

module.exports.help = {
	name: "botnick",
	aliases: ["botname"],
	category: "Management",
	description: "Change the Nickname of the Bot in the current server",
	note: "If no new nickname is provided, the nickname will be reset. New nicknames over 32 characters will be cut off.",
	usage: "botnick [Nickname]",
	example: "botnick Waddellé Bouté",
};

module.exports.permissions = {
	server: "MANAGE_NICKNAMES",
	bot: "CHANGE_NICKNAME",
};
