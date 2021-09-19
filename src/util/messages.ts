export const SUCCESS = (message: string) => `Sucessfully ${message}`;
export const FETCHING_API_FAILED = (message: string) => `Sorry, something went wrong while trying to fetch ${message}.`;

export const EMOTE_NOT_ON_SERVER = (emoteName?: string) => {
	if (emoteName) return `The emote **${emoteName}** doesn't appear to be on this server.`;
	else return "That emote doesn't appear to be on this server.";
};
