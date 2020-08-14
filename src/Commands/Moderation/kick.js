const { usageErr, getTarget, error, success } = require("../../Utilities/functions.js");

module.exports.run = async (bot, msg, args) => {
    // Variable and Error Management
    let toKick = getTarget(msg, args[0], true);

    if(toKick == msg.member) return msg.channel.send(error("Bro. You are literally so fucking stupid. Why do I have to deal with people like you. Seriously, use your brain."));
    if (!toKick) return msg.channel.send(usageErr("You didn't specify someone to kick.", "kick"));
    if(!toKick.kickable) return msg.channel.send(error("I'm not able to kick this user."))
    if (toKick.roles.highest.position >= msg.member.roles.highest.position) return msg.channel.send(error("This user is above or on the same level on the role hierachy as you, so I won't kick then."));

    // Reason Management
    let reasonProvided = args.slice(1).join(" ")
    let reason = reasonProvided ? `${args.splice(1).join(" ")}` : "No reason provided";
    let auditReason = `Responsible Moderator: ${msg.author.tag} || Reason: ${reason}`

    // Actual Kicking 
    await toBan.kick(auditReason)
    .then(b => {
        let embed = success(`**${b.user.username}** has successfully been kicked.`)
        .setFooter(`Reason: ${reason}`)
        msg.channel.send(embed)
    });
};
                 
module.exports.help = {
    name: "kick",
    category: "Moderation",
    description: "Kick a member.",
    usage: "kick <User> [Reason]",
    example: "kick @Uncoolin Dumbass" 
};

module.exports.permissions = {
    server: "KICK_MEMBERS"
};