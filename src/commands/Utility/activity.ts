import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import {
	ChatInputCommandInteraction,
	ActionRow,
	ButtonComponent,
	VoiceChannel,
	ButtonStyle,
	ChannelType,
	ApplicationCommandOptionType,
} from "discord.js";

@CommandData({
	name: "activity",
	description: "(EXPIREMENTAL) Generate a Voice Activity link in a Voice Channel",
	category: "Utility",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "activity",
			description: "The activity to launch",
			required: true,
			choices: [
				{
					name: "YouTube Together",
					value: "755600276941176913",
				},
				{
					name: "Fishington.io",
					value: "814288819477020702",
				},
				{
					name: "Betrayal.io",
					value: "773336526917861400",
				},
				{
					name: "Poker Night",
					value: "755827207812677713",
				},
				{
					name: "Chess",
					value: "832012586023256104",
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Channel,
			name: "channel",
			description: "The channel to generate a Voice Activity Link for",
			channelTypes: [ChannelType.GuildVoice],
			required: true,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		const channel = int.options.getChannel("channel", true);

		// Still here for type safety
		if (channel.type !== ChannelType.GuildVoice) return;

		// TS doesn't infer this :(
		const invite = await (channel as VoiceChannel).createInvite({
			targetType: 2,
			targetApplication: int.options.getString("activity", true),
		});

		const link = `https://discord.gg/${invite.code}`;
		const components = [
			new ActionRow().addComponents(
				new ButtonComponent().setStyle(ButtonStyle.Link).setURL(link).setLabel("Launch this Activity")
			),
		];

		int.reply({
			content: `__**${invite.targetApplication}** (<#${channel.id}>)__\nLink: ${link}`,
			components,
		});
	}
}
