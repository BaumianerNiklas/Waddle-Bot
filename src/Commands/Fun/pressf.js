module.exports.run = async (bot, msg, args) => {
    let argString = args.join(" ");
    let reacted = [];

    let rip = argString ? ` to **${argString}**` : ""
    let fMsg = await msg.channel.send(`React with 🇫 to pay your respects${rip}.`)
    fMsg.react("🇫");

    const collector = await fMsg.createReactionCollector(r => r.emoji.name == "🇫", { time: 60000 });
    collector.on('collect', async (r, u) => {
     
        if (reacted.includes(u.id)) return;
        if (u.bot) return;

        await msg.channel.send(`**${u.username}** has paid their respects.`);
        reacted.push(u.id);
    })
}

module.exports.help = {
    name: "pressf",
    aliases: ["f"],
    category: "Fun",
    description: "Let users react with 🇫 to let them pay their respects.",
    note: "Credits for the original concept / command go to Floof Bot.",
    usage: "pressf [Text]",
    example: "pressf Cara" 

}