let { orange } = require("../../Utilities/constants.js");
let { usageErr } = require("../../Utilities/functions.js");
const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (bot, msg, args) => {
	let prefix = process.env.PREFIX;

	if (args.length > 0) {
		let cmd = bot.commands.get(args[0]) || bot.aliases.get(args[0]);
		if (!cmd) return msg.channel.send(usageErr("Invalid Command.", "help"));

		if (cmd.category == "Dev" && msg.author.id !== process.env.OWNER_ID)
			return msg.channel.send("Nice try, but you can't use this command!");

		let desc = cmd.help.description;
		let aliases = cmd.help.aliases ? cmd.help.aliases.join(", ") : "none";
		let usage = "`" + prefix + cmd.help.usage + "`";
		let example = "`" + prefix + cmd.help.example + "`";
		let permissions = cmd.permissions ? cmd.permissions.server : "none";
		let note = cmd.help.note ? cmd.help.note : "none";

		let embed = new MessageEmbed()
			.setTitle(`Command: ${cmd.help.name} (${cmd.help.category})`)
			.setDescription(
				`**Description:** ${desc}\n**Note:** ${note}\n**Aliases:** ${aliases}\n**Usage:** ${usage}\n**Example:** \`${example}\`\n**Required Permissions:** ${permissions}`
			)
			.setColor(orange)
			.setTimestamp()
			.setFooter(`Use ${prefix}help for a list of all commands`);

		if (cmd.subcommands) {
			let subcommands = ``;
			Object.keys(cmd.subcommands).forEach((key) => {
				subcommands += `\`${cmd.subcommands[key].usage}\`: ${cmd.subcommands[key].description}\n`;
			});
			console.log(subcommands);
			embed.addField("Subcommands", subcommands);
		}

		return msg.channel.send(embed);
	}

	let hiddenCmds = bot.commands.filter((cmd) => cmd.help.category == "Hidden" || cmd.help.category == "Dev").size;

	let embed = new MessageEmbed()
		.setTitle("Waddle Bot - Help")
		.setTimestamp()
		.setFooter(`Use ${prefix}${bot.commands.get("help").help.usage} for help on a specific command`)
		.setDescription(
			stripIndents`**Command prefix** is \`${prefix}\`
    **Syntax:** <> - Required // [] - Optional // | - Choose between these options
    **Command Count:** ${bot.commands.size - hiddenCmds}`
		)
		.setColor(msg.member.displayColor);

	let catCmds;
	["Bot", "Moderation", "Management", "Utility", "Fun", "Image"].forEach((c) => {
		catCmds = bot.commands.filter((cmd) => cmd.help.category == c).map((cmd) => `\`${cmd.help.name}\``);
		embed.addField(`${c} [${catCmds.length}]`, catCmds.join(", "));
	});

	msg.channel.send(embed);
};

module.exports.help = {
	name: "help",
	aliases: ["helpme", "commands", "cmds"],
	category: "Bot",
	description: "Display Information about all commands or a specific command",
	usage: "help [Command]",
	example: "help waddlegif",
};
