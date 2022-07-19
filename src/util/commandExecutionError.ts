import type { APIEmbed, CommandInteraction } from "discord.js";
import { ErrorEmbed } from "./builders.js";

export async function commandExecutionError(interaction: CommandInteraction, message: string | APIEmbed) {
	if (interaction.replied || interaction.deferred) await interaction.deferReply({ ephemeral: true });

	interaction.editReply({ embeds: [ErrorEmbed(message)] });
}
