import { BaseCommand, CommandData } from "#structures/BaseCommand.js";
import { ErrorEmbed } from "#util/embeds.js";
import { FETCHING_API_FAILED } from "#util/errorMessages.js";
import { capitalizeFirstLetter, disabledComponents } from "#util/functions.js";
import {
	ButtonInteraction,
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";
import fetch from "node-fetch";
import {
	Pokemon,
	Ability,
	Sprites,
	PokemonSpecies,
	FlavorTextEntry,
	EvolutionChain,
	StatName,
	TypeName,
} from "#types/pokeAPI";
import { EMOTE_SMALL_ARROW_R } from "#util/constants.js";

@CommandData({
	name: "pokemon",
	description: "Get information about a Pokémon",
	category: "Fun",
	options: [
		{
			type: "STRING",
			name: "pokemon",
			description: "The Pokémon to get information about",
			required: true,
		},
	],
})
export class Command extends BaseCommand {
	async run(int: CommandInteraction) {
		const botMsg = (await int.deferReply({ fetchReply: true })) as Message;

		let displayShiny = false;
		let displayBack = false;

		const pokemon = int.options.getString("pokemon", true).toLowerCase();
		const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

		if (result.status === 404) {
			return int.editReply({
				embeds: [
					new ErrorEmbed(
						`I couldn't get any information about **${capitalizeFirstLetter(
							pokemon
						)}**. If the name didn't work, try the PokéDex number.`
					),
				],
			});
		} else if (!result.ok) {
			return int.editReply({ embeds: [new ErrorEmbed(FETCHING_API_FAILED("information about this Pokémon"))] });
		}

		// I have literally no idea why 'Pokemon' and 'PokemonSpecies' are COMPLETELY different endpoints...
		const data = (await result.json()) as Pokemon;

		const speciesData = (await (await fetch(data.species.url)).json()) as PokemonSpecies;
		const evolutionData = (await (await fetch(speciesData.evolution_chain.url)).json()) as EvolutionChain;

		const embed = new MessageEmbed()
			.setTitle(`${capitalizeFirstLetter(data.name)} - #${data.id}`)
			.setDescription(this.getPokedexEntry(speciesData.flavor_text_entries))
			.addField("Type(s)", data.types.map((t) => capitalizeFirstLetter(t.type.name)).join(", "), true)
			.addField("Abilities", this.formatAbilities(data.abilities), true)
			.addField("\u200b", "\u200b", true) // empty field for nicer formatting
			.addField(
				"Stats",
				data.stats.map((s) => `**${statMappings[s.stat.name]}**: ${s.base_stat}`).join(", "),
				true
			)
			.addField("Height", `${data.height / 10}m`, true)
			.addField("Weight", `${data.weight / 10}kg`, true)
			.setThumbnail(data.sprites.front_default)
			.setColor(typeColorMappings[data.types[0].type.name]);

		if (evolutionData.chain.evolves_to.length) {
			embed.addField("Evolution Chain", this.generateEvolutionChain(evolutionData, data.name));
		}

		int.editReply({
			embeds: [embed],
			components: this.generateComponents(data.sprites, displayShiny, displayBack),
		});

		const filter = (i: ButtonInteraction) => i.user.id === int.user.id;
		const collector = botMsg.createMessageComponentCollector({ filter, componentType: "BUTTON", time: 15e3 });

		collector.on("collect", (btn) => {
			if (btn.customId === "displayShiny") displayShiny = !displayShiny;
			else if (btn.customId === "displayBack") displayBack = !displayBack;

			embed.setThumbnail(this.getSprite(data.sprites, displayShiny, displayBack));
			btn.update({
				embeds: [embed],
				components: this.generateComponents(data.sprites, displayShiny, displayBack),
			});
			collector.resetTimer();
		});
		collector.on("end", async () => {
			botMsg.edit({ components: disabledComponents((await botMsg.fetch()).components) });
		});
	}

	private formatAbilities(abilities: Ability[]) {
		return abilities
			.map((a) => (a.is_hidden ? `**${this.normalize(a.ability.name)}**` : this.normalize(a.ability.name)))
			.join(", ");
	}

	private normalize(str: string) {
		return capitalizeFirstLetter(str.replace(/-/g, " "));
	}

	private generateComponents(sprites: Sprites, displayShiny: boolean, displayBack: boolean) {
		const spriteRow = new MessageActionRow();

		if (sprites.front_shiny) {
			spriteRow.addComponents(
				new MessageButton()
					.setCustomId("displayShiny")
					.setLabel("Show shiny sprite")
					.setStyle(displayShiny ? "PRIMARY" : "SECONDARY")
			);
		}
		if (sprites.back_default && sprites.back_shiny) {
			spriteRow.addComponents(
				new MessageButton()
					.setCustomId("displayBack")
					.setLabel("Show back sprite")
					.setStyle(displayBack ? "PRIMARY" : "SECONDARY")
			);
		}

		return [spriteRow];
	}

	private getSprite(sprites: Sprites, displayShiny: boolean, displayBack: boolean) {
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

	private getPokedexEntry(flavorTextEntries: FlavorTextEntry[]) {
		for (const entry of flavorTextEntries) {
			if (entry.language.name === "en") {
				return entry.flavor_text.replace(/[\n\f]/g, " ");
			}
		}
		return `*No PokéDex information found about this Pokémon.*`;
	}

	private generateEvolutionChain(chain: EvolutionChain, curPokemon: string) {
		let result = `${this.formatEvoChainEntry(
			chain.chain.species.name,
			curPokemon
		)} ${EMOTE_SMALL_ARROW_R} ${this.formatEvoChainEntry(chain.chain.evolves_to[0].species.name, curPokemon)}`;

		if (chain.chain.evolves_to[0].evolves_to.length) {
			result += ` ${EMOTE_SMALL_ARROW_R} ${this.formatEvoChainEntry(
				chain.chain.evolves_to[0].evolves_to[0].species.name,
				curPokemon
			)}`;
		}
		return result;
	}

	private formatEvoChainEntry(pokemon: string, curPokemon: string) {
		return pokemon === curPokemon ? `__${this.normalize(pokemon)}__` : this.normalize(pokemon);
	}
}

const statMappings: Record<StatName, string> = {
	hp: "HP",
	attack: "ATK",
	defense: "DEF",
	"special-attack": "Sp.ATK",
	"special-defense": "Sp.DEF",
	speed: "SPD",
};

const typeColorMappings: Record<TypeName, number> = {
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
};
