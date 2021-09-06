import { Message, MessageActionRow } from "discord.js";

// String Utilities
export function capitalizeFirstLetter(text: string) {
	return text.replace(/(?<![^ \n\t])[a-z]/g, (char) => char.toUpperCase());
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

// TODO: better name
type DiscordTimestampFormatStyle = "t" | "T" | "d" | "D" | "f" | "F" | "R";
export function formatUnixTimestamp(unixTimestamp: number, style: DiscordTimestampFormatStyle = "f"): string {
	return `<t:${Math.floor(unixTimestamp / 1000)}:${style}>`;
}

export function disabledComponents(components: MessageActionRow[]): MessageActionRow[] {
	return components.map((row) => {
		return new MessageActionRow().addComponents(row.components.map((component) => component.setDisabled(true)));
	});
}
