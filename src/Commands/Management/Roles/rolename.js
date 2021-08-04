const { getRole, error, success } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	try {
		const role = getRole(msg, args[0]);
		const prior = role.name;
		const edited = await role.edit(
			{
				name: args.slice(1).join(" "),
			},
			`Responsible Moderator: ${msg.author.tag}`
		);
		msg.channel.send(success(`Successfully changed role name from **${prior}** to <@&${edited.id}> `));
	} catch (err) {
		console.error(err);
		msg.channel.send(error("Something went wrong. Make sure to provide a valid role."));
	}
};

module.exports.help = {
	name: "rolename",
	category: "Management",
	note: "Due to how command arguments are being parsed atm, `<Role>` only allows one word.",
	description: "Edit the name of a role",
	usage: "rolename <Role> <New setting>",
	example: "rolename OwOs UwUs",
};

module.exports.permissions = {
	server: "MANAGE_ROLES",
};
