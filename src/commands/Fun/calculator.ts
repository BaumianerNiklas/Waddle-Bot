import { ActionRow, Button } from "#util/builders.js";
import { disabledComponents } from "#util/functions.js";
import { APIActionRowComponent, APIMessageActionRowComponent } from "discord-api-types/v10";
import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Message,
	Formatters,
	ComponentType,
	ButtonStyle,
} from "discord.js";
import { ChatInputCommand } from "iubus";
import { evaluate } from "mathjs";

export default new ChatInputCommand({
	name: "calculator",
	description: "Bring up a Calculator!",
	async run(int: ChatInputCommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		// Variable for storing & editing the expression to evaluate
		let data = "";
		let content: string = Formatters.codeBlock("fix", " ");

		await int.editReply({ components: generateComponents(), content });

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
					content = formatContent(data);
					break;

				case "=":
					try {
						const result = evaluate(data);
						content = formatContent(result ? `${data} = ${result}` : " ");
						data = result ? result : "";
					} catch (e) {
						content = formatContent(
							"Something went wrong while trying to evaluate this expression. Make sure your math expression is valid!"
						);
						data = "";
					}
					break;

				default:
					data += value;
					content = formatContent(data);
					break;
			}
			collector.resetTimer();
			btn.update({ content });
		});

		collector.on("end", async () => {
			botMsg.edit({ components: disabledComponents((await botMsg.fetch()).components.map((x) => x.toJSON())) });
		});
	},
});

function formatContent(data: string): string {
	return Formatters.codeBlock("fix", data.length ? data : " ");
}

function generateComponents() {
	const components: APIActionRowComponent<APIMessageActionRowComponent>[] = [];

	calculatorButtonData.forEach((row) => {
		const actionRow = ActionRow();

		row.forEach((btn) => {
			actionRow.components.push(
				Button({
					custom_id: btn.value,
					label: btn.label ?? btn.value,
					style: btn.style ?? ButtonStyle.Secondary,
				})
			);
		});

		components.push(actionRow);
	});

	return components;
}

interface ICalculatorButton {
	value: string;
	label?: string;
	style?: ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success | ButtonStyle.Danger;
}

const calculatorButtonData: ICalculatorButton[][] = [
	[
		{ value: "clear", label: "C", style: ButtonStyle.Danger },
		{ value: "(", style: ButtonStyle.Primary },
		{ value: ")", style: ButtonStyle.Primary },
		{ value: "^", style: ButtonStyle.Primary },
		{ value: "log10(", label: "log", style: ButtonStyle.Primary },
	],
	[
		{ value: "7" },
		{ value: "8" },
		{ value: "9" },
		{ value: "/", style: ButtonStyle.Primary },
		{ value: "tan(", label: "tan", style: ButtonStyle.Primary },
	],
	[
		{ value: "4" },
		{ value: "5" },
		{ value: "6" },
		{ value: "*", style: ButtonStyle.Primary },
		{ value: "cos(", label: "cos", style: ButtonStyle.Primary },
	],
	[
		{ value: "1" },
		{ value: "2" },
		{ value: "3" },
		{ value: "-", style: ButtonStyle.Primary },
		{ value: "sin(", label: "sin", style: ButtonStyle.Primary },
	],
	[
		{ value: "0" },
		{ value: "." },
		{ value: "=", style: ButtonStyle.Success },
		{ value: "+", style: ButtonStyle.Primary },
		{ value: "sqrt(", label: "√", style: ButtonStyle.Primary },
	],
];
