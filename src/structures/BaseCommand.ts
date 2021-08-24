import type { ICommand, ICommandOption } from "#types";
import type {
	ApplicationCommandOptionData,
	ApplicationCommandType,
	CommandInteraction,
	PermissionResolvable,
} from "discord.js";

export abstract class BaseCommand implements ICommand {
	public readonly name: string;
	public readonly type?: ApplicationCommandType;
	public readonly description?: string;
	public readonly category: string;
	public readonly options?: ICommandOption[];
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

// EXPERIMENTAL: CommandData class Decorator for a nicer & shorter way of providing data to Command classes
// TS decorators can make code very nice and readable but their implementation is pretty messy, like here

export function CommandData(options: ICommand): ClassDecorator {
	return function (target) {
		if (!(target.prototype instanceof BaseCommand)) {
			throw new TypeError(
				`Cannot call this decorator on class ${target.name} as it is not an instance of '${BaseCommand.prototype.constructor.name}'`
			);
		}

		return new Proxy(target, {
			// Create and return a copy of the original class that only modifies the constructor
			// originalCtr is the old constructor, args the original arguments provided to the constructor
			construct(originalCtr, args) {
				// The new constructor is the same but injects the 'options' provided in the decorator
				return Reflect.construct(originalCtr, [options, ...args]);
			},
		});
	};
}
