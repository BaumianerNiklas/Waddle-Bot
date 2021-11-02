// ==========================================
// https://pokeapi.co/v2/api/pokemon/:pokemon
// ==========================================
export interface Pokemon {
	id: number;
	name: string;
	types: Type[];
	abilities: Ability[];
	stats: Stat[];
	moves: Move[];
	height: number;
	weight: number;
	sprites: Sprites;
	is_default: boolean;
	species: {
		name: string;
		url: string;
	};
}

type TypeName =
	| "normal"
	| "fighting"
	| "flying"
	| "poison"
	| "ground"
	| "rock"
	| "bug"
	| "ghost"
	| "steel"
	| "fire"
	| "water"
	| "grass"
	| "electric"
	| "psychic"
	| "ice"
	| "dragon"
	| "dark"
	| "fairy"
	| "shadow"
	| "unknown";
// "shadow" and "unknown" are types apparently: https://pokeapi.co/api/v2/type
interface Type {
	slot: 1 | 2;
	type: {
		name: TypeName;
		url: string;
	};
}

interface Ability {
	ability: {
		name: string;
		url: string;
	};
	is_hidden: boolean;
	slot: 1 | 2;
}

interface Move {
	move: {
		name: string;
		url: string;
	};
}

type StatName = "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed";
interface Stat {
	base_stat: number;
	effort: number;
	stat: {
		name: StatName;
		url: string;
	};
}

interface Sprites {
	back_default: string;
	back_female?: string;
	back_shiny: string;
	back_shiny_female?: string;
	front_default: string;
	front_female?: string;
	front_shiny: string;
	front_shiny_female?: string;
	other: {
		official_artwork: {
			front_default: string;
		};
	};
}

// ==================================================
// https://pokeapi.co/api/v2/pokemon-species/:species
// ==================================================
export interface PokemonSpecies {
	id: number;
	name: string;
	names: SpeciesName[];
	flavor_text_entries: FlavorTextEntry[];
	evolution_chain: {
		url: string;
	};
}

interface SpeciesName {
	language: {
		name: string;
		url: string;
	};
	name: string;
}

// Pokedex entries in different languages
interface FlavorTextEntry {
	flavor_text: string;
	language: {
		name: string;
		url: string;
	};
	version: {
		name: string;
		url: string;
	};
}

// ====================================================
// https://pokeapi.co/api/v2/evolution-chain/:evolution
// ====================================================
export interface EvolutionChain {
	chain: {
		evolves_to: EvolutionChainEntry[];
		species: {
			name: string;
			url: string;
		};
	};
}

interface EvolutionChainEntry {
	species: {
		name: string;
		url: string;
	};
	evolves_to: EvolutionChainEntry[];
}
