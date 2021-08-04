const { usageErr, getTarget, error, success } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	// Variable and Error Management
	let toBan = getTarget(msg, args[0], true);

	if (toBan == msg.member)
		return msg.channel.send(
			error(
				"Bro. You are literally so fucking stupid. Why do I have to deal with people like you. Seriously, use your brain."
			)
		);
	if (!toBan) return msg.channel.send(usageErr("You didn't specify someone to softban.", "softban"));
	if (!toBan.bannable) return msg.channel.send(error("I'm not able to softban that user."));
	if (toBan.roles.highest.position >= msg.member.roles.highest.position)
		return msg.channel.send(
			error("This user is above or on the same level on the role hierachy as you, so I won't softban then.")
		);

	// Reason Management
	let reasonProvided = args.slice(1).join(" ");
	let reason = reasonProvided ? `${args.splice(1).join(" ")}` : "No reason provided";
	let auditReason = `[SOFTBAN] Responsible Moderator: ${msg.author.tag} || Reason: ${reason}`;

	// Actual Banning

	async function softban(member) {
		try {
			let banned = await member.ban({ days: 7, reason: auditReason });
			let banUser = await msg.guild.fetchBan(banned.user);
			let unbanned = await msg.guild.members.unban(banUser.user, auditReason);

			let embed = success(`softbanned **${unbanned.tag}**.`).setFooter(`Reason: ${reason}`);
			await msg.channel.send(embed);
		} catch (e) {
			msg.channel.send(error("Something went wrong."));
			return console.error(e);
		}
	}

	await softban(toBan);
};

module.exports.help = {
	name: "softban",
	category: "Moderation",
	description: "Softban a member (Ban and immediate Unban).",
	usage: "softban <User> [Reason]",
	example: "softban @Luigia bro stop",
};

module.exports.permissions = {
	server: "BAN_MEMBERS",
};
