import type {
	ApplicationCommandData,
	ApplicationCommandOptionChoice,
	CommandInteraction,
	PermissionResolvable,
} from "discord.js";

interface ICommand extends ApplicationCommandData {
	category: string;
	requiredPermissions?: PermissionResolvable[];
	guildOnly?: boolean;
	run?: (interaction: CommandInteraction) => Promise<any>;
}
