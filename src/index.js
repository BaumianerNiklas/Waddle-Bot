// Loading Modules
const { Client, Collection } = require("discord.js");
const bot = new Client({
	partials: ["MESSAGE"],
});
require("dotenv").config();
const path = require("path");

// Setting Collections for Commands
bot.commands = new Collection();
bot.aliases = new Collection();

// Load Events and Commands
const loadCommands = require("./Handlers/Command");
loadCommands(bot, path.join(process.env.BASE_PATH, "Commands/**/*.js"));

const loadEvents = require("./Handlers/Event");
loadEvents(bot, path.join(process.env.BASE_PATH, "Events/**/*.js"));

module.exports.bot = bot;
bot.login(process.env.BOT_TOKEN);
