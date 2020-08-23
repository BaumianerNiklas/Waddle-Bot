const { marioCoin } = require("../../Utilities/constants.js");

module.exports.run = async (bot, msg, args) => {
	const choice = ["heads", "tails"].random();

	let botMsg = await msg.channel.send(`${marioCoin} Flipping...`);
	setTimeout(() => {
		botMsg.edit(`${marioCoin} Your coin landed on **${choice}**!`);
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
