import BaseCommand from "#structures/BaseCommand.js";
import { formatUnixTimestamp } from "#util/functions.js";
import { CommandInteraction, Guild, GuildMember, Message, MessageEmbed, Role } from "discord.js";

export default class extends BaseCommand {
	constructor() {
		super({
			name: "info",
			category: "Utility",
			description: "Get information about a user, role, or the server",
			options: [
				{
					type: "SUB_COMMAND",
					name: "user",
					description: "Get information about a user",
					options: [
						{
							type: "USER",
							name: "user",
							description: "The user to get information about",
						},
					],
				},
				{
					type: "SUB_COMMAND",
					name: "role",
					description: "Get information about a role",
					options: [
						{
							type: "ROLE",
							name: "role",
							description: "The role to get information about",
							required: true,
						},
					],
				},
				{
					type: "SUB_COMMAND",
					name: "server",
					description: "Get information about the server",
				},
			],
		});
	}

	async run(int: CommandInteraction) {
		const subcommand = int.options.getSubcommand(true);

		if (subcommand === "user") {
			const member = (int.options.getMember("user") as GuildMember) ?? (int.member as GuildMember);

			const embed = new MessageEmbed()
				.setTitle(member.user.tag)
				.setColor(member.roles.highest.color)
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
				.addField(
					"Joined At",
					`${formatUnixTimestamp(member.joinedTimestamp!)} (${formatUnixTimestamp(
						member.joinedTimestamp!,
						"R"
					)})`
				)
				.addField(
					"Created At",
					`${formatUnixTimestamp(member.user.createdTimestamp!)} (${formatUnixTimestamp(
						member.user.createdTimestamp!,
						"R"
					)})`
				)
				.setFooter(`ID: ${member.id}`);

			return int.reply({ embeds: [embed] });
		} else if (subcommand === "role") {
			const role = int.options.getRole("role", true) as Role;

			const embed = new MessageEmbed()
				.setTitle(role.name)
				.setColor(role.color)
				.addField("Position", `${role.position - 1}/${(int.guild as Guild).roles.cache.size - 1}`, true)
				.addField(
					"Created At",
					`${formatUnixTimestamp(role.createdTimestamp)} (${formatUnixTimestamp(
						role.createdTimestamp,
						"R"
					)})`,
					true
				)
				.setFooter(`ID: ${role.id}`);

			return int.reply({ embeds: [embed] });
		} else if (subcommand === "server") {
			const guild = int.guild!;

			const embed = new MessageEmbed()
				.setTitle(guild.name)
				.setColor(guild.me!.roles.highest.color)
				.addField("Member Count", guild.memberCount.toString(), true)
				.addField(
					"Created At",
					`${formatUnixTimestamp(guild.createdTimestamp)} (${formatUnixTimestamp(guild.createdTimestamp)})`,
					true
				)
				.setFooter(`ID: ${guild.id}`);

			if (guild.icon) embed.setThumbnail(guild.iconURL({ dynamic: true, size: 256 })!);

			return int.reply({ embeds: [embed] });
		}
	}
}
