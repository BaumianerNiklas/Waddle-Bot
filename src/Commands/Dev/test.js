const { formatFlags } = require("../../Utilities/functions");

module.exports.run = async (bot, msg, args) => {
	const bitFieldFlags = await msg.author.fetchFlags();
	const flags = bitFieldFlags.toArray();
	console.log(flags);
};

module.exports.help = {
	name: "test",
	aliases: ["t"],
	category: "Dev",
	description: "Test Best Commands weil Fabi Sexy",
	usage: "test",
	example: "tust",
};
