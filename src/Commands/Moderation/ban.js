const {
	usageErr,
	getTarget,
	error,
	success,
} = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	// Variable and Error Management
	let toBan = getTarget(msg, args[0], true);

	if (toBan == msg.member)
		return msg.channel.send(error("You can't ban yourself, dummy."));
	if (!toBan)
		return msg.channel.send(
			usageErr("You didn't specify someone to ban.", "ban"),
		);
	if (!toBan.bannable)
		return msg.channel.send(error("I'm not able to ban that user."));
	if (toBan.roles.highest.position >= msg.member.roles.highest.position)
		return msg.channel.send(
			error(
				"This user is above or on the same level on the role hierachy as you, so I won't ban then.",
			),
		);

	// Reason Management
	let reasonProvided = args.slice(1).join(" ");
	let reason = reasonProvided
		? `${args.splice(1).join(" ")}`
		: "No reason provided";
	let auditReason = `Responsible Moderator: ${msg.author.tag} || Reason: ${reason}`;

	// Actual Banning
	await toBan.ban({ days: 7, reason: auditReason }).then(b => {
		let embed = success(
			`**${b.user.username}** has successfully been banned.`,
		).setFooter(`Reason: ${reason}`);
		msg.channel.send(embed);
	});
};

module.exports.help = {
	name: "ban",
	category: "Moderation",
	description: "Ban a member.",
	usage: "ban <User> [Reason]",
	example: "ban @Viridio Not nice",
	requiredArguments: 1,
};

module.exports.permissions = {
	server: "BAN_MEMBERS",
};
