const { getTarget, success, error } = require("../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	let newNickString = args.splice(1).join(" ");

	const target = getTarget(msg, args[0], true);
	if (!target) return msg.channel.send(error("Invalid target!"));
	let mention = `<@!${target.user.id}>`;

	const newNick = newNickString ? newNickString.substring(0, 32) : "";
	const onSuccess = newNick
		? `changed the nickname of ${mention} on this server to **${newNick}**`
		: `reset the nickname of ${mention} on this server`;

	try {
		await target.setNickname(newNick);
		msg.channel.send(success(onSuccess));
	} catch (err) {
		console.error(err);
		msg.channel.send(
			error("Sorry, something went wrong while running this command internally. Try again."),
		);
	}
};

module.exports.help = {
	name: "nick",
	aliases: ["setnick"],
	category: "Moderation",
	description: "Change the Nickname of a member",
	usage: "nick <Member> <New Nickname>",
	example: "nick @sda Uncool Member",
};

module.exports.permissions = {
	server: "MANAGE_NICKNAMES",
	bot: "MANAGE_NICKNAMES",
};
