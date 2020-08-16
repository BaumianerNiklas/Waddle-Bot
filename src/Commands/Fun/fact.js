const { default: axios } = require("axios");

module.exports.run = async (bot, msg, args) => {
	const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
	msg.channel.send(response.data.text);
};

module.exports.help = {
	name: "fact",
	aliases: ["randomfact", "funfact", "uselessfact"],
	category: "Fun",
	description: "Get a random useless fact.",
	note: "Facts are from the https://uselessfacts.jsph.pl/ API.",
	usage: "fact",
	example: "fact",
};
