// TODO: better name
export function unixToDiscordTimestamp(unixTimestamp: number): number {
	return Math.floor(unixTimestamp / 1000);
}
