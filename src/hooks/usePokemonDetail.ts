import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchPokemonById } from '../services/pokemon.service';
import { Pokemon } from '../types/pokemon.types';

export const usePokemonDetail = (id: number) => {
  return useSuspenseQuery<Pokemon, Error>({
    queryKey: ['pokemon', 'detail', id],
    queryFn: () => fetchPokemonById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
