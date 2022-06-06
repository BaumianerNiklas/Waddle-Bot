import { BaseCommand } from "#structures/BaseCommand.js";
import { Embed, ErrorEmbed } from "#util/builders.js";
import { capitalizeFirstLetter, discordTimestamp, getBotColor } from "#util/functions.js";
import { ImageURLOptions } from "@discordjs/rest";
import {
	Guild,
	GuildMember,
	Role,
	PermissionsBitField,
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} from "discord.js";

export class Command extends BaseCommand {
	constructor() {
		super({
			name: "info",
			category: "Utility",
			description: "Get information about a user, role, or the server",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "user",
					description: "Get information about a user",
					options: [
						{
							type: ApplicationCommandOptionType.User,
							name: "user",
							description: "The user to get information about",
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "role",
					description: "Get information about a role",
					options: [
						{
							type: ApplicationCommandOptionType.Role,
							name: "role",
							description: "The role to get information about",
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "server",
					description: "Get information about the server",
				},
			],
		});
	}

	async run(int: ChatInputCommandInteraction) {
		await int.deferReply();
		const subcommand = int.options.getSubcommand(true);
		const avatarOptions: ImageURLOptions = { size: 256 };

		if (subcommand === "user") {
			const member = (int.options.getMember("user") as GuildMember) ?? (int.member as GuildMember);
			// Users have to be force fetched in order for their accent (banner) color to be present in the data
			const user = await int.client.users.fetch(member.id, { force: true });

			const joinedAt = member.joinedTimestamp
				? discordTimestamp(member.joinedTimestamp, "R")
				: "This user appears to have left the server.";

			const embed = Embed({
				author: { name: user.tag, icon_url: user.displayAvatarURL(avatarOptions) },
				color: user.accentColor ?? member.roles.highest.color,
				thumbnail: { url: member.displayAvatarURL(avatarOptions) },
				fields: [
					{ name: "Joined At", value: joinedAt, inline: true },
					{ name: "Created At", value: discordTimestamp(user.createdTimestamp, "R"), inline: true },
					{ name: "Permissions", value: this.formatPermissions(member.permissions) },
				],
				footer: { text: `ID: ${member.id}` },
			});

			if (user.banner) embed.image = { url: user.bannerURL()! };

			return int.editReply({ embeds: [embed] });
		} else if (subcommand === "role") {
			let role = int.options.getRole("role", true);
			if (!(role instanceof Role)) {
				const fetched = await int.guild?.roles.fetch(role.id);
				if (!fetched) {
					return int.editReply({
						embeds: [
							ErrorEmbed(
								"The supplied role doesn't appear to be on this server. Make sure it exists and is not deleted!"
							),
						],
					});
				} else role = fetched;
			}

			const embed = Embed({
				title: role.name,
				color: role.color,
				fields: [
					{
						name: "Position",
						value: `${role.position + 1}/${(int.guild as Guild).roles.cache.size}`,
						inline: true,
					},
					{ name: "Created At", value: discordTimestamp(role.createdTimestamp, "R"), inline: true },
					{ name: "Permissions", value: this.formatPermissions(role.permissions) },
				],
				footer: { text: `ID: ${role.id}` },
			});

			if (role.icon) embed.thumbnail = { url: role.iconURL()! };

			return int.editReply({ embeds: [embed] });
		} else if (subcommand === "server") {
			const guild = int.guild;
			if (!guild?.available) {
				return int.editReply({
					embeds: [
						ErrorEmbed(
							"Sorry, something went wrong while trying to get information about this guild. Please try again later; this shouldn't really happen!"
						),
					],
				});
			}

			const embed = Embed({
				title: guild.name,
				color: await getBotColor(guild),
				fields: [
					{ name: "Member Count", value: guild.memberCount.toString(), inline: true },
					{ name: "Created At", value: discordTimestamp(guild.createdTimestamp, "R"), inline: true },
				],
				footer: { text: `ID: ${guild.id}` },
			});

			if (guild.icon) embed.thumbnail = { url: guild.iconURL({ size: 256 })! };
			if (guild.banner) embed.image = { url: guild.bannerURL()! };

			return int.editReply({ embeds: [embed] });
		}
	}

	private formatPermissions(permissions: PermissionsBitField) {
		const permsArray = permissions.toArray();

		if (permsArray.includes("Administrator")) {
			return "`Administrator`";
		}

		return permissions
			.toArray()
			.map((p) => `\`${capitalizeFirstLetter(p.replace(/_/g, " "))}\` `)
			.join(", ");
	}
}
