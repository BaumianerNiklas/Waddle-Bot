import { APPLICATION_ID } from "#util/constants.js";
import * as dotenv from "dotenv";
dotenv.config();

import { deployCommands } from "iubus";

deployCommands({
	applicationId: APPLICATION_ID,
	token: process.env.BOT_TOKEN!,
	commandDir: "dist/commands",
	guildId: process.env.TESTING_GUILD_ID!,
	deployGlobally: false,
});
