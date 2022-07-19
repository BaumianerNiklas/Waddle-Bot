import { FETCHING_API_FAILED } from "#util/messages.js";
import { capitalizeFirstLetter, disabledComponents, fuzzysearchArray } from "#util/functions.js";
import {
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	Message,
	ApplicationCommandOptionType,
	ComponentType,
	ButtonStyle,
} from "discord.js";
import { Pokemon, Ability, Sprites, PokemonSpecies, FlavorTextEntry, EvolutionChain } from "#types/pokeAPI";
import { EMOTE_SMALL_ARROW_R } from "#util/constants.js";
import { readFile } from "node:fs/promises";
import { ActionRow, Button, Embed } from "#util/builders.js";
import { ChatInputCommand } from "iubus";
import { commandExecutionError } from "#util/commandExecutionError.js";

const pokemonList = (await readFile("./assets/text/pokemonList.txt")).toString().split("\n");

export default new ChatInputCommand({
	name: "pokemon",
	description: "Get information about a Pokémon",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "pokemon",
			description: "The Pokémon to get information about",
			autocomplete: true,
			required: true,
		},
	],
	async run(int: ChatInputCommandInteraction) {
		const BASE_API_URL = "https://pokeapi.co/api/v2";
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		let displayShiny = false;
		let displayBack = false;

		const pokemon = int.options.getString("pokemon", true).toLowerCase();
		const speciesResult = await fetch(`${BASE_API_URL}/pokemon-species/${normalizeForApi(pokemon)}`);

		if (speciesResult.status === 404) {
			await commandExecutionError(
				int,
				`I couldn't get any information about **${pokemon}**. If the name didn't work, try the Pokédex number.`
			);
		} else if (!speciesResult.ok) {
			await commandExecutionError(int, FETCHING_API_FAILED("information about this Pokémon."));
		}

		// I have no idea why 'Pokemon' and 'PokemonSpecies' are completely different endpoints
		const data = (await speciesResult.json()) as PokemonSpecies;

		const pokemonURL = `${BASE_API_URL}/pokemon/${data.id}`;
		const pokemonData = (await (await fetch(pokemonURL)).json()) as Pokemon;
		const evolutionData = (await (await fetch(data.evolution_chain.url)).json()) as EvolutionChain;

		const embed = Embed({
			title: `${data.names.find((n) => n.language.name === "en")?.name} - #${data.id}`,
			description: getPokedexEntry(data.flavor_text_entries),
			fields: [
				{
					name: "Type(s)",
					value: pokemonData.types.map((t) => capitalizeFirstLetter(t.type.name)).join(", "),
					inline: true,
				},
				{ name: "Abilities", value: formatAbilities(pokemonData.abilities), inline: true },
				{ name: "\u200b", value: "\u200b", inline: true }, // empty field for nicer formatting
				{
					name: "Stats",
					value: pokemonData.stats.map((s) => `**${statMappings[s.stat.name]}**: ${s.base_stat}`).join(", "),
					inline: true,
				},
				{ name: "Height", value: `${pokemonData.height / 10}m`, inline: true }, // These units are in decimetres and hectograms
				{ name: "Weight", value: `${pokemonData.weight / 10}kg`, inline: true },
			],
			thumbnail: { url: pokemonData.sprites.front_default },
			color: typeColorMappings[pokemonData.types[0].type.name],
		});

		if (evolutionData.chain.evolves_to.length) {
			embed.fields?.push({
				name: "Evolution Chain",
				value: generateEvolutionChain(evolutionData, data.name),
			});
		}

		await int.editReply({
			embeds: [embed],
			components: generateComponents(pokemonData.sprites, displayShiny, displayBack),
		});

		const filter = (i: ButtonInteraction) => i.user.id === int.user.id;
		const collector = botMsg.createMessageComponentCollector({
			filter,
			componentType: ComponentType.Button,
			time: 15e3,
		});

		collector.on("collect", (btn) => {
			if (btn.customId === "displayShiny") displayShiny = !displayShiny;
			else if (btn.customId === "displayBack") displayBack = !displayBack;

			embed.thumbnail = { url: getSprite(pokemonData.sprites, displayShiny, displayBack) };
			btn.update({
				embeds: [embed],
				components: generateComponents(pokemonData.sprites, displayShiny, displayBack),
			});
			collector.resetTimer();
		});
		collector.on("end", async () => {
			botMsg.edit({ components: disabledComponents((await botMsg.fetch()).components.map((x) => x.toJSON())) });
		});
	},

	async autocomplete(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused().toString().toLowerCase();
		const matches = fuzzysearchArray(pokemonList, focused, true);

		const response = matches
			.map((m) => {
				return {
					value: normalizeForApi(m),
					name: m,
				};
			})
			.slice(0, 25);
		interaction.respond(response);
	},
});

