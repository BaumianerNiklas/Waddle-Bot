import { randomItemFromArray } from "#util/functions.js";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, escapeMarkdown } from "discord.js";
import { ChatInputCommand } from "iubus";

export default new ChatInputCommand({
	name: "uwuify",
	description: "UwUify some text",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "text",
			description: "The text to uwuify",
			required: true,
		},
	],
	async run(int: ChatInputCommandInteraction) {
		const text = int.options.getString("text", true);
		const newText = addKaomoji(transformCharacters(text));

		int.reply(newText.slice(0, 2000));
	},
});

function transformCharacters(text: string): string {
	const UWU_CHANCE = 0.4;
	// Some of these are wrapped in functions so they are called individually for every match
	return text
		.replace(/u/g, () => (Math.random() < UWU_CHANCE ? "uwu" : "u"))
		.replace(/o/g, () => (Math.random() < UWU_CHANCE ? "owo" : "o"))
		.replace(/U/g, () => (Math.random() < UWU_CHANCE ? "UwU" : "U"))
		.replace(/O/g, () => (Math.random() < UWU_CHANCE ? "OwO" : "O"))
		.replace(/[lr]/g, "w")
		.replace(/[LR]/g, "W");
}

function addKaomoji(text: string): string {
	return text.replace(/[.!;?]+/g, (match) => {
		if (match.includes(".") || match.includes(";"))
			return `${"!".repeat(match.length)} ${getKaomoji(happyKaomoji)}`;
		else if (match.includes("!")) return `${match.repeat(3)} ${getKaomoji(exclamationKaomoji)}`;
		else return `${match} ${getKaomoji(questionKaomoji)}`;
	});
}

function getKaomoji(kaomojiList: string[]): string {
	return escapeMarkdown(randomItemFromArray(kaomojiList));
}

const happyKaomoji = [
	"(* ^ ω ^)",
	"(´ ∀ ` *)",
	"☆:.｡.o(≧▽≦)o.｡.:☆",
	"(o^▽^o)",
	"(´｡• ω •｡`)",
	"(o･ω･o)",
	"(＠＾◡＾)",
	"ヽ(*・ω・)ﾉ",
	"(((o(°▽°)o)))",
	"(≧ω≦)",
	"(っ˘ω˘ς )",
	"☆ ～('▽^人)",
	"°˖✧◝(⁰▿⁰)◜✧˖°",
	"ヽ(>∀<☆)ノ",
];

const exclamationKaomoji = [
	...happyKaomoji,
	"(・`ω´・)",
	"ヽ(`⌒´メ)ノ",
	"୧((#Φ益Φ#))୨",
	"＼＼٩(๑`^´๑)۶／／",
	"(＃｀д´)ﾉ",
];

const questionKaomoji = ["(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)", "(„ಡωಡ„)", "(⌒_⌒;)", "(//ω//)", "(＞ｍ＜)", "(ノωヽ)", "＼(º □ º l|l)/"];
