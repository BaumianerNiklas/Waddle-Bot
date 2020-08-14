module.exports.run = async (bot, msg, args) => {
    msg.delete();
    msg.channel.send(args.join(" "));
}

                 
module.exports.help = {
    name: "say",
    category: "Fun",
    description: "Let the bot say something",
    usage: "say <Text>",
    example: "say How",
    requiredArguments: 1,
}