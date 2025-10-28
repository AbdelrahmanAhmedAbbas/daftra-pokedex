import { useQuery } from '@tanstack/react-query';
import { fetchPokemonById } from '../services/pokemon.service';
import { Pokemon } from '../types/pokemon.types';

export const usePokemonDetail = (id: number) => {
  return useQuery<Pokemon, Error>({
    queryKey: ['pokemon', 'detail', id],
    queryFn: () => fetchPokemonById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: id > 0, // Only fetch if id is valid
  });
};
