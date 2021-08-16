import { config } from "dotenv";
config();
import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { join } from "path";
import CommandHandler from "#structures/CommandHandler.js";
import { APPLICATION_ID, TESTING_GUILD } from "#util/constants.js";
import logger from "#util/logger.js";

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN!);

const commandHandler = new CommandHandler();
await commandHandler.registerCommands(join(process.env.BASE_PATH!, "dist/commands"));
commandHandler.registerAPICommands();

try {
	if (process.env.NODE_ENV === "production" || process.argv[2]?.toLowerCase() === "global") {
		await rest.put(Routes.applicationCommands(APPLICATION_ID), {
			body: commandHandler.APICommands,
		});
		logger.info(`Sucessfully deployed ${commandHandler.APICommands.length} globally`);
	} else {
		await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, TESTING_GUILD), {
			body: commandHandler.APICommands,
		});
		logger.info(`Sucessfully deployed ${commandHandler.APICommands.length} to development guild ${TESTING_GUILD}.`);
	}
} catch (e) {
	console.error(e);
	logger.fatal("Failed to deploy commands");
}
