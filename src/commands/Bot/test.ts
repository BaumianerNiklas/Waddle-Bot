import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { ActionRow, ButtonComponent } from "@discordjs/builders";
import { ButtonStyle, ChatInputCommandInteraction } from "discord.js";

@CommandData({
	name: "component-test",
	description: "test",
	category: "Bot",
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		await int.deferReply({ fetchReply: true });

		const row1 = new ActionRow().addComponents(
			new ButtonComponent().setCustomId("one").setLabel("label 1").setStyle(ButtonStyle.Danger),
			new ButtonComponent().setCustomId("two").setLabel("label 2").setStyle(ButtonStyle.Secondary)
		);
		const row2 = new ActionRow().addComponents(
			new ButtonComponent().setCustomId("three").setLabel("label 3").setStyle(ButtonStyle.Success),
			new ButtonComponent()
				.setLabel("owo ")
				.setURL("https://youtube.com/search?q=never+gonna+give+you+up")
				.setStyle(ButtonStyle.Link)
		);

		await int.editReply({ content: "content", components: [row1, row2] });
	}

	private generateComponents(): ActionRow[] {
		const row1 = new ActionRow().addComponents(
			new ButtonComponent().setCustomId("clear").setLabel("C").setStyle(ButtonStyle.Danger),
			new ButtonComponent().setCustomId("(").setLabel("(").setStyle(ButtonStyle.Primary),
			new ButtonComponent().setCustomId(")").setLabel(")").setStyle(ButtonStyle.Primary),
			new ButtonComponent().setCustomId("^").setLabel("^").setStyle(ButtonStyle.Primary),
			// not exactly sure what log to take here. could be log/ln, log10 or log2
			new ButtonComponent().setCustomId("log10(").setLabel("log").setStyle(ButtonStyle.Primary)
		);
		const row2 = new ActionRow().addComponents(
			new ButtonComponent().setCustomId("7").setLabel("7").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("8").setLabel("8").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("9").setLabel("9").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("/").setLabel("/").setStyle(ButtonStyle.Primary),
			new ButtonComponent().setCustomId("tan(").setLabel("tan").setStyle(ButtonStyle.Primary)
		);
		const row3 = new ActionRow().addComponents(
			new ButtonComponent().setCustomId("4").setLabel("4").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("5").setLabel("5").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("6").setLabel("6").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("*").setLabel("*").setStyle(ButtonStyle.Primary),
			new ButtonComponent().setCustomId("cos(").setLabel("cos").setStyle(ButtonStyle.Primary)
		);
		const row4 = new ActionRow().addComponents(
			new ButtonComponent().setCustomId("1").setLabel("1").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("2").setLabel("2").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("3").setLabel("3").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("-").setLabel("-").setStyle(ButtonStyle.Primary),
			new ButtonComponent().setCustomId("sin(").setLabel("sin").setStyle(ButtonStyle.Primary)
		);
		const row5 = new ActionRow().addComponents(
			new ButtonComponent().setCustomId("0").setLabel("0").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId(".").setLabel(".").setStyle(ButtonStyle.Secondary),
			new ButtonComponent().setCustomId("=").setLabel("=").setStyle(ButtonStyle.Success),
			new ButtonComponent().setCustomId("+").setLabel("+").setStyle(ButtonStyle.Primary),
			new ButtonComponent().setCustomId("sqrt(").setLabel("√").setStyle(ButtonStyle.Primary)
		);
		return [row1, row2, row3, row4, row5];
	}
}
