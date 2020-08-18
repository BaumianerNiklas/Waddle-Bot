const axios = require("axios").default;
const { usageErr } = require("../../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	let endpoint;
	let arg = args[0] ? args[0].toLowerCase() : null;
	try {
		if (!arg) {
			let today = new Date(Date.now());
			endpoint = today.getMonth() + 1 + "/" + today.getDate();
		} else if (arg === "random") {
			endpoint = "random";
		} else {
			endpoint = arg;
		}
		const response = await axios.get(`http://numbersapi.com/${endpoint}/date`);
		msg.channel.send(response.data);
	} catch (err) {
		msg.channel.send(usageErr("You provided an invalid date!", "onthisday"));
	}
};

module.exports.help = {
	name: "onthisday",
	aliases: ["history", "date"],
	category: "Fun",
	description: "Show some information about what happened in history on the current day.",
	usage: "onthisday [date|'random']",
	example: "onthisday 6/9",
};
