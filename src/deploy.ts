import * as dotenv from "dotenv";
dotenv.config();

import { deployCommands } from "iubus";

deployCommands({
	applicationId: "723224456671002674",
	token: process.env.BOT_TOKEN!,
	commandDir: "dist/commands",
	guildId: process.env.TESTING_GUILD_ID!,
	deployGlobally: false,
});
