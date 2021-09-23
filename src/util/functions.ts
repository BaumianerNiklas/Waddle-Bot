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
// Array Utilities
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
