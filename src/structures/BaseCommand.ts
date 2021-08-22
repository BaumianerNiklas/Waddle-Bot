import type { ICommand } from "#types";
import type {
	ApplicationCommandOptionData,
	ApplicationCommandType,
	CommandInteraction,
	PermissionResolvable,
} from "discord.js";

export default abstract class BaseCommand implements ICommand {
	public readonly name: string;
	public readonly type?: ApplicationCommandType;
	public readonly description?: string;
	public readonly category: string;
	public readonly options?: ApplicationCommandOptionData[];
	public readonly guildOnly?: boolean;
	public readonly requiredPermissions?: PermissionResolvable[];
	public readonly defaultPermission: boolean;
	public readonly testOnly: boolean;

	constructor(data: ICommand) {
		this.name = data.name;
		this.type = data.type ?? "CHAT_INPUT";
		this.description = data.description ?? "";
		this.category = data.category;
		this.options = data.options;
		this.guildOnly = data.guildOnly ?? true;
		this.requiredPermissions = data.requiredPermissions ?? undefined;
		this.defaultPermission = data.defaultPermission ?? true;
		this.testOnly = data.testOnly ?? false;
	}

	abstract run(interaction: CommandInteraction): Promise<unknown>;
}
