import type { WaddleBot } from "#structures/WaddleBot";
import type {
	ApplicationCommandData,
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionData,
	ApplicationCommandType,
	CommandInteraction,
	PermissionResolvable,
} from "discord.js";

// TODO: refactor into multiple interfaces (slash commands, context menu commands) !!
interface IAPICommand {
	name: string;
	type?: ApplicationCommandType;
	description?: string;
	options?: ApplicationCommandOption[];
	defaultPermission?: boolean;
	testOnly?: boolean;
}

interface ICommand extends IAPICommand {
	category: string;
	requiredPermissions?: PermissionResolvable[];
	guildOnly?: boolean;
	run?: (interaction: CommandInteraction) => Promise<any>;
}

interface IEvent {
	name: string;
	once: boolean;
	run?: (bot: WaddleBot, ...args: unknown[]) => Promise<any>;
}
