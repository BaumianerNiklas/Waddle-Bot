import { Message, MessageActionRow } from "discord.js";

// String Utilities
export function capitalizeFirstLetter(text: string) {
	return text.toLowerCase().replace(/(?<![^ \n\t])[a-z]/g, (char) => char.toUpperCase());
}

export function chunkString(text: string, size: number): string[] {
	const result: string[] = [];

	for (let i = 0; i <= text.length; i += size) {
		result.push(text.substring(i, i + size));
	}
	return result;
}

// Taken and  slightly adjusted from https://github.com/bevacqua/fuzzysearch/blob/master/index.js
export function fuzzysearch(haystack: string, needle: string, ignoreCaps = false): boolean {
	if (ignoreCaps) {
		haystack = haystack.toLowerCase();
		needle = needle.toLowerCase();
	}

	const needleLen = needle.length;
	const haystackLen = haystack.length;

	if (needleLen > haystackLen) return false;
	if (needleLen === haystackLen) return needle === haystack;

	outer: for (let i = 0, j = 0; i < needleLen; i++) {
		const currChar = needle.charCodeAt(i);

		while (j < haystackLen) {
			if (haystack.charCodeAt(j++) === currChar) continue outer;
		}
		return false;
	}
	return true;
}

// Array Utilities
export function fuzzysearchArray(haystack: string[], needle: string, ignoreCaps = false) {
	return haystack.filter((x) => fuzzysearch(x, needle, ignoreCaps));
}

export function randomItemFromArray<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
	return array.sort(() => Math.random() - 0.5);
}

export function chunkArray<T>(array: T[], chunkSize: number) {
	const result: T[][] = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		result.push(array.slice(i, i + chunkSize));
	}
	return result;
}

// Discord Utilities
export function generateMessageLink(message: Message): string {
	return `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;
}

type DiscordTimestampFormatStyle = "t" | "T" | "d" | "D" | "f" | "F" | "R";
export function discordTimestamp(unixTimestamp: number, style: DiscordTimestampFormatStyle = "f"): string {
	return `<t:${Math.floor(unixTimestamp / 1000)}:${style}>`;
}

export function disabledComponents(components: MessageActionRow[]): MessageActionRow[] {
	return components.map((row) => {
		return new MessageActionRow().addComponents(row.components.map((component) => component.setDisabled(true)));
	});
}
