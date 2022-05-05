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

// === Other Wrappers ===

export function Embed(data: APIEmbed): APIEmbed {
	return data;
}
