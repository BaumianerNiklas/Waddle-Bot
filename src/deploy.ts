import { config } from "dotenv";
config();
import { REST } from "@discordjs/rest";
import { CommandHandler } from "#structures/CommandHandler.js";
import { GLOBAL_DEPLOY_URL, GUILD_DEPLOY_URL, TESTING_GUILD_ID } from "#util/constants.js";
import { logger } from "#util/logger.js";

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN!);

const commandHandler = new CommandHandler();
logger.debug("Starting to load commands...");
await commandHandler.registerCommands();
commandHandler.registerAPICommands();
logger.debug(`Finished loading ${commandHandler.APICommands.length} commands for deployment`);

try {
	if (process.env.NODE_ENV === "production" || process.argv[2]?.toLowerCase() === "global") {
		const payload = commandHandler.APICommands.filter(
			(apiCmd) => commandHandler.commands.get(apiCmd.name)?.testOnly === false
		);
		const ignoredCount = commandHandler.APICommands.length - payload.length;

		await rest.put(GLOBAL_DEPLOY_URL, {
			body: payload,
		});
		logger.info(`Sucessfully deployed ${payload.length} globally [Ignored ${ignoredCount}]`);
	} else {
		await rest.put(GUILD_DEPLOY_URL, {
			body: commandHandler.APICommands,
		});
		logger.info(
			`Sucessfully deployed ${commandHandler.APICommands.length} to development guild ${TESTING_GUILD_ID}`
		);
	}
} catch (e) {
	console.error(e);
	logger.fatal("Attempt at deploying commmands failed");
}
