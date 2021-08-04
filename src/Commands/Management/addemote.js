const { usageErr, success } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	try {
		let toAdd = args[1] || msg.attachments.first().url;
		const added = await msg.guild.emojis.create(toAdd, args[0]);
		let embed = success(`added emote **${added.name}** to the server!`).setImage(added.url);
		msg.channel.send(embed);
	} catch (err) {
		msg.channel.send(usageErr("Failed to add emote. Make sure your emote is not too big.", "emote"));
		console.error(err);
	}
};

module.exports.help = {
	name: "addemote",
	aliases: ["emoteadd", "aem", "addemoji", "emojiadd"],
	category: "Management",
	description: "Add an Emote to the server",
	usage: "addemote <Link|File to Emote>",
	example: "addemote https://example.com/coolemote.png",
};

module.exports.permissions = {
	server: "MANAGE_EMOJIS",
};
