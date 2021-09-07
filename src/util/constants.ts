import type { Snowflake } from "discord-api-types";

// Metainformation/Snowflakes
export const BOT_OWNER_ID = "337588047111520257" as Snowflake;
export const APPLICATION_ID = "723224456671002674" as Snowflake;
export const TESTING_GUILD = "859164137187967006" as Snowflake;

// Colors
export const COLOR_BOT = 0xf39c12;
export const COLOR_RED = 0xd84315;

// Emotes
export const EMOTE_DANGER = "<:danger:884757407199297588>";
export const EMOTE_FIELD = "<:field:879323600635699240>";
export const EMOTE_ORANGE_CLOCK = "<:clock:879366314077089842>";

// Utilities
export const COMMAND_OPTION_TYPES: Record<string, number> = {
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

export const COMMAND_TYPES: Record<string, number> = {
	CHAT_INPUT: 1,
	USER: 2,
	MESSAGE: 3,
};
