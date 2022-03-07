import { PermissionFlagsBits as Permissions } from "discord.js";

// General
export const USER_AGENT = "Waddle Bot (https://github.com/BaumianerNiklas/Waddle-Bot)";

// Metainformation/Snowflakes
export const BOT_OWNER_ID = "337588047111520257";
export const APPLICATION_ID = "723224456671002674";
export const TESTING_GUILD_ID = "859164137187967006";

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
export const EMBED_MAX_LENGTH = 4096;
export const BOT_REQUIRED_PERMISSIONS = [
	Permissions.ViewChannel,
	Permissions.SendMessages,
	Permissions.EmbedLinks,
	Permissions.AttachFiles,
	Permissions.UseExternalEmojis,
];
export const GLOBAL_DEPLOY_URL = `/applications/${APPLICATION_ID}/commands` as const;
export const GUILD_DEPLOY_URL = `/applications/${APPLICATION_ID}/guilds/${TESTING_GUILD_ID}/commands` as const;
