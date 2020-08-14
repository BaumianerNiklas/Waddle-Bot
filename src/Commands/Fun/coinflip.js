const { marioCoin } = require("../../Utilities/constants.js");
const { randomArr } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	const choices = ["heads", "tails"];
	const flip = randomArr(choices);

	let botMsg = await msg.channel.send(`${marioCoin} Flipping...`);
	setTimeout(() => {
		botMsg.edit(`${marioCoin} Your coin landed on **${flip}**!`);
	}, 1500);
};

module.exports.help = {
	name: "coinflip",
	aliases: ["flip", "coin", "cf", "flipcoin"],
	category: "Fun",
	description: "Flip a coin!",
	usage: "coinflip",
	example: "coinflip",
};