function formatAbilities(abilities: Ability[]) {
	return abilities
		.map((a) => (a.is_hidden ? `**${normalize(a.ability.name)}**` : normalize(a.ability.name)))
		.join(", ");
}

function normalize(str: string) {
	return capitalizeFirstLetter(str.replace(/-/g, " "));
}

function normalizeForApi(str: string) {
	return str
		.replace(/\./g, "") // eg mr. mime -> mr-mime
		.replace(/:/g, "") // eg type: null -> type-null
		.replace(/ /g, "-") // eg tapu Koko -> tapu-koko
		.replace(/'/g, "") // eg farfetch'd -> farfetchd
		.replace(/\u2642/g, "-m") // eg nidoran♂️ -> nidoran-m
		.replace(/\u2640/g, "-f"); // eg nidoran♀️ -> nidoran-f
}

function generateComponents(sprites: Sprites, displayShiny: boolean, displayBack: boolean) {
	// const spriteRow = new ActionRowBuilder();
	const spriteRow = ActionRow();

	if (sprites.front_shiny) {
		spriteRow.components.push(
			Button({
				custom_id: "displayShiny",
				label: "Show shiny sprite",
				style: displayShiny ? ButtonStyle.Primary : ButtonStyle.Secondary,
			})
		);
	}

	if (sprites.back_default && sprites.back_shiny) {
		spriteRow.components.push(
			Button({
				custom_id: "displayBack",
				label: "Show back sprite",
				style: displayBack ? ButtonStyle.Primary : ButtonStyle.Secondary,
			})
		);
	}
	return [spriteRow];
}

function getSprite(sprites: Sprites, displayShiny: boolean, displayBack: boolean) {
	if (!displayShiny) {
		if (!displayBack) {
			return sprites.front_default;
		} else {
			return sprites.back_default;
		}
	} else {
		if (!displayBack) {
			return sprites.front_shiny;
		} else {
			return sprites.back_shiny;
		}
	}
}

function getPokedexEntry(flavorTextEntries: FlavorTextEntry[]) {
	for (const entry of flavorTextEntries) {
		if (entry.language.name === "en") {
			return entry.flavor_text.replace(/[\n\f]/g, " ");
		}
	}
	return "*No Pokédex information found about this Pokémon.*";
}

function generateEvolutionChain(chain: EvolutionChain, curPokemon: string) {
	let result = `${formatEvoChainEntry(
		chain.chain.species.name,
		curPokemon
	)} ${EMOTE_SMALL_ARROW_R} ${formatEvoChainEntry(chain.chain.evolves_to[0].species.name, curPokemon)}`;

	if (chain.chain.evolves_to[0].evolves_to.length) {
		result += ` ${EMOTE_SMALL_ARROW_R} ${formatEvoChainEntry(
			chain.chain.evolves_to[0].evolves_to[0].species.name,
			curPokemon
		)}`;
	}
	return result;
}

function formatEvoChainEntry(pokemon: string, curPokemon: string) {
	return pokemon === curPokemon ? `__${normalize(pokemon)}__` : normalize(pokemon);
}

const statMappings = {
	hp: "HP",
	attack: "ATK",
	defense: "DEF",
	"special-attack": "Sp.ATK",
	"special-defense": "Sp.DEF",
	speed: "SPD",
} as const;

const typeColorMappings = {
	normal: 0xaaaa99,
	fire: 0xff4422,
	water: 0x3399ff,
	grass: 0x77cc55,
	electric: 0xf4c330,
	ice: 0x66ccff,
	fighting: 0xbb5544,
	poison: 0xaa5599,
	ground: 0xd6b552,
	flying: 0x8899ff,
	psychic: 0xff5599,
	bug: 0xaabb22,
	rock: 0xbbaa66,
	ghost: 0x6666bb,
	dragon: 0x7766ee,
	dark: 0x775544,
	steel: 0xaaaabb,
	fairy: 0xee99ee,
	shadow: 0x000000,
	unknown: 0x00000,
} as const;
