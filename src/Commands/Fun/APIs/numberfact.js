const {
	default: { get },
} = require("axios");

module.exports.run = async (bot, msg, args) => {
	const response = await get("http://numbersapi.com/random/trivia");
	msg.channel.send(response.data);
};

module.exports.help = {
	name: "numberfact",
	aliases: ["numbertrivia"],
	category: "Fun",
	description: "Get a random numberfact",
	note: "Facts provided by https://numbersapi.com",
	usage: "numberfact",
	example: "numberfact",
};
