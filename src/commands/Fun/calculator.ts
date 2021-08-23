import BaseCommand from "#structures/BaseCommand.js";
import { disabledComponents } from "#util/functions.js";
import {
	ButtonInteraction,
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	Formatters,
} from "discord.js";
import { evaluate } from "mathjs";

export default class extends BaseCommand {
	constructor() {
		super({
			name: "calculator",
			description: "Bring up a Calculator!",
			category: "Fun",
		});
	}

	async run(int: CommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		// Variable for storing & editing the expression to evaluate
		let data = "";
		let content: string = Formatters.codeBlock("fix", " ");

		await int.editReply({ components: this.generateComponents(), content });

		const filter = (i: ButtonInteraction) => i.user.id === int.user.id;
		const collector = botMsg.createMessageComponentCollector({ filter, time: 20e3, componentType: "BUTTON" });

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
						console.log(data);
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

		collector.on("end", () => {
			botMsg.edit({ components: disabledComponents(botMsg) });
		});
	}

	private formatContent(data: string): string {
		return Formatters.codeBlock("fix", data.length ? data : " ");
	}

	// TODO?: don't hardcode this
	private generateComponents(): MessageActionRow[] {
		const row1 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId("clear").setLabel("C").setStyle("DANGER"),
			new MessageButton().setCustomId("(").setLabel("(").setStyle("PRIMARY"),
			new MessageButton().setCustomId(")").setLabel(")").setStyle("PRIMARY"),
			new MessageButton().setCustomId("^").setLabel("^").setStyle("PRIMARY"),
			// not exactly sure what log to take here. could be log/ln, log10 or log2
			new MessageButton().setCustomId("log10(").setLabel("log").setStyle("PRIMARY")
		);
		const row2 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId("7").setLabel("7").setStyle("SECONDARY"),
			new MessageButton().setCustomId("8").setLabel("8").setStyle("SECONDARY"),
			new MessageButton().setCustomId("9").setLabel("9").setStyle("SECONDARY"),
			new MessageButton().setCustomId("/").setLabel("/").setStyle("PRIMARY"),
			new MessageButton().setCustomId("tan(").setLabel("tan").setStyle("PRIMARY")
		);
		const row3 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId("4").setLabel("4").setStyle("SECONDARY"),
			new MessageButton().setCustomId("5").setLabel("5").setStyle("SECONDARY"),
			new MessageButton().setCustomId("6").setLabel("6").setStyle("SECONDARY"),
			new MessageButton().setCustomId("*").setLabel("*").setStyle("PRIMARY"),
			new MessageButton().setCustomId("cos(").setLabel("cos").setStyle("PRIMARY")
		);
		const row4 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId("1").setLabel("1").setStyle("SECONDARY"),
			new MessageButton().setCustomId("2").setLabel("2").setStyle("SECONDARY"),
			new MessageButton().setCustomId("3").setLabel("3").setStyle("SECONDARY"),
			new MessageButton().setCustomId("-").setLabel("-").setStyle("PRIMARY"),
			new MessageButton().setCustomId("sin(").setLabel("sin").setStyle("PRIMARY")
		);
		const row5 = new MessageActionRow().addComponents(
			new MessageButton().setCustomId("0").setLabel("0").setStyle("SECONDARY"),
			new MessageButton().setCustomId(".").setLabel(".").setStyle("SECONDARY"),
			new MessageButton().setCustomId("=").setLabel("=").setStyle("SUCCESS"),
			new MessageButton().setCustomId("+").setLabel("+").setStyle("PRIMARY"),
			new MessageButton().setCustomId("sqrt(").setLabel("sqrt").setStyle("PRIMARY")
		);
		return [row1, row2, row3, row4, row5];
	}
}
