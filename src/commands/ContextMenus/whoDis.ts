import { BaseCommand, CommandData, CommandExecutionError } from "#structures/BaseCommand.js";
import { disabledComponents, discordTimestamp } from "#util/functions.js";
import {
	ChatInputCommandInteraction,
	GuildMember,
	Message,
	EmbedBuilder,
	PermissionFlagsBits,
	ComponentType,
	ButtonStyle,
	ApplicationCommandType,
	TextInputStyle,
	InteractionCollector,
	InteractionType,
	ModalSubmitInteraction,
} from "discord.js";
import { ActionRow, Button, Modal, ModalActionRow, TextInput } from "#util/builders.js";
import { SuccessEmbed } from "#util/embeds.js";

enum Actions {
	Kick,
	Ban,
}

@CommandData({
	name: "Who Dis?",
	type: ApplicationCommandType.User,
	category: "Context Menus",
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		await int.deferReply({ fetchReply: true, ephemeral: true });

		const targetUser = int.options.getUser("user", true);
		const targetMember = await int.guild!.members.fetch(targetUser.id);
		const member = int.member as GuildMember;

		const canKick = member.permissions.has(PermissionFlagsBits.KickMembers);
		const canBan = member.permissions.has(PermissionFlagsBits.BanMembers);

		const embed = new EmbedBuilder()
			.setTitle(targetUser.tag)
			.setColor(targetMember.displayColor)
			.setThumbnail(targetUser.displayAvatarURL())
			.addFields([
				{
					name: "Account Created",
					value: discordTimestamp(targetUser.createdTimestamp, "R"),
					inline: true,
				},
				{
					name: "Server Joined",
					value: targetMember.joinedTimestamp
						? discordTimestamp(targetMember.joinedTimestamp, "R")
						: "This user has left the server",
					inline: true,
				},
				// GuildMember#joinedTimestamp should only be null when the user has left the server
			])
			.setFooter({ text: `ID: ${targetUser.id}` });

		await int.editReply({
			embeds: [embed],
			components: this.generateComponents(canKick, canBan),
		});

		if (!canKick && !canBan) return;

		const botMsg = (await int.fetchReply()) as Message;
		const actionBtn = await botMsg
			.awaitMessageComponent({ componentType: ComponentType.Button, time: 20e3 })
			.catch(() => {
				int.editReply({ components: disabledComponents(botMsg.components) });
			});

		if (!actionBtn) return;
		int.editReply({ components: [] });

		const action = actionBtn.customId === "kick" ? Actions.Kick : Actions.Ban;
		if ((action === Actions.Kick && !targetMember.kickable) || (action === Actions.Ban && !targetMember.kickable)) {
			return actionBtn.followUp(
				`Sorry, I cannot ${action === Actions.Kick ? "kick" : "ban"} user **${
					targetUser.tag
				}**. Make sure I have the ${
					action === Actions.Kick ? "Kick" : "Ban"
				} Members permissions and am higher than them on the role hierachy!`
			);
		}

		actionBtn.showModal(this.generateModal(targetUser.tag, action));
		const collector = new InteractionCollector<ModalSubmitInteraction>(int.client, {
			interactionType: InteractionType.ModalSubmit,
			time: 120e3,
			filter: (i) => i.user.id === int.user.id,
		});

		collector.on("collect", async (modal) => {
			const reason = modal.fields.getTextInputValue("reason");
			const auditReason = `${reason} - Invoked by ${modal.user.tag}`;

			try {
				if (action === Actions.Kick) await targetMember.kick(auditReason);
				else if (action === Actions.Ban) await targetMember.ban({ reason: auditReason });

				const sucessMessage = `**${targetUser.tag}** has sucessfully been ${
					action === Actions.Kick ? "kicked" : "banned"
				}!`;

				await modal.reply({
					embeds: [new SuccessEmbed(sucessMessage).setFooter({ text: `Reason: ${reason}` })],
				});
			} catch (e) {
				throw new CommandExecutionError(
					"Whoops, looks like something went wrong while trying to perform this action."
				);
			}
			collector.stop();
		});
	}

	private generateComponents(canKick: boolean, canBan: boolean) {
		const row = ActionRow();

		if (canKick) {
			row.components.push(Button({ customId: "kick", label: "Kick this user", style: ButtonStyle.Danger }));
		}
		if (canBan) {
			row.components.push(Button({ customId: "ban", label: "Ban this user", style: ButtonStyle.Danger }));
		}

		return [row];
	}

	private generateModal(targetTag: string, action: Actions) {
		return Modal({
			customId: "reason_modal",
			title: `Continue with ${action === Actions.Kick ? "kick" : "bann"}ing ${targetTag}?`,
			components: [
				ModalActionRow(
					TextInput({
						customId: "reason",
						label: "Reason",
						placeholder: "Being a poopoo head",
						style: TextInputStyle.Short,
					})
				),
			],
		});
	}
}
