const glob = require("glob");

module.exports = async (bot, path) => {
	glob(path, (err, matches) => {
		if (err) console.error(err);
		let i = 0;
		console.log("Loading Events...");
		for (const match of matches) {
			i++;

			const event = require(match);
			const eventName = match.substring(match.lastIndexOf("/") + 1, match.indexOf(".js"));

			bot.on(eventName, event.bind(null, bot));
		}
		console.log(`Finished loading ${i} Events`);
	});
};
