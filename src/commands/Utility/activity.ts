import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import roundToNearestMinutesWithOptions from "date-fns/esm/fp/roundToNearestMinutesWithOptions/index.js";
import { CommandInteraction, MessageActionRow, MessageButton, VoiceChannel } from "discord.js";

@CommandData({
	name: "activity",
	description: "(EXPIREMENTAL) Generate a Voice Activity link in a Voice Channel",
	category: "Utility",
	options: [
		{
			type: "STRING",
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
			type: "CHANNEL",
			name: "channel",
			description: "The channel to generate a Voice Activity Link for",
			required: true,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		const channel = int.options.getChannel("channel", true);

		if (channel.type !== "GUILD_VOICE") {
			return int.editReply({ content: `<#${channel.id}> is not a valid Voice Channel!` });
		}

		// TS doesn't infer this :(
		const invite = await (channel as VoiceChannel).createInvite({
			targetType: 2,
			targetApplication: int.options.getString("activity", true),
		});

		const link = `https://discord.gg/${invite.code}`;
		const components = [
			new MessageActionRow().addComponents(
				new MessageButton().setStyle("LINK").setURL(link).setLabel("Launch this Activity")
			),
		];

		int.reply({
			content: `__**${invite.targetApplication}** (<#${channel.id}>)__\nLink: ${link}`,
			components,
		});
	}
}