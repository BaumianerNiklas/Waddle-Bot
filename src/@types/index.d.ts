import type {
	ApplicationCommandData,
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionData,
	ApplicationCommandType,
	CommandInteraction,
	PermissionResolvable,
} from "discord.js";

interface IAPICommand {
	name: string;
	type?: ApplicationCommandType;
	description: string;
	options?: ApplicationCommandOptionData[];
	defaultPermission?: boolean;
}

interface ICommand extends IAPICommand {
	category: string;
	requiredPermissions?: PermissionResolvable[];
	guildOnly?: boolean;
	run?: (interaction: CommandInteraction) => Promise<any>;
}
