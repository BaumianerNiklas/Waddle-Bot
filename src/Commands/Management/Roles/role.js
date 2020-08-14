const { getRole, getTarget, usageErr, error, success } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {};

module.exports.help = {
	name: "role",
	category: "Utility",
	description: "Give/remove a role to/from a member",
	usage: "role <'add'|'remove'> <User> <Role>",
	example: "role add @Neon Cool Guy",
	requiredArguments: 3,
};

module.exports.subcommands = {
	add: {
		run: async (bot, msg, args) => {
			try {
				let role = getRole(msg, args.slice(2).join(" "));
				let target = getTarget(msg, args[1], true);
				if (!target || !role)
					return msg.channel.send(
						usageErr("Please provide a valid user and role.", "role"),
					);

				if (target.user.id === msg.author.id) {
					return msg.channel.send(error("You can't run this command on yourself."));
				}
				if (target.roles.highest.position > msg.member.roles.highes.position) {
					return msg.channel.send(
						error(
							"This user is above you in the role hierachy, so I won't run this command on them.",
						),
					);
				}

				const member = await target.roles.add(
					role.id,
					`Responsible Moderator: ${msg.author.tag}`,
				);
				msg.channel.send(
					success(`Successfully added role <@&${role.id}> to <@!${member.user.id}>.`),
				);
			} catch (err) {
				console.error(err);
				msg.channel.send(
					"Failed to give role to user. Make sure I am **Above them** in the role hierachy.",
				);
			}
		},
		name: "add",
		description: "Add a role to a user",
		usage: "add <User> <Role>",
	},

	remove: {
		run: async (bot, msg, args) => {
			try {
				let role = getRole(msg, args.slice(2).join(" "));
				let target = getTarget(msg, args[1], true);

				if (!target || !role) {
					return msg.channel.send(
						usageErr("Please provide a valid user and role.", "role"),
					);
				}

				if (target.user.id === msg.author.id) {
					return msg.channel.send(error("You can't run this command on yourself."));
				}

				if (target.roles.highest.position > msg.member.roles.highes.position) {
					return msg.channel.send(
						error(
							"This user is above you in the role hierachy, so I won't run this command on them.",
						),
					);
				}

				const member = await target.roles.remove(
					role.id,
					`Responsible Moderator: ${msg.author.tag}`,
				);
				msg.channel.send(
					success(`Successfully removed role <@&${role.id}> from <@!${member.user.id}>.`),
				);
			} catch (err) {
				console.error(err);
				msg.channel.send(
					error(
						"Failed to give role to user. Make sure I am **above them** in the role hierachy.",
					),
				);
			}
		},
		name: "remove",
		description: "Remove a role from a member",
		usage: "remove <User> <Role>",
	},
};

module.exports.permissions = {
	server: "MANAGE_ROLES",
};
