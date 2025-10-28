import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPokemonList } from "../../services/pokemon.service";
import { extractPokemonId } from "../../services/pokemon.service";
import PokemonCard from "../../components/PokemonCard";
import {
  PokemonCardData,
  PokemonListItem,
  PokemonListResponse,
} from "../../types/pokemon.types";

const ITEMS_PER_PAGE = 20;

const SkeletonCard = () => (
  <div className="block bg-white bg-opacity-40 rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square flex items-center justify-center bg-gray-300 rounded-lg mb-3"></div>
      <div className="text-center w-full">
        <div className="h-4 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
        <div className="h-5 bg-gray-300 rounded w-24 mx-auto"></div>
      </div>
    </div>
  </div>
);

const LoadMoreView: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<
    PokemonListResponse,
    Error
  >({
    queryKey: ["pokemon", "load-more", offset],
    queryFn: () => fetchPokemonList(ITEMS_PER_PAGE, offset),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Update allPokemon when data changes
  useEffect(() => {
    if (data) {
      if (offset === 0) {
        setAllPokemon(data.results);
      } else {
        setAllPokemon((prev) => [...prev, ...data.results]);
      }
    }
  }, [data, offset]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + ITEMS_PER_PAGE);
  };

  const hasMore = data?.next !== null;

  if (isLoading && offset === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-teal-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              ⚡ Pokédex
            </h1>
            <p className="text-gray-600 mb-4">
              Discover and explore Pokemon with infinite scroll
            </p>
            <div className="flex justify-center gap-2">
              <a
                href="/"
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-md border border-gray-200"
              >
                Page Controls
              </a>
              <span className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold shadow-md">
                Infinite Scroll
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-xl border border-red-200">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-red-600 mb-3">Oops!</h2>
          <p className="text-gray-700 mb-6 text-lg">
            {error?.message || "Failed to load Pokémon"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const pokemonList: PokemonCardData[] = allPokemon.map(
    (pokemon: PokemonListItem) => ({
      id: extractPokemonId(pokemon.url),
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractPokemonId(
        pokemon.url
      )}.png`,
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚡ Pokédex</h1>
          <p className="text-gray-600 mb-4">
            Discover and explore Pokemon with infinite scroll
          </p>
          <div className="flex justify-center gap-2">
            <a
              href="/"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-md border border-gray-200"
            >
              Page Controls
            </a>
            <span className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold shadow-md">
              Infinite Scroll
            </span>
          </div>
        </header>

        {/* Pokemon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {pokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>

        {/* Loading More Skeleton Cards */}
        {isFetching && offset > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`loading-${index}`} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
            >
              {isFetching ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </span>
              ) : (
                "Load More Pokémon"
              )}
            </button>
            <div className="text-center text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              Showing {pokemonList.length} of {data?.count || 0} Pokémon
            </div>
          </div>
        )}

        {!hasMore && pokemonList.length > 0 && (
          <div className="text-center">
            <div className="inline-block bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg font-semibold shadow-sm">
              🎉 You've reached the end of the Pokédex!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadMoreView;
