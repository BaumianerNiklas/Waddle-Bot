const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");
const { error } = require("../../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	let endpoint = args.length ? `country/${args[0].toLowerCase()}` : "total";

	try {
		const response = await axios.get(`https://covid2019-api.herokuapp.com/v2/${endpoint}`);
		console.log(response.data.data);
		const { confirmed, deaths, recovered, active, location } = response.data.data;

		let embed = new MessageEmbed()
			.setTitle(`CoVID-19 Info (${location || "Total"})`)
			.setThumbnail(
				"https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg",
			)
			.setColor("#ba2520")
			.addField("Total Cases", confirmed.toLocaleString(), true)
			.addField("Deaths", deaths.toLocaleString(), true)
			.addField("\u200b", "\u200b", true) // Empty field
			.addField("Recovered", recovered.toLocaleString(), true)
			.addField("Active Cases", active.toLocaleString(), true)
			.addField("\u200b", "\u200b", true); // Empty field

		msg.channel.send(embed);
	} catch (e) {
		msg.channel.send(error("You provided an invalid country! Please try again."));
	}
};

module.exports.help = {
	name: "covid",
	aliases: ["corona", "covid19"],
	category: "Utility",
	description: "Get information about the current state of CoViD-19 in total or in a specific country.",
	note: "Data is provided from the https://covid2019-api.herokuapp.com API.",
	usage: "covid [Country]",
	example: "covid germany",
};
