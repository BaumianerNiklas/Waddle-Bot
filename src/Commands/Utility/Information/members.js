const { MessageEmbed } = require("discord.js");
const { getRole, hastebin } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	const role = getRole(msg, args.join(" "));
	const members = role.members.map((m) => `<@!${m.id}>`).join(", ");
	let haste;
	let text;
	if (members.length > 2048) {
		haste = await hastebin(
			role.members
				.map((m) => m.user.tag)
				.join(", ")
				.chunk(200)
				.join("\n")
		);
		text = `Result exceeded the 2048 character limit. [[Hastebin Link]](${haste})`;
	} else {
		text = members;
	}
	let embed = new MessageEmbed()
		.setTitle(`Members of ${role.name} [${role.members.size}]`)
		.setColor(role.hexColor)
		.setDescription(text);
	msg.channel.send(embed);
};

module.exports.help = {
	name: "members",
	aliases: ["listmembers"],
	category: "Utility",
	description: "See which people are in a role",
	usage: "members [Role]",
	example: "members Gamers",
};
