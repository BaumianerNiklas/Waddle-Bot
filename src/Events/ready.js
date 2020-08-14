const { text: ascii } = require("figlet");

module.exports = bot => {
	ascii(bot.user.tag, (err, data) => {
		console.log(data);
	});
	console.log(`${bot.user.username} is online!`);
	console.log(`Server Count: ${bot.guilds.cache.size}`);
	console.log(`User Count: ${bot.users.cache.size}`);

	bot.user.setPresence({
		activity: {
			name: `Cute Waddle Dees | ${process.env.PREFIX}help`,
			type: "WATCHING",
		},
		status: "online",
	});
};
