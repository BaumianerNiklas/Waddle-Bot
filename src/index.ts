import { config } from "dotenv";
config();
import WaddleBot from "#WaddleBot";

const bot = new WaddleBot();
await bot.login(process.env.BOT_TOKEN);
