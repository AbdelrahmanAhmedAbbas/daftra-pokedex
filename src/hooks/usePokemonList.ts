import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../services/pokemon.service';
import { PokemonListResponse } from '../types/pokemon.types';

export const usePokemonList = (limit: number = 20, offset: number = 0) => {
  return useQuery<PokemonListResponse, Error>({
    queryKey: ['pokemon', 'list', limit, offset],
    queryFn: () => fetchPokemonList(limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
