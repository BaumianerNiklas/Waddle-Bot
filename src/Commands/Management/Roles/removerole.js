const { getRole } = require("../../../Utilities/functions");
const { success } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	let role = getRole(msg, args.join(" "));
	const deleted = await role.delete(`Resonsible Moderator: ${msg.author.tag}`);
	msg.channel.send(success(`Sucessfully deleted role **${deleted.name} from the server.`));
};

module.exports.help = {
	name: "removerole",
	aliases: ["deleterole", "delrole"],
	category: "Management",
	description: "Delete a role from the server",
	usage: "removerole <Role>",
	example: "removerole Dunce",
	requiredArguments: 1,
};

module.exports.permissions = { server: "MANAGE_ROLES" };
