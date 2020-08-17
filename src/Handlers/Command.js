const glob = require("glob");

module.exports.loadCommands = async (bot, path) => {
	glob(path, (err, matches) => {
		if (err) return console.error(err);
		let i = 0;
		console.log("Loading Commands...");
		for (const match of matches) {
			i++;
			const command = require(match);
			bot.commands.set(command.help.name, command);

			if (command.help.aliases) {
				for (const alias of command.help.aliases) {
					bot.aliases.set(alias, command);
				}
			}
		}
		console.log(`Finished Loading ${i} Commands`);
	});
};
