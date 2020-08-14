module.exports.run = async (bot, msg, args) => {
	msg.channel.send("Pong!").then(botmsg => {
		let ping = botmsg.createdTimestamp - msg.createdTimestamp;
		botmsg.edit(`Pong! \`-${ping}ms\``);
	});
};

module.exports.help = {
	name: "ping",
	category: "Bot",
	description: "Check my ping/latency",
	usage: "ping",
	example: "ping",
};
