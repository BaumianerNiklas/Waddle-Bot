const { getTarget, getAvatar } = require("../../../Utilities/functions");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    const target = getTarget(msg, args[0]);
    let embed = new MessageEmbed()
    .setImage(getAvatar(target.user))
    .setColor(target.displayColor)
    .setTitle(`${target.user.username} - Avatar`)
    msg.channel.send(embed);
}

                 
module.exports.help = {
    name: "avatar",
    aliases: ["av"],
    category: "Utility",
    description: "Get the avatar from a user",
    usage: "avatar [User]",
    example: "avatar @Waddle Bot" 
}