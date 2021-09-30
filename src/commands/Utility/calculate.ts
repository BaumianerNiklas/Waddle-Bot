import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { COLOR_BOT } from "#util/constants";
import { ErrorEmbed } from "#util/embeds.js";
import { CommandInteraction, Formatters, GuildMember, MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";

@CommandData({
	name: "calculate",
	description: "Evaluate a math expression!",
	category: "Utility",
	options: [
		{
			type: "STRING",
			name: "expression",
			description: "The math expression to evaluate",
			required: true,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		const expression = int.options.getString("expression", true);
		let result;
		try {
			result = evaluate(expression);
		} catch (e) {
			return int.reply({
				embeds: [new ErrorEmbed("I couldn't evalute your provided expression, please make sure it is valid.")],
			});
		}

		const embed = new MessageEmbed()
			.addField("Input", Formatters.codeBlock("xl", expression))
			.addField("Output", Formatters.codeBlock("xl", result.toString()))
			.setColor((int.member as GuildMember)?.displayColor ?? COLOR_BOT);

		int.reply({ embeds: [embed] });
	}
}
