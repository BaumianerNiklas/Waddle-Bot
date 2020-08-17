const {
	default: { get },
} = require("axios");
const { randomArr } = require("../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	const response = await get("https://api.chucknorris.io/jokes/random");
	msg.channel.send(response.data.value);
};

module.exports.help = {
	name: "chucknorris",
	aliases: ["norris", "chuck"],
	category: "Fun",
	description: "Get random chuck norris joke.",
	note: "Jokes provided by https://api.chucknorris.io",
	usage: "trivia",
	example: "trivia",
};
