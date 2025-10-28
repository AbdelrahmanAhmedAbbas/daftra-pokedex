import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../../services/pokemon.service';
import { extractPokemonId } from '../../services/pokemon.service';
import PokemonCard from '../../components/PokemonCard';
import { PokemonCardData, PokemonListItem } from '../../types/pokemon.types';

const ITEMS_PER_PAGE = 20;

const LoadMoreView: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['pokemon', 'load-more', offset],
    queryFn: () => fetchPokemonList(ITEMS_PER_PAGE, offset),
    staleTime: 5 * 60 * 1000,
    onSuccess: (newData) => {
      if (offset === 0) {
        setAllPokemon(newData.results);
      } else {
        setAllPokemon((prev) => [...prev, ...newData.results]);
      }
    },
  });

  const handleLoadMore = () => {
    setOffset((prev) => prev + ITEMS_PER_PAGE);
  };

  const hasMore = data?.next !== null;

  if (isLoading && offset === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">
            {error?.message || 'Failed to load Pokémon'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pokemonList: PokemonCardData[] = (offset === 0 ? data?.results : allPokemon)?.map(
    (pokemon) => ({
      id: extractPokemonId(pokemon.url),
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractPokemonId(
        pokemon.url
      )}.png`,
    })
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pokédex</h1>
          <p className="text-gray-600 mb-4">
            Showing {pokemonList.length} of {data?.count} Pokémon
          </p>
          <div className="flex justify-center gap-2">
            <a
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Pagination
            </a>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
              Load More
            </span>
          </div>
        </header>

        {/* Pokemon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {pokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isFetching ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </span>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}

        {!hasMore && pokemonList.length > 0 && (
          <p className="text-center text-gray-600">You've reached the end of the Pokédex!</p>
        )}
      </div>
    </div>
  );
};

export default LoadMoreView;
