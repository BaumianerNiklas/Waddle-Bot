import type {
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	AutocompleteInteraction,
	ChannelType,
	ChatInputCommandInteraction,
	ContextMenuInteraction,
	PermissionResolvable,
} from "discord.js";

// TODO: refactor into multiple interfaces (slash commands, context menu commands) !!
interface ICommand extends IAPICommand {
	category: string;
	requiredPermissions?: PermissionResolvable[];
	guildOnly?: boolean;
	run?: (interaction: ChatInputCommandInteraction | ContextMenuInteraction) => Promise<unknown>;
	autocomplete?: (interaction: AutocompleteInteraction) => Promise<unknown>;
}

interface IAPICommand {
	name: string;
	type?: ApplicationCommandType;
	description?: string;
	options?: Array<ICommandOption>;
	defaultPermission?: boolean;
	requiredPermissions?: PermissionResolvable[];
	testOnly?: boolean;
}

interface ICommandOption {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
	options?: Array<ICommandOption>;
	autocomplete?: boolean;
	channelTypes?: Array<ChannelType>;
	requiredPermissions?: PermissionResolvable[];
}
