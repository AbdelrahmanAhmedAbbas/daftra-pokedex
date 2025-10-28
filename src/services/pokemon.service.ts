import { PokemonListResponse, Pokemon } from '../types/pokemon.types';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Extracts the Pokemon ID from a Pokemon API URL
 * @param url - The Pokemon API URL
 * @returns The Pokemon ID or 0 if invalid
 */
export const extractPokemonId = (url: string): number => {
  try {
    const matches = url.match(/\/pokemon\/(\d+)\/?$/);
    return matches ? parseInt(matches[1], 10) : 0;
  } catch {
    return 0;
  }
};

/**
 * Fetches a paginated list of Pokemon
 * @param limit - Number of Pokemon to fetch (default: 20)
 * @param offset - Number of Pokemon to skip (default: 0)
 * @returns Promise with Pokemon list response
 */
export const fetchPokemonList = async (
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }

  return response.json();
};

/**
 * Fetches detailed information about a specific Pokemon
 * @param id - The Pokemon ID
 * @returns Promise with Pokemon data
 */
export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon');
  }

  return response.json();
};
