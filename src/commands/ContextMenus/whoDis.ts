import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { SuccessEmbed } from "#util/embeds.js";
import { disabledComponents, discordTimestamp } from "#util/functions.js";
import { stripIndents } from "common-tags";
import {
	ChatInputCommandInteraction,
	GuildMember,
	Message,
	ActionRow,
	ButtonComponent,
	Embed,
	SelectMenuComponent,
	PermissionFlagsBits,
	ComponentType,
	ButtonStyle,
	ApplicationCommandType,
	UnsafeSelectMenuOption,
} from "discord.js";

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

		const embed = new Embed()
			.setTitle(targetUser.tag)
			.setColor(targetMember.displayColor)
			.setThumbnail(targetUser.displayAvatarURL())
			.addFields(
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
				}
				// GuildMember#joinedTimestamp should only be null when the user has left the server
			)
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
		await actionBtn.deferUpdate();
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

		let reason = "Unspecified";
		const confirmationContent = stripIndents`You are about to ${action === Actions.Kick ? "kick" : "ban"} **${
			targetUser.tag
		}**.
		If you want to confirm this action, click on the \`Confirm\` button in the next 30 seconds.
		**Reason:** ${reason}`;

		await actionBtn.editReply({
			content: confirmationContent,
			components: this.generateConfirmationComponents(),
		});

		const confirmationMessage = (await actionBtn.fetchReply()) as Message;

		const collector = confirmationMessage.createMessageComponentCollector({ time: 30e3 });
		collector.on("collect", async (compInt) => {
			if (compInt.customId === "reason" && compInt.isSelectMenu()) {
				reason = compInt.values[0];
				compInt.update(stripIndents`Are you sure you want to ${action === Actions.Kick ? "kick" : "ban"} **${
					targetUser.tag
				}**?
				If you want to confirm this action, click on the \`Confirm\` button in the next 30 seconds.
				**Reason:** ${reason}`);
			} else if (compInt.customId === "confirm" && compInt.isButton) {
				const auditReason = `${reason} - Invoked by ${member.user.tag}`;

				if (action === Actions.Kick) await targetMember.kick(auditReason);
				else if (action === Actions.Ban) await targetMember.ban({ reason: auditReason });

				await compInt.update({ components: [] });

				const sucessMessage = `**${targetUser.tag}** has sucessfully been ${
					action === Actions.Kick ? "kicked" : "banned"
				}!`;
				await compInt.followUp({
					embeds: [new SuccessEmbed(sucessMessage).setFooter({ text: `Reason: ${reason}` })],
				});
				collector.stop();
			}
		});

		collector.on("end", () => {
			actionBtn.editReply({ components: [], content: null });
		});
	}

	private generateComponents(canKick: boolean, canBan: boolean): ActionRow[] {
		const row = new ActionRow();
		if (canKick)
			row.addComponents(
				new ButtonComponent().setCustomId("kick").setLabel("Kick this user").setStyle(ButtonStyle.Danger)
			);
		if (canBan)
			row.addComponents(
				new ButtonComponent().setCustomId("ban").setLabel("Ban this user").setStyle(ButtonStyle.Danger)
			);

		return [row];
	}

	private generateConfirmationComponents(): ActionRow[] {
		// TODO: once a textbox/input component of some sort releases, replace these preset reasons with the ability to set a custom one
		const reasons = [
			"Unspecified",
			"ToS Violation",
			"Discrimination",
			"NSFW",
			"Inappropriate/Rude Behaviour",
			"Advertising",
			"Spam",
			"Trolling",
		];
		const row1 = new ActionRow().addComponents(
			new SelectMenuComponent()
				.setCustomId("reason")
				.setPlaceholder("Select a reason")
				.addOptions(
					...reasons.map((r) => {
						return new UnsafeSelectMenuOption({ value: r, label: r });
						// I believe the need for wrapping this in an "UnsafeSelectMenuOption" constructor here is not intentional,
						// but this throws a type error otherwise
					})
				)
		);
		const row2 = new ActionRow().addComponents(
			new ButtonComponent().setCustomId("confirm").setStyle(ButtonStyle.Danger).setLabel("Confirm")
		);
		return [row1, row2];
	}
}
