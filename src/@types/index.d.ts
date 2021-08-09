import { CommandInteraction, PermissionResolvable } from "discord.js";

interface IAPICommand {
	name: string;
	description: string;
	options: ICommandOptions[];
	defaultPermission?: boolean;
}

interface ICommandOption {
	type:
		| "SUB_COMMAND_GROUP"
		| "SUB_COMMAND"
		| "BOOLEAN"
		| "STRING"
		| "INTEGER"
		| "USER"
		| "CHANNEL"
		| "ROLE"
		| "MENTIONABLE"
		| "NUMBER";
	name: string;
	description: string;
	required?: boolean;
	options?: ICommandOption[];
	choices?: ICommandChoice[];
}

interface ICommandChoice {
	name: string;
	value: string;
}

interface ICommand extends IAPICommand {
	category: string;
	requiredPermissions?: PermissionResolvable[];
	guildOnly?: boolean;
	run?: (interaction: CommandInteraction) => Promise<any>;
}
