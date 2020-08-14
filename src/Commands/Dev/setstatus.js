const { success, error } = require("../../Utilities/functions.js");

const { online, idle, dnd, offline } = require("../../Utilities/constants.js");

const statusEmotes = {
	online: online,
	idle: idle,
	dnd: dnd,
	offline: offline,
};

module.exports.run = async (bot, msg, args) => {
	if (msg.author.id !== process.env.OWNER_ID) return;

	const status = args[0] ? args[0].toLowerCase() : "online";
	const type = args[1] ? args[1].toUpperCase() : "WATCHING";
	const activity = args[2]
		? args.splice(2).join(" ")
		: `Cute Waddle Dees | ${process.env.PREFIX}help`;
	try {
		const presence = await bot.user.setPresence({
			activity: {
				name: activity,
				type: type,
			},
			status: status,
		});
		console.log(`Ac: ${activity} - st: ${status} - typ: ${type}`);
		msg.channel.send(
			success(
				`changed status to **${statusEmotes[presence.status]} ${
					presence.activities[0].type
				} ${presence.activities[0].name}**.`,
			),
		);
	} catch (err) {
		let embed = error("I had trouble changing my status.").addField("Error", err);
		msg.channel.send(embed);
	}
};

module.exports.help = {
	name: "setstatus",
	aliases: ["status", "changestatus"],
	category: "Dev",
	description: "Set the status of the bot.",
	usage: "setstatus <Status> <Type> <Activity>",
	example: "setstatus online watching cool owos",
};
