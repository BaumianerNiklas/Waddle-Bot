import { BaseCommand } from "#structures/BaseCommand.js";
import { ErrorEmbed } from "#util/embeds.js";
import { capitalizeFirstLetter, discordTimestamp } from "#util/functions.js";
import { ImageURLOptions } from "@discordjs/rest";
import { APIRole } from "discord-api-types";
import { CommandInteraction, Guild, GuildMember, MessageEmbed, Role, Permissions } from "discord.js";

export class Command extends BaseCommand {
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
		await int.deferReply();
		const subcommand = int.options.getSubcommand(true);
		const avatarOptions: ImageURLOptions = { dynamic: true, size: 256 };

		if (subcommand === "user") {
			const member = (int.options.getMember("user") as GuildMember) ?? (int.member as GuildMember);
			// Users have to be force fetched in order for their accent (banner) color to be present in the data
			const user = await int.client.users.fetch(member.id, { force: true });

			const joinedAt = member.joinedTimestamp
				? discordTimestamp(member.joinedTimestamp, "R")
				: "This user appears to have left the server.";

			const embed = new MessageEmbed()
				.setAuthor(user.tag, user.displayAvatarURL(avatarOptions))
				.setColor(user.accentColor ?? member.roles.highest.color)
				.setThumbnail(member.displayAvatarURL(avatarOptions))
				.addField("Joined At", joinedAt, true)
				.addField("Created At", discordTimestamp(user.createdTimestamp, "R"), true)
				.addField("Permissions", this.formatPermissions(member.permissions))
				.setFooter(`ID: ${member.id}`);

			return int.editReply({ embeds: [embed] });
		} else if (subcommand === "role") {
			let role: Role | APIRole | null = int.options.getRole("role", true);
			if (!(role instanceof Role)) {
				role = await int.guild!.roles.fetch(role.id);
			}

			if (!role) {
				return int.editReply({
					embeds: [
						new ErrorEmbed(
							"The supplied role doesn't appear to be on this server. Make sure it exists and is not deleted!"
						),
					],
				});
			}

			const embed = new MessageEmbed()
				.setTitle(role.name)
				.setColor(role.color)
				.addField("Position", `${role.position + 1}/${(int.guild as Guild).roles.cache.size}`, true)
				.addField("Created At", discordTimestamp(role.createdTimestamp, "R"), true)
				.addField("Permissions", this.formatPermissions(role.permissions))
				.setFooter(`ID: ${role.id}`);

			if (role.icon) embed.setThumbnail(role.iconURL()!);

			return int.editReply({ embeds: [embed] });
		} else if (subcommand === "server") {
			const guild = int.guild;
			if (!guild?.available) {
				return int.editReply({
					embeds: [
						new ErrorEmbed(
							"Sorry, something went wrong while trying to get information about this guild. Please try again later; this shouldn't really happen!"
						),
					],
				});
			}

			const embed = new MessageEmbed()
				.setTitle(guild.name)
				.setColor(guild.me!.roles.highest.color)
				.addField("Member Count", guild.memberCount.toString(), true)
				.addField("Created At", discordTimestamp(guild.createdTimestamp, "R"), true)
				.setFooter(`ID: ${guild.id}`);

			if (guild.icon) embed.setThumbnail(guild.iconURL({ dynamic: true, size: 256 })!);
			if (guild.banner) embed.setImage(guild.bannerURL()!);

			return int.editReply({ embeds: [embed] });
		}
	}

	private formatPermissions(permissions: Permissions) {
		const permsArray = permissions.toArray();

		if (permsArray.includes("ADMINISTRATOR")) {
			return "`Administrator`";
		}

		return permissions
			.toArray()
			.map((p) => `\`${capitalizeFirstLetter(p.replace(/_/g, " "))}\` `)
			.join(", ");
	}
}
