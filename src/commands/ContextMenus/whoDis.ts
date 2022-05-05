import { BaseCommand, CommandData, CommandExecutionError } from "#structures/BaseCommand.js";
import { disabledComponents, discordTimestamp } from "#util/functions.js";
import {
	ChatInputCommandInteraction,
	GuildMember,
	Message,
	PermissionFlagsBits,
	ComponentType,
	ButtonStyle,
	ApplicationCommandType,
	TextInputStyle,
	InteractionCollector,
	InteractionType,
	ModalSubmitInteraction,
} from "discord.js";
import { ActionRow, Button, Embed, Modal, ModalActionRow, TextInput } from "#util/builders.js";
import { SuccessEmbed } from "#util/embeds.js";

enum Action {
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

		const embed = Embed({
			title: targetUser.tag,
			color: targetMember.displayColor,
			thumbnail: { url: targetUser.displayAvatarURL() },
			fields: [
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
			],
			footer: { text: `ID: ${targetUser.id}` },
		});

		await int.editReply({
			embeds: [embed],
			components: this.generateComponents(canKick, canBan),
		});

		if (!canKick && !canBan) return;

		const botMsg = (await int.fetchReply()) as Message;
		const actionBtn = await botMsg
			.awaitMessageComponent({ componentType: ComponentType.Button, time: 20e3 })
			.catch(() => {
				int.editReply({ components: disabledComponents(botMsg.components.map((x) => x.toJSON())) });
			});

		if (!actionBtn) return;
		int.editReply({ components: [] });

		const action = actionBtn.customId === "kick" ? Action.Kick : Action.Ban;
		if ((action === Action.Kick && !targetMember.kickable) || (action === Action.Ban && !targetMember.kickable)) {
			return actionBtn.followUp(
				`Sorry, I cannot ${action === Action.Kick ? "kick" : "ban"} user **${
					targetUser.tag
				}**. Make sure I have the ${
					action === Action.Kick ? "Kick" : "Ban"
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
				if (action === Action.Kick) await targetMember.kick(auditReason);
				else if (action === Action.Ban) await targetMember.ban({ reason: auditReason });

				const sucessMessage = `**${targetUser.tag}** has sucessfully been ${
					action === Action.Kick ? "kicked" : "banned"
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
			row.components.push(Button({ custom_id: "kick", label: "Kick this user", style: ButtonStyle.Danger }));
		}
		if (canBan) {
			row.components.push(Button({ custom_id: "ban", label: "Ban this user", style: ButtonStyle.Danger }));
		}

		return [row];
	}

	private generateModal(targetTag: string, action: Action) {
		return Modal({
			custom_id: "reason_modal",
			title: `Continue with ${action === Action.Kick ? "kick" : "bann"}ing ${targetTag}?`,
			components: [
				ModalActionRow(
					TextInput({
						custom_id: "reason",
						label: "Reason",
						placeholder: "Disliking Waddle Dees",
						style: TextInputStyle.Short,
					})
				),
			],
		});
	}
}
