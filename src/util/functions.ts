import { Image } from "@napi-rs/canvas";
import { APIActionRowComponent, APIMessageActionRowComponent } from "discord-api-types/v10";
import { Message, EmbedData } from "discord.js";
import { readFile } from "node:fs/promises";

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

export async function loadImage(path: string, remote = false) {
	let imageFile;
	if (!remote) imageFile = await readFile(path);
	else imageFile = Buffer.from(await (await fetch(path)).arrayBuffer());

	const image = new Image();
	image.src = imageFile;
	return image;
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
// TODO: get rid of this. there's no convenient way to access length on the embed builders currently
// @discordjs/builders exports this function as a utility but it is not re-exported from discord.js
// and I cba to import another package for a single util function
export function embedLength(embed: EmbedData) {
	return (
		(embed.title?.length ?? 0) +
		(embed.description?.length ?? 0) +
		(embed.fields?.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0) ?? 0) +
		(embed.footer?.text.length ?? 0) +
		(embed.author?.name.length ?? 0)
	);
}

export function generateMessageLink(message: Message): string {
	return `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;
}

type DiscordTimestampFormatStyle = "t" | "T" | "d" | "D" | "f" | "F" | "R";
export function discordTimestamp(unixTimestamp: number, style: DiscordTimestampFormatStyle = "f"): string {
	return `<t:${Math.floor(unixTimestamp / 1000)}:${style}>`;
}

export function disabledComponents(
	components: APIActionRowComponent<APIMessageActionRowComponent>[]
): APIActionRowComponent<APIMessageActionRowComponent>[] {
	// For some reason, this gives a type error when using map on the original components.
	// So this instead clones the components parameter and mutates the clone

	const newComponents = components;
	newComponents.forEach((row) =>
		row.components.map((c) => {
			return {
				...c,
				disabled: true,
			};
		})
	);
	return newComponents;
}
