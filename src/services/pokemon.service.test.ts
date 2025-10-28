import { fetchPokemonList, fetchPokemonById, extractPokemonId } from './pokemon.service';
import { PokemonListResponse, Pokemon } from '../types/pokemon.types';

// Mock fetch globally
global.fetch = jest.fn();

describe('PokemonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractPokemonId', () => {
    it('should extract ID from Pokemon API URL', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/25/';
      expect(extractPokemonId(url)).toBe(25);
    });

    it('should extract ID from URL without trailing slash', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/1';
      expect(extractPokemonId(url)).toBe(1);
    });

    it('should return 0 for invalid URL', () => {
      const url = 'invalid-url';
      expect(extractPokemonId(url)).toBe(0);
    });
  });

  describe('fetchPokemonList', () => {
    it('should fetch pokemon list with default limit and offset', async () => {
      const mockResponse: PokemonListResponse = {
        count: 1302,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPokemonList();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch pokemon list with custom limit and offset', async () => {
      const mockResponse: PokemonListResponse = {
        count: 1302,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=10',
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPokemonList(10, 5);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=10&offset=5'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch Pokemon list');
    });

    it('should throw error when network error occurs', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchPokemonList()).rejects.toThrow('Network error');
    });
  });

  describe('fetchPokemonById', () => {
    it('should fetch pokemon by ID', async () => {
      const mockPokemon: Pokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: [
          {
            slot: 1,
            type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
          },
        ],
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
          front_shiny: null,
          front_female: null,
          front_shiny_female: null,
          back_default: null,
          back_shiny: null,
          back_female: null,
          back_shiny_female: null,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      });

      const result = await fetchPokemonById(25);

      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
      expect(result).toEqual(mockPokemon);
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchPokemonById(9999)).rejects.toThrow('Failed to fetch Pokemon');
    });

    it('should throw error when network error occurs', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchPokemonById(1)).rejects.toThrow('Network error');
    });
  });
});
