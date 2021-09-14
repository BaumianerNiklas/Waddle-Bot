import type { Snowflake } from "discord-api-types";
import { Permissions } from "discord.js";

// Metainformation/Snowflakes
export const BOT_OWNER_ID = "337588047111520257" as Snowflake;
export const APPLICATION_ID = "723224456671002674" as Snowflake;
export const TESTING_GUILD = "859164137187967006" as Snowflake;

// Colors
export const COLOR_BOT = 0xf39c12;
export const COLOR_GREEN = 0x2ecc71;
export const COLOR_RED = 0xd84315;

// Emotes
export const EMOTE_GREEN_TICK = "<:yesTick:886707082642980884>";
export const EMOTE_DANGER = "<:danger:884757407199297588>";
export const EMOTE_SMALL_ARROW_R = "<:smallArrowR:884890038679253052>";
export const EMOTE_FIELD = "<:field:879323600635699240>";
export const EMOTE_ORANGE_CLOCK = "<:clock:879366314077089842>";

// Utilities
export const BOT_REQUIRED_PERMISSIONS = [
	Permissions.FLAGS.VIEW_CHANNEL,
	Permissions.FLAGS.SEND_MESSAGES,
	Permissions.FLAGS.EMBED_LINKS,
	Permissions.FLAGS.ATTACH_FILES,
	Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
];

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
