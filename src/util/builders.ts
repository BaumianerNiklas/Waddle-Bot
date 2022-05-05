import { ButtonStyle, ComponentType } from "discord.js";
import {
	APIActionRowComponent,
	APIButtonComponentWithCustomId,
	APIButtonComponentWithURL,
	APIEmbed,
	APIMessageActionRowComponent,
	APIModalActionRowComponent,
	APIModalInteractionResponseCallbackData,
	APISelectMenuComponent,
	APITextInputComponent,
} from "discord-api-types/v10";
import { COLOR_GREEN, COLOR_RED, EMOTE_DANGER, EMOTE_GREEN_TICK } from "./constants.js";

// Custom builders for easily creating components & embeds because discord.js builders suck
// These are essentially just wrapper functions for plain objects that deal with the typings behind the scenes

// === Message Component Wrappers ===

export function ActionRow(
	...data: APIMessageActionRowComponent[]
): APIActionRowComponent<APIMessageActionRowComponent> {
	return {
		type: ComponentType.ActionRow,
		components: data ? [...data] : [],
	};
}

export function Button(data: Omit<APIButtonComponentWithCustomId, "type">): APIButtonComponentWithCustomId {
	return {
		...data,
		type: ComponentType.Button,
	};
}

export function LinkButton(data: Omit<APIButtonComponentWithURL, "type" | "style">): APIButtonComponentWithURL {
	return {
		...data,
		type: ComponentType.Button,
		style: ButtonStyle.Link,
	};
}

export function SelectMenu(data: Omit<APISelectMenuComponent, "type">): APISelectMenuComponent {
	return {
		...data,
		type: ComponentType.SelectMenu,
	};
}

// === Modal Wrappers ===

export function Modal(data: APIModalInteractionResponseCallbackData): APIModalInteractionResponseCallbackData {
	return data;
}

export function ModalActionRow(
	...data: APIModalActionRowComponent[]
): APIActionRowComponent<APIModalActionRowComponent> {
	return {
		type: ComponentType.ActionRow,
		components: data ? [...data] : [],
	};
}

export function TextInput(data: Omit<APITextInputComponent, "type">): APITextInputComponent {
	return {
		...data,
		type: ComponentType.TextInput,
	};
}

// === Embed Wrappers ===

export function Embed(data: APIEmbed): APIEmbed {
	return data;
}

export function SuccessEmbed(data: string | APIEmbed): APIEmbed {
	const formatDescription = (text: string) => `${EMOTE_GREEN_TICK} ${text}`;

	const defaults = Embed({ color: COLOR_GREEN });

	if (typeof data === "string") {
		return {
			...defaults,
			description: formatDescription(data),
		};
	} else {
		return {
			...defaults,
			...data,
			description: data.description ? formatDescription(data.description) : undefined,
		};
	}
}

export function ErrorEmbed(data: string | APIEmbed): APIEmbed {
	const formatDescription = (text: string) => `${EMOTE_DANGER} ${text}`;

	const defaults = Embed({
		color: COLOR_RED,
	});

	if (typeof data === "string") {
		return {
			...defaults,
			description: formatDescription(data),
		};
	} else {
		return {
			...defaults,
			...data,
			description: data.description ? formatDescription(data.description) : undefined,
		};
	}
}
