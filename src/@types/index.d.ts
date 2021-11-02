import type { WaddleBot } from "#structures/WaddleBot";
import type {
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	CommandInteraction,
	ContextMenuInteraction,
	PermissionResolvable,
} from "discord.js";
import type { Constants } from "discord.js";

// TODO: refactor into multiple interfaces (slash commands, context menu commands) !!
interface ICommand extends IAPICommand {
	category: string;
	requiredPermissions?: PermissionResolvable[];
	guildOnly?: boolean;
	run?: (interaction: CommandInteraction | ContextMenuInteraction) => Promise<unknown>;
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
	channelTypes?: Array<keyof typeof Constants.ChannelTypes>;
	requiredPermissions?: PermissionResolvable[];
}

interface IEvent {
	name: string;
	once: boolean;
	run?: (bot: WaddleBot, ...args: unknown[]) => Promise<unknown>;
}
