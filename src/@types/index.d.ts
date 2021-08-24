import type { WaddleBot } from "#structures/WaddleBot";
import type {
	ApplicationCommandData,
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionData,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	CommandInteraction,
	PermissionResolvable,
} from "discord.js";

// TODO: refactor into multiple interfaces (slash commands, context menu commands) !!
interface IAPICommand {
	name: string;
	type?: ApplicationCommandType;
	description?: string;
	options?: ICommandOption[];
	defaultPermission?: boolean;
	testOnly?: boolean;
}

interface ICommand extends IAPICommand {
	category: string;
	requiredPermissions?: PermissionResolvable[];
	guildOnly?: boolean;
	run?: (interaction: CommandInteraction) => Promise<any>;
}

interface ICommandOption {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required: true;
	options: ICommandOption[];
	choices: ApplicationCommandOptionChoice;
}

interface IEvent {
	name: string;
	once: boolean;
	run?: (bot: WaddleBot, ...args: unknown[]) => Promise<any>;
}
