import { config } from "dotenv";
config();
import { WaddleBot } from "#structures/WaddleBot.js";

const bot = new WaddleBot();
await bot.init();
