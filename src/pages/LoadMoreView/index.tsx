import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPokemonList } from "../../services/pokemon.service";
import { mapPokemonListToCardData } from "../../utils/pokemonMappers";
import PageHeader from "../../components/PageHeader";
import PokemonGrid from "../../components/PokemonGrid";
import SkeletonCard from "../../components/SkeletonCard";
import LoadMoreButton from "../../components/LoadMoreButton";
import {
  PokemonListItem,
  PokemonListResponse,
} from "../../types/pokemon.types";

const ITEMS_PER_PAGE = 20;

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
  const pokemonList = mapPokemonListToCardData(allPokemon);

  if (isLoading && offset === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            title="⚡ Pokédex"
            subtitle="Discover and explore Pokemon with infinite scroll"
            currentView="load-more"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="⚡ Pokédex"
          subtitle="Discover and explore Pokemon with infinite scroll"
          currentView="load-more"
        />

        <PokemonGrid pokemonList={pokemonList} />

        {isFetching && offset > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`loading-${index}`} />
            ))}
          </div>
        )}

        <LoadMoreButton
          onLoadMore={handleLoadMore}
          isLoading={isFetching}
          hasMore={hasMore}
          currentCount={pokemonList.length}
          totalCount={data?.count || 0}
        />
      </div>
    </div>
  );
};

export default LoadMoreView;
