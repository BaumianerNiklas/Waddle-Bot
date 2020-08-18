const {
	default: { get },
} = require("axios");
const { usageErr } = require("../../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	let arg = args[0] ? args[0].toLowerCase() : null;
	try {
		if (!arg || arg === "random") {
			endpoint = "random";
		} else {
			endpoint = arg;
		}
		const response = await get(`http://numbersapi.com/${endpoint}/trivia`);
		msg.channel.send(response.data);
	} catch (err) {
		msg.channel.send(usageErr("You provided an invalid number!", "numberfact"));
	}
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
