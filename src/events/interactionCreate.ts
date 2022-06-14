import { BaseEvent } from "#structures/BaseEvent.js";
import { WaddleBot } from "#structures/WaddleBot.js";
import { CommandExecutionError } from "#structures/BaseCommand.js";
import { ICommand, ICommandOption } from "#types";
import { ErrorEmbed } from "#util/builders.js";
import { BOT_REQUIRED_PERMISSIONS } from "#util/constants.js";
import { capitalizeFirstLetter } from "#util/functions.js";
import {
	AnyInteraction,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	GuildMember,
	InteractionType,
	PermissionResolvable,
	PermissionsBitField,
} from "discord.js";

export class Event extends BaseEvent {
	constructor() {
		super({
			name: "interactionCreate",
			once: false,
		});
	}

	async run(bot: WaddleBot, interaction: AnyInteraction) {
		if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			const command = bot.commandHandler.commands.get(interaction.commandName);
			if (!command) return;
			if (command.autocomplete) void command.autocomplete(interaction);
		}

		if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;
		if (!interaction.guild?.fetchMe()) return; // This should (hopefully) only be nullish if the bot has left the server, in which case immediately return
		if (!(interaction.member instanceof GuildMember)) return; // Probably null when not on the server, not sure when it is "APIInteractionGuildMember"

		const command = bot.commandHandler.commands.get(interaction.commandName);
		if (!command) {
			return interaction.reply({ content: "This command has not yet been implemented!", ephemeral: true });
		}

		if (command.guildOnly && !interaction.guildId) {
			return interaction.reply(
				"Sorry, this command doesn't work in Direct Messages. Try running it on a server!"
			);
		}

		// Permission Checking
		if (interaction.inGuild()) {
			// As far as I can tell, all of the permissions which are checked for here are given to bots in initial replies to interactions
			// (which is also why the bot is able to use embeds and external emojis in this response),
			// but once something outside the initial response is done, these permissions have to be actually given to the bot.
			const botMissingBasePerms = this.getMissingPermissions(
				await interaction.guild.fetchMe(),
				BOT_REQUIRED_PERMISSIONS,
				interaction.channelId
			);

			if (botMissingBasePerms.length) {
				const msg = `I'm currently missing some permissions which I need for most of my commands to function properly. Please make sure I have these permissions in the current channel:\n${this.listPermissions(
					botMissingBasePerms
				)}`;
				return interaction.reply({ embeds: [ErrorEmbed(msg)], ephemeral: true });
			}

			// Permissions for specific commmands (BaseCommand#requiredPermission) - these are used for both the user and the bot
			// Go in order of specifiy to retrieve the required permissions for the command (subcommand > subcommand group > command)

			let requiredPermissions: PermissionResolvable[] = [];
			// Fore some reason 'getSubcommand[Group]' is ommitted in the typings for ContextMenuInteraction?
			// https://github.com/discordjs/discord.js/blob/5ec04e077bbbb9799f3ef135cade84b77346ef20/typings/index.d.ts#L719
			// I have literally no idea how to fix this other than hardcasting to ChatInputCommandInteraction
			// TODO: get rid of hardcasting here
			const subcommand = (interaction as ChatInputCommandInteraction).options.getSubcommand(false);
			const subGroup = (interaction as ChatInputCommandInteraction).options.getSubcommandGroup(false);

			if (subcommand) {
				requiredPermissions =
					this.getCommandOption(command, subcommand, ApplicationCommandOptionType.Subcommand)
						?.requiredPermissions ?? [];
			} else if (subGroup && !requiredPermissions.length) {
				requiredPermissions =
					this.getCommandOption(command, subGroup, ApplicationCommandOptionType.SubcommandGroup)
						?.requiredPermissions ?? [];
			} else if (!requiredPermissions.length) {
				requiredPermissions = command.requiredPermissions ?? [];
			}

			const botMissingPerms = this.getMissingPermissions(
				await interaction.guild.fetchMe(),
				requiredPermissions,
				interaction.channelId
			);
			if (botMissingPerms.length) {
				const msg = `I'm missing the following permissions to execute this command:\n${this.listPermissions(
					botMissingPerms
				)}`;
				return interaction.reply({ embeds: [ErrorEmbed(msg)], ephemeral: true });
			}

			const userMissingPerms = this.getMissingPermissions(
				interaction.member,
				requiredPermissions,
				interaction.channelId
			);
			if (userMissingPerms.length) {
				const msg = `You're missing the following permissions to execute this command:\n${this.listPermissions(
					userMissingPerms
				)}`;
				return interaction.reply({ embeds: [ErrorEmbed(msg)], ephemeral: true });
			}
		}

		try {
			void (await command.run?.(interaction));
		} catch (e) {
			const error = e as Error;
			if (!interaction.replied && !interaction.deferred) await interaction.deferReply({ ephemeral: true });

			let message = "";
			if (error instanceof CommandExecutionError) {
				message = error.message;
			} else message = "Something went wrong while trying to execute this command!";

			interaction.editReply({ embeds: [ErrorEmbed(message)] });
			bot.logger.error(`Command execution failed (${command.name})`, error);
			console.error(error);
		}
	}

	private getMissingPermissions(
		member: GuildMember,
		requiredPermissions: PermissionResolvable[],
		channelId: string
	): PermissionResolvable[] {
		const missingPerms: PermissionResolvable[] = [];
		for (const perm of requiredPermissions) {
			if (!member.permissionsIn(channelId).has(perm)) {
				missingPerms.push(perm);
			}
		}
		return missingPerms;
	}

	// This way of getting the name of the Permissions from the bitfield seems kind of hacky but is the best solution I could come up with
	private listPermissions(permissions: PermissionResolvable[]): string {
		const result: string[] = [];
		for (const permission of permissions) {
			const permNames = new PermissionsBitField(permission).toArray(); // this way of getting the permissions name is kind of hacky but the best I could come up wiht
			if (permNames.includes("Administrator")) {
				// the flag for ADMINISTRATOR is an array of all permissions, including ADMINISTRATOR itself
				return "`Administrator`";
			} else {
				// other flags always only have one permission from Permissions.toArray()
				result.push("`" + capitalizeFirstLetter(permNames[0].replace(/_/g, " ")) + "`");
			}
		}
		return result.join(", ");
	}

	private getCommandOption(
		command: ICommand,
		name: string,
		type?: ApplicationCommandOptionType
	): ICommandOption | null {
		if (!command.options?.length) return null;

		for (const option of command.options) {
			const result = this.searchCommandOption(option, name, type);
			if (result) return result;
		}
		return null;
	}

	// Recursive approach for finding a option with the specified name and type
	private searchCommandOption(
		option: ICommandOption,
		name: string,
		type?: ApplicationCommandOptionType
	): ICommandOption | null {
		if (option.name !== name) {
			if (option.options?.length) {
				for (const nestedOption of option.options) {
					this.searchCommandOption(nestedOption, name, type);
				}
			}
		} else {
			if (type && option.type !== type) {
				if (option.options?.length) {
					for (const nestedOption of option.options) {
						this.searchCommandOption(nestedOption, name, type);
					}
				}
			} else if (type && option.type === type) {
				return option;
			} else {
				return option;
			}
		}
		return null;
	}
}
