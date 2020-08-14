const { success, error } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	// Variable and Error Management
	let toUnban;
	await msg.guild
		.fetchBan(args[0])
		.then(b => (toUnban = b.user))
		.catch(() =>
			msg.channel.send(
				error(
					"I can't find that user. Make sure to use an ID of an User that **is actually banned**.",
				),
			),
		);
	if (!toUnban) return;

	// Reason Management
	let reasonProvided = args.slice(1).join(" ");
	let reason = reasonProvided ? args.splice(1).join(" ") : "No reason provided";
	let auditReason = `Responsible Moderator: ${msg.author.tag} || Reason: ${reason}`;

	// Unbanning
	await msg.guild.members.unban(toUnban, auditReason).then(u => {
		let embed = success(`unbanned **${u.tag}**.`).setFooter(`Reason: ${reason}`);
		msg.channel.send(embed);
	});
};

module.exports.help = {
	name: "unban",
	category: "Moderation",
	description: "Unban a member.",
	usage: "unban <User (ID)> [Reason]",
	example: "unban 123456789012345678 U cool",
};

module.exports.permissions = {
	server: "BAN_MEMBERS",
};
