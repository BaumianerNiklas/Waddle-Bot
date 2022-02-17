import type { IAPICommand, ICommand } from "#types";
import { ApplicationCommandType, ChatInputCommandInteraction, ContextMenuCommandInteraction } from "discord.js";

export abstract class BaseCommand implements ICommand, IAPICommand {
	public readonly name;
	public readonly type?;
	public readonly description?;
	public readonly category;
	public readonly options?;
	public readonly guildOnly?;
	public readonly requiredPermissions?;
	public readonly defaultPermission;
	public readonly testOnly;

	constructor(data: ICommand) {
		this.name = data.name;
		this.type = data.type ?? ApplicationCommandType.ChatInput;
		this.description = data.description ?? "";
		this.category = data.category;
		this.options = data.options ?? undefined;
		this.guildOnly = data.guildOnly ?? true;
		this.requiredPermissions = data.requiredPermissions ?? undefined;
		this.defaultPermission = data.defaultPermission ?? true;
		this.testOnly = data.testOnly ?? false;
	}

	abstract run(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction): Promise<unknown>;
}

// Class Decorator for a nicer & shorter way of providing data to Command classes
export function CommandData(options: ICommand): ClassDecorator {
	return function (target) {
		if (!(target.prototype instanceof BaseCommand)) {
			throw new TypeError(
				`Cannot call this decorator on class ${target.name} as it is not an instance of 'BaseCommand'`
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

export class CommandExecutionError extends Error {}
