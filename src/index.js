// Loading Modules
const Discord = require("discord.js");
const bot = new Discord.Client();
require("dotenv").config();

// Setting Collections for Commands
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

// Load Events and Commands
const { loadCommands } = require("./Handlers/Command");
loadCommands(bot, "/Users/nobermeier/Documents/Coding/Waddle-Bot/src/Commands/**/*.js");

const { loadEvents } = require("./Handlers/Event");
loadEvents(bot, "/Users/nobermeier/Documents/Coding/Waddle-Bot/src/Events/**/*.js");

module.exports.bot = bot;
bot.login(process.env.BOT_TOKEN);
