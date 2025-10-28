import { PokemonListItem, PokemonCardData } from "../types/pokemon.types";
import { extractPokemonId, getPokemonSpriteUrl } from "./pokemonFormatters";

export const mapPokemonListToCardData = (
  pokemonList: PokemonListItem[]
): PokemonCardData[] => {
  return pokemonList.map((pokemon) => {
    const id = extractPokemonId(pokemon.url);
    return {
      id,
      name: pokemon.name,
      sprite: getPokemonSpriteUrl(id),
    };
  });
};
