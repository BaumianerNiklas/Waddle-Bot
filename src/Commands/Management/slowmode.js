const { success, usageErr, error, getChannel } = require("../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	const time = Number.parseInt(args[0]) || 0;
	if (time > 21600 || time < 0)
		return msg.channel.send(usageErr("Please provide a valid number from 0 to 21600!", "slowmode"));

	try {
		const chan = getChannel(msg, args[0]) || msg.channel;
		await chan.setRateLimitPerUser(time, `Responsible Moderator: ${msg.author.tag}`);
		msg.channel.send(success(`set slowmode in <#${chan.id}> to **${time} seconds**.`));
	} catch (err) {
		console.error(err);
		msg.channel.send(error("Something went wrong."));
	}
};

module.exports.help = {
	name: "slowmode",
	category: "Management",
	description: "Set the slowmode in the current channel",
	note: "This allows for more customizable slowmode times than via the regular discord feature. If no channel is provided, changes slowmode in the current channel.",
	usage: "slowmode <Time (Seconds)> [Channel]",
	example: "slowmode 5",
};

module.exports.permissions = {
	server: "MANAGE_CHANNELS",
};
