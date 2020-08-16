const { error } = require("../Utilities/functions");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { orange } = require("../Utilities/constants");

module.exports = async (bot, msg) => {
	if (msg.author.bot || !msg.guild) return;

	const prefix = process.env.PREFIX;
	const regex = new RegExp(`^<@!?${bot.user.id}>`);
	if (msg.content.match(regex)) {
		let embed = new MessageEmbed()
			.setTitle("Hi! I'm Waddle Bot.")
			.setColor(orange)
			.setTimestamp()
			.setDescription(stripIndents`My current global command prefix is \`${prefix}\` (There will be a way to change this in the future).
        If you want to see all my commands run \`${prefix}${
			bot.commands.get("help").help.name
		}\`.`);
		msg.channel.send(embed);
	}

	if (!msg.content.toLowerCase().startsWith(prefix)) return;

	// if (msg.content.match(/"(\S\s+)"/g).length) {
	// }
	let command = msg.content.split(" ")[0].substr(prefix.length).toLowerCase();
	let args = msg.content.split(" ").slice(1);

	let cmd = bot.commands.get(command) || bot.aliases.get(command);
	if (!cmd) return;
	if (cmd.permissions) {
		if (cmd.permissions.server && !msg.member.hasPermission(cmd.permissions.server)) {
			return msg.channel.send(
				error(
					`You're missing the **${cmd.permissions.server}** Permission to use this command!`,
				),
			);
		}
		if (cmd.permissions.bot && !msg.guild.me.hasPermission(cmd.permissions.bot)) {
			return msg.channel.send(
				error(
					`I'm missing the **${cmd.permissions.bot}**s Permissions to run this command!`,
				),
			);
		}
	}

	if (cmd.help.requiredArguments && args.length < cmd.help.requiredArguments) {
		return await bot.commands.get("help").run(bot, msg, [cmd.help.name]);
	}
	let subCommandRan = false;
	if (cmd.subcommands && args.length) {
		Object.keys(cmd.subcommands).forEach(key => {
			let sc = cmd.subcommands[key];

			if (args[0].toLowerCase() === sc.name) {
				console.log(sc);
				console.log("Example: " + sc.example);
				console.log("Description: " + sc.description);
				sc.run(bot, msg, args);
				subCommandRan = true;
			}
		});
	}
	if (subCommandRan) return;
	await cmd.run(bot, msg, args);
	console.log(
		`A command has been run! Command: ${cmd.help.name} || Args: ${args} || Full Message: ${msg.content}`,
	);
	console.log(
		`${msg.author.username} (${msg.author.id}) || Guild: ${msg.guild.name} (${msg.guild.id})|| Channel: ${msg.channel.name}\n--------`,
	);
};
