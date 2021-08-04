module.exports = async (bot, guild) => {
	console.log(`${bot.user.username} has been removed from a guild!`);
	console.log(
		`Name: ${guild.name} | ID: ${guild.id} | Member Count: ${guild.memberCount}\nOwner: ${guild.owner.user.tag} (${guild.ownerID})`
	);
};
