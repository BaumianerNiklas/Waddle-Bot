import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { Embed } from "#util/builders.js";
import { COLOR_BOT } from "#util/constants.js";
import { ErrorEmbed } from "#util/embeds.js";
import { ChatInputCommandInteraction, Formatters, GuildMember, ApplicationCommandOptionType } from "discord.js";
import { evaluate } from "mathjs";

@CommandData({
	name: "calculate",
	description: "Evaluate a math expression!",
	category: "Utility",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "expression",
			description: "The math expression to evaluate",
			required: true,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: ChatInputCommandInteraction) {
		const expression = int.options.getString("expression", true);
		let result;
		try {
			result = evaluate(expression);
		} catch (e) {
			return int.reply({
				embeds: [new ErrorEmbed("I couldn't evalute your provided expression, please make sure it is valid.")],
			});
		}

		const embed = Embed({
			fields: [
				{ name: "Input", value: Formatters.codeBlock("xl", expression) },
				{ name: "Output", value: Formatters.codeBlock("xl", result.toString()) },
			],
			color: (int.member as GuildMember)?.displayColor ?? COLOR_BOT,
		});

		int.reply({ embeds: [embed] });
	}
}
