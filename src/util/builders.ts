import {
	ActionRowData,
	ButtonStyle,
	ComponentType,
	InteractionButtonComponentData,
	LinkButtonComponentData,
	MessageActionRowComponentData,
	ModalActionRowComponentData,
	SelectMenuComponentData,
} from "discord.js";

// Custom builders for easily creating components & embeds because discord.js builders suck
// These are essentially just wrapper functions for plain objects that deal with the typings behind the scenes

export function ActionRow(...data: MessageActionRowComponentData[]): ActionRowData<MessageActionRowComponentData> {
	return {
		type: ComponentType.ActionRow,
		components: data ? [...data] : [],
	};
}

export function ModalActionRow(...data: ModalActionRowComponentData[]): ActionRowData<ModalActionRowComponentData> {
	return {
		type: ComponentType.ActionRow,
		components: data ? [...data] : [],
	};
}

export function Button(data: Omit<InteractionButtonComponentData, "type">): InteractionButtonComponentData {
	return {
		...data,
		type: ComponentType.Button,
	};
}

export function LinkButton(data: Omit<LinkButtonComponentData, "type" | "style">): LinkButtonComponentData {
	return {
		...data,
		type: ComponentType.Button,
		style: ButtonStyle.Link,
	};
}

export function SelectMenu(data: Omit<SelectMenuComponentData, "type">): SelectMenuComponentData {
	return {
		...data,
		type: ComponentType.SelectMenu,
	};
}
