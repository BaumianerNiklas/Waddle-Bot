import { BaseCommand } from "#structures/BaseCommand.js";
import {
	ButtonInteraction,
	ContextMenuInteraction,
	GuildMember,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Permissions,
	Snowflake,
} from "discord.js";

export class Command extends BaseCommand {
	constructor() {
		super({
			name: "Who Dis?",
			type: "USER",
			category: "Context Menus",
			guildOnly: true,
			testOnly: true,
		});
	}

	// TODO: complete this once discord.js 13.2.0 releases
	async run(int: ContextMenuInteraction) {
		// const id = CustomIdUtil.create({ myCoolStuff: "i be doing stuff", awesome: "nice" });
		// int.reply(id);
		// console.log(CustomIdUtil.retrieve(id, "myCoolStuff"));
		// console.log(CustomIdUtil.retrieve(id, "property that doesn't exist"));
		// console.log(CustomIdUtil.retrieveAll(id));
		// 		const member = int.options.getMember("user", true);
		// 		if (!(member instanceof GuildMember) || !(int.member instanceof GuildMember)) return;
		// 		const embed = new MessageEmbed()
		// 			.setTitle(member.nickname ? `${member.displayName} (${member.user.tag})` : member.user.tag)
		// 			.setColor(member.displayColor)
		// 			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
		// 			.addField("**Account Created**", formatUnixTimestamp(member.user.createdTimestamp, "R"), true)
		// 			.addField("**Server Joined**", formatUnixTimestamp(member.joinedTimestamp!, "R"), true)
		// 			.setDescription(`**ID**: ${member.user.id}`);
		// 		const canKick = int.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
		// 		const canBan = int.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
		// 		await int.reply({
		// 			embeds: [embed],
		// 			ephemeral: true,
		// 			components: this.generateComponents(canKick, canBan, member.user.id),
		// 		}); /* This should be safe to cast as the message is sent from a bot client */
		// 		if (!canKick || !canBan) return;
		// 		let answer;
		// 		try {
		// 			answer = await int.channel!.awaitMessageComponent({
		// 				componentType: "BUTTON",
		// 				time: 60e3,
		// 			});
		// 		} catch (e) {
		// 			return int.editReply({ components: [] });
		// 		}
		// 		const [action, userId] = answer.customId.split("_");
		// 		answer.update({ components: [] });
		// 		answer.followUp("Are you sure you want to ban this user?");
		// 	}
		// 	private generateComponents(canKick: boolean, canBan: boolean, userId: Snowflake): MessageActionRow[] {
		// 		const row = new MessageActionRow();
		// 		if (canKick) {
		// 			row.addComponents(
		// 				new MessageButton().setCustomId(`kick_${userId}_${Date.now()}`).setLabel("Kick this member").setStyle("DANGER")
		// 			);
		// 		}
		// 		if (canBan) {
		// 			row.addComponents(
		// 				new MessageButton().setCustomId(`ban_${userId}_${Date.now()}`).setLabel("Ban this member").setStyle("DANGER")
		// 			);
		// 		}
		// 		return row.components.length > 0 ? [row] : [];
	}
}
