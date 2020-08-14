let { orange } = require("../../Utilities/constants.js");
let { usageErr } = require("../../Utilities/constants.js");
const Discord = require("discord.js");
const urban = require("urban")

module.exports.run = async (bot, msg, args) => {
    let search = urban(args.join(" "))
    if(!search) return msg.channel.send(usageErr("Please provide a search term!", "urban"))
    
    try {
        search.first(res => {
            if (!res) return msg.channel.send("Sorry, I couldn't find anything matching your search.")

            let embed = new Discord.MessageEmbed()
            .setAuthor(`Written by: ${res.author}`)
            .setThumbnail("http://www.cnplugins.com/uploads/crximage/201801/easy-urban-dictionary-loo-logo-1.1.2.jpg")
            .setColor(orange)
            .setTitle(res.word)
            .setDescription(res.definition)
            .addField("Example", res.example || "none")
            .setFooter(`Upvotes: ${res.thumbs_up} | Downvotes: ${res.thumbs_down}`);
            msg.channel.send(embed);
        })

    } catch(err) {
        return msg.channel.send("Sorry, something went wrong. Try again, maybe with a different search query.")
    }
    
}


module.exports.help = {
    name: "urban",
    aliases: ["ub", "dictionary", "dict", "urbandictionary", "define"],
    category: "Fun",
    description: "Look up something on urban dictionary! ",
    usage: "urban <Term>",
    example: "urban Tea" 
}