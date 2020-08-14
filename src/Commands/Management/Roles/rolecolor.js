const { getRole, error, success, cleanColor } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	try {
		const role = getRole(msg, args[0]);
		const prior = role.hexColor;
		await role.edit(
			{
				color: cleanColor(args[1]),
			},
			`Responsible Moderator: ${msg.author.tag}`,
		);
		let embed = success(
			`changed role color from **${prior}** to **${role.hexColor}**`,
		).setThumbnail(`https://colorhexa.com/${role}.hexColor.slice(1)}.png`);
		msg.channel.send(embed);
	} catch (err) {
		console.error(err);
		msg.channel.send(
			error("Something went wrong. Make sure to provide a valid hexadecimal color."),
		);
	}
};

module.exports.help = {
	name: "rolecolor",
	category: "Management",
	note: "Due to how command arguments are being parsed atm, `<Role>` only allows one word.",
	description: "Edit the color of a role",
	usage: "rolename <Role> <Color (Hex)>",
	example: "rolecolor Mods #123DEF",
};

module.exports.permissions = {
	server: "MANAGE_ROLES",
};
