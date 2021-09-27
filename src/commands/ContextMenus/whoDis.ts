import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { SuccessEmbed } from "#util/embeds.js";
import { disabledComponents, discordTimestamp } from "#util/functions.js";
import { stripIndents } from "common-tags";
import {
	CommandInteraction,
	GuildMember,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
	Permissions,
} from "discord.js";

enum Actions {
	Kick,
	Ban,
}

@CommandData({
	name: "Who Dis?",
	type: "USER",
	category: "Context Menus",
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		await int.deferReply({ fetchReply: true, ephemeral: true });

		const targetUser = int.options.getUser("user", true);
		const targetMember = await int.guild!.members.fetch(targetUser.id);
		const member = int.member as GuildMember;

		const canKick = member.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
		const canBan = member.permissions.has(Permissions.FLAGS.BAN_MEMBERS);

		const embed = new MessageEmbed()
			.setTitle(targetUser.tag)
			.setColor(targetMember.displayColor)
			.setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
			.addField("Account Created", discordTimestamp(targetUser.createdTimestamp, "R"), true)
			.addField(
				"Server Joined",
				targetMember.joinedTimestamp
					? discordTimestamp(targetMember.joinedTimestamp, "R")
					: "This user has left the server",
				// GuildMember#joinedTimestamp should only be null when the user has left the server
				true
			)
			.setFooter(`ID: ${targetUser.id}`);

		await int.editReply({
			embeds: [embed],
			components: this.generateComponents(canKick, canBan),
		});

		if (!canKick && !canBan) return;

		const botMsg = (await int.fetchReply()) as Message;
		const actionBtn = await botMsg.awaitMessageComponent({ componentType: "BUTTON", time: 20e3 }).catch(() => {
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
					embeds: [new SuccessEmbed(sucessMessage).setFooter(`Reason: ${reason}`)],
				});
				collector.stop();
			}
		});

		collector.on("end", () => {
			actionBtn.editReply({ components: [], content: null });
		});
	}

	private generateComponents(canKick: boolean, canBan: boolean): MessageActionRow[] {
		const row = new MessageActionRow();
		if (canKick)
			row.addComponents(new MessageButton().setCustomId("kick").setLabel("Kick this user").setStyle("DANGER"));
		if (canBan)
			row.addComponents(new MessageButton().setCustomId("ban").setLabel("Ban this user").setStyle("DANGER"));

		return [row];
	}

	private generateConfirmationComponents(): MessageActionRow[] {
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
		const row1 = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("reason")
				.setPlaceholder("Select a reason")
				.addOptions(
					reasons.map((r) => {
						return { value: r, label: r };
					})
				)
		);
		const row2 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId("confirm").setStyle("DANGER").setLabel("Confirm")
		);
		return [row1, row2];
	}
}
