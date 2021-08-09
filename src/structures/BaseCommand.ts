import { ICommand, ICommandOption } from "#types";
import {
	CommandInteraction,
	CommandInteractionOptionResolver,
	PermissionResolvable,
	PermissionString,
} from "discord.js";

export default abstract class BaseCommand implements ICommand {
	public readonly name: string;
	public readonly options: ICommandOption[];
	public readonly category: string;
	public readonly description: string;
	public readonly guildOnly?: boolean;
	public readonly requiredPermissions?: PermissionResolvable[];
	public readonly defaultPermission: boolean;

	constructor(data: ICommand) {
		this.name = data.name;
		this.category = data.category;
		this.description = data.description;
		this.options = data.options;
		this.guildOnly = data.guildOnly ?? true;
		this.requiredPermissions = data.requiredPermissions ?? undefined;
		this.defaultPermission = data.defaultPermission ?? true;
	}

	abstract run(interaction: CommandInteraction): Promise<unknown>;
}
