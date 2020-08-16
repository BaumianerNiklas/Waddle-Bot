const axios = require("axios").default;

module.exports.run = async (bot, msg, args) => {
	const response = await axios({
		method: "GET",
		url: "https://icanhazdadjoke.com/",
		headers: {
			Accept: "application/json",
			"User-Agent": "GitHub repository for discord bot: ",
		},
	});
	msg.channel.send(response.data.joke);
};

module.exports.help = {
	name: "dadjoke",
	aliases: ["joke"],
	category: "Fun",
	description: "Get a random dadjoke",
	note: "Jokes are provided by the https://icanhazdadjoke.com API",
	usage: "dadjoke",
	example: "dadjoke",
};
