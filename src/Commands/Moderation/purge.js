const { usageErr, success, error } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	if (args.length == 0)
		return msg.channel.send(usageErr("Please provide a valid number.", "purge"));

	let purgeAmount = Number.parseInt(args[0], 10);
	if (purgeAmount < 1 || purgeAmount > 100)
		return msg.channel.send(error("Please provide a number between 1 and 100."));
	if (isNaN(purgeAmount))
		return msg.channel.send(usageErr("Please provide a valid number", "purge"));

	await msg.channel.bulkDelete(purgeAmount + 1);
	const botMsg = await msg.channel.send(success(`deleted **${purgeAmount}** messages!`));
	await botMsg.delete({ timeout: 3000 });
};

module.exports.help = {
	name: "purge",
	aliases: ["clear"],
	category: "Moderation",
	description: "Purge a specified amount of messages in the current channel",
	usage: "purge <Amount>",
	example: "purge 15",
};

module.exports.permissions = {
	server: "MANAGE_MESSAGES",
};
