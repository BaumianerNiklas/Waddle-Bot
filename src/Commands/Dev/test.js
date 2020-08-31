const { default: axios } = require("axios");

module.exports.run = async (bot, msg, args) => {
	const response = await axios({
		url: "http://either.io",
		method: "GET",
		headers: {
			accept: "application/json",
		},
	});
	console.log(response);
};

module.exports.help = {
	name: "test",
	aliases: ["t"],
	category: "Dev",
	description: "Test Best Commands weil Fabi Sexy",
	usage: "test",
	example: "tust",
};
