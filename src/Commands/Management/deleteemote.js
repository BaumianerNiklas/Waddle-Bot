const { getEmote, success, usageErr } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
	let emote = getEmote(args[0], msg.guild);
	try {
		const deleted = await emote.delete();
		let successEmb = success(`deleted emote **${deleted.name}** from the server!`).setImage(
			deleted.url,
		);
		msg.channel.send(successEmb);
	} catch (err) {
		msg.channel.send(usageErr(`I had trouble deleting that emote.`, "emote"));
		console.error(err);
	}
};

module.exports.help = {
	name: "deleteemote",
	aliases: ["delmote"],
	category: "Management",
	description: "Delete an Emote from the current server",
	usage: "deleteemote <Emote>",
	example: "deleteemote :Poggers:",
};

module.exports.permissions = {
	server: "MANAGE_EMOJIS",
};
