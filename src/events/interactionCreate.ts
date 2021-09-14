import { BaseEvent } from "#structures/BaseEvent.js";
import { WaddleBot } from "#structures/WaddleBot.js";
import { BOT_REQUIRED_PERMISSIONS } from "#util/constants.js";
import { ErrorEmbed } from "#util/embeds.js";
import { capitalizeFirstLetter } from "#util/functions.js";
import { Interaction, PermissionResolvable, Permissions } from "discord.js";

export class Event extends BaseEvent {
	constructor() {
		super({
			name: "interactionCreate",
			once: false,
		});
	}

	async run(bot: WaddleBot, interaction: Interaction) {
		if (!interaction.isCommand() && !interaction.isContextMenu()) return;
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
		if (interaction.guild) {
			// As far as I can tell, all of the permissions which are checked for here are given to bots in initial replies to interactions
			// (which is also why the bot is able to use embeds and external emojis in this response),
			// but once something outside the initial response is done, these permissions have to be actually given to the bot.
			const botMissingPerms: PermissionResolvable[] = [];
			for (const perm of BOT_REQUIRED_PERMISSIONS) {
				if (!interaction.guild.me?.permissionsIn(interaction.channelId).has(perm)) {
					botMissingPerms.push(perm);
				}
			}

			if (botMissingPerms.length) {
				const botMissingPermsMsg = `I'm currently missing some permissions which I need for most of my commands to function properly. Please make sure I have these permissions in the current channel:\n${this.listPermissions(
					botMissingPerms
				)}`;
				return interaction.reply({ embeds: [new ErrorEmbed(botMissingPermsMsg)], ephemeral: true });
			}
		}

		try {
			void (await command.run?.(interaction));
		} catch (error) {
			console.log(error);
			bot.logger.fatal("Failed to execute a command.");

			if (interaction.replied || interaction.deferred) {
				await interaction.editReply("Sorry, something went wrong while trying to execute this command.");
			} else {
				await interaction.reply("Sorry, something went wrong while trying to execute this command.");
			}
		}
	}

	// This way of getting the name of the Permissions from the bitfield seems kind of hacky but is the best solution I could come up with
	private listPermissions(permissions: PermissionResolvable[]): string {
		return permissions
			.map((perm) => "`" + capitalizeFirstLetter(new Permissions(perm).toArray()[0].replace(/_/g, " ")) + "`")
			.join(", ");
	}
}
