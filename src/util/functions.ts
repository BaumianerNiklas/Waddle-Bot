export function shuffleArray<T>(array: T[]): T[] {
	return array.sort(() => Math.random() - 0.5);
}

// TODO: better name
type DiscordTimestampFormatStyle = "t" | "T" | "d" | "D" | "f" | "F" | "R";
export function formatUnixTimestamp(unixTimestamp: number, style: DiscordTimestampFormatStyle = "f"): string {
	return `<t:${Math.floor(unixTimestamp / 1000)}:${style}>`;
}
