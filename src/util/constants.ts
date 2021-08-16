import { Snowflake } from "discord-api-types";

export const APPLICATION_ID = "723224456671002674" as Snowflake;
export const TESTING_GUILD = "859164137187967006" as Snowflake;
export const BOT_COLOR = 0xf39c12;

export const commandOptionTypes: Record<string, number> = {
	SUB_COMMAND: 1,
	SUB_COMMAND_GROUP: 2,
	STRING: 3,
	INTEGER: 4,
	BOOLEAN: 5,
	USER: 6,
	CHANNEL: 7,
	ROLE: 8,
	MENTIONABLE: 9,
	NUMBER: 10,
};

export const commandTypes: Record<string, number> = {
	CHAT_INPUT: 1,
	USER: 2,
	MESSAGE: 3,
};

export const commandOptionRegex = new RegExp(Object.keys(commandOptionTypes).join("|"), "g");
export const commandTypeRegex = new RegExp(Object.keys(commandTypes).join("|"), "g");
