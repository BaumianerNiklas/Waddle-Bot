import { BaseCommand } from "#structures/BaseCommand.js";
import { disabledComponents } from "#util/functions.js";
import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Message,
	ActionRow,
	ButtonComponent,
	Formatters,
	ComponentType,
	ButtonStyle,
} from "discord.js";
import { evaluate } from "mathjs";

export class Command extends BaseCommand {
	constructor() {
		super({
			name: "calculator",
			description: "Bring up a Calculator!",
			category: "Fun",
		});
	}

	async run(int: ChatInputCommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		// Variable for storing & editing the expression to evaluate
		let data = "";
		let content: string = Formatters.codeBlock("fix", " ");

		await int.editReply({ components: this.generateComponents(), content });

		const filter = (i: ButtonInteraction) => i.user.id === int.user.id;
		const collector = botMsg.createMessageComponentCollector({
			filter,
			time: 20e3,
			componentType: ComponentType.Button,
		});

		collector.on("collect", (btn) => {
			// Expressions to add are stored in the custom Ids
			const value = btn.customId;

			switch (value) {
				case "clear":
					data = "";
					content = this.formatContent(data);
					break;

				case "=":
					try {
						const result = evaluate(data);
						content = this.formatContent(result ? `${data} = ${result}` : " ");
						data = result ? result : "";
					} catch (e) {
						content = this.formatContent(
							"Something went wrong while trying to evaluate this expression. Make sure your math expression is valid!"
						);
						data = "";
					}
					break;

				default:
					data += value;
					content = this.formatContent(data);
					break;
			}
			collector.resetTimer();
			btn.update({ content });
		});

		collector.on("end", async () => {
			botMsg.edit({ components: disabledComponents((await botMsg.fetch()).components) });
		});
	}

	private formatContent(data: string): string {
		return Formatters.codeBlock("fix", data.length ? data : " ");
	}

	// TODO?: don't hardcode this
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
