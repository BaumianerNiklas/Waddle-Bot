let { orange } = require("../../Utilities/constants.js");
let { usageErr } = require("../../Utilities/functions.js");
const { stripIndents } = require("common-tags");
const Discord = require("discord.js");

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

		let embed = new Discord.MessageEmbed()
			.setTitle(`Command: ${cmd.help.name} (${cmd.help.category})`)
			.setDescription(
				`**Description:** ${desc}\n**Note:** ${note}\n**Aliases:** ${aliases}\n**Usage:** ${usage}\n**Example:** \`${example}\`\n**Required Permissions:** ${permissions}`,
			)
			.setColor(orange)
			.setTimestamp()
			.setFooter(`Use ${prefix}help for a list of all commands`);

		if (cmd.subcommands) {
			let subcommands = ``;
			Object.keys(cmd.subcommands).forEach(key => {
				subcommands += `\`${cmd.subcommands[key].usage}\`: ${cmd.subcommands[key].description}\n`;
			});
			console.log(subcommands);
			embed.addField("Subcommands", subcommands);
		}

		return msg.channel.send(embed);
	}

	let botCmds = bot.commands.filter(c => c.help.category == "Bot").map(c => `\`${c.help.name}\``);

	let utilityCmds = bot.commands
		.filter(c => c.help.category == "Utility")
		.map(c => `\`${c.help.name}\``);

	let modCmds = bot.commands
		.filter(c => c.help.category == "Moderation")
		.map(c => `\`${c.help.name}\``);

	let funCmds = bot.commands.filter(c => c.help.category == "Fun").map(c => `\`${c.help.name}\``);

	let imgCmds = bot.commands
		.filter(c => c.help.category === "Image")
		.map(c => `\`${c.help.name}\``);

	let manageCmds = bot.commands
		.filter(c => c.help.category == "Management")
		.map(c => `\`${c.help.name}\``);

	let hiddenCmds = bot.commands.filter(
		c => c.help.category == "Hidden" || c.help.category == "Dev",
	).size;

	let embed = new Discord.MessageEmbed()
		.setTitle("Waddle Bot - Help")
		.setTimestamp()
		.setFooter(
			`Use ${prefix}${bot.commands.get("help").help.usage} for help on a specific command`,
		)
		.setDescription(
			stripIndents`**Command prefix** is \`${prefix}\`
    **Syntax:** <> - Required // [] - Optional // | - Choose between these options
    **Command Count:** ${bot.commands.size - hiddenCmds}`,
		)
		.setColor(msg.member.displayColor)

		.addField(`Bot [${botCmds.length}]`, botCmds.join(", "))
		.addField(`Moderatipn [${modCmds.length}]`, modCmds.join(", "))
		.addField(`Management [${manageCmds.length}]`, manageCmds.join(", "))
		.addField(`Utility [${utilityCmds.length}]`, utilityCmds.join(", "))
		.addField(`Fun [${funCmds.length}]`, funCmds.join(", "))
		.addField(`Image [${imgCmds.length}]`, imgCmds.join(", "));

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
