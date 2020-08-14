const { success } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	try {
		const role = await msg.guild.roles.create({
			data: {
				name: args.join(" "),
			},
			reason: `Responsible Moderator: ${msg.author.tag}`,
		});
		msg.channel.send(success(`Successfully added Role <@&${role.id}> to server.`));
	} catch (err) {
		console.error(err);
	}
};

module.exports.help = {
	name: "createrole",
	aliases: ["addrole", "crole", "rolecreate", "roleadd"],
	category: "Management",
	description: "Create a role on the server.",
	usage: "createrole <Rolename>",
	example: "createrole OwO",
};

module.exports.permissions = {
	server: "MANAGE_ROLES",
};
