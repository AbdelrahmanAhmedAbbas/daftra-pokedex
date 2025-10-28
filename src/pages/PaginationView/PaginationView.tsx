import { useState } from "react";
import { usePokemonList } from "../../hooks/usePokemonList";
import { extractPokemonId } from "../../services/pokemon.service";
import PokemonCard from "../../components/PokemonCard";
import { PokemonCardData } from "../../types/pokemon.types";

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

const PaginationView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data, isLoading, isError, error, refetch } = usePokemonList(
    ITEMS_PER_PAGE,
    offset
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              ⚡ Pokédex
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Discover and explore Pokemon with page controls
            </p>
            <div className="flex justify-center gap-3">
              <span className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium shadow-sm">
                Page Controls
              </span>
              <a
                href="/load-more"
                className="px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium shadow-sm border border-gray-200"
              >
                Infinite Scroll
              </a>
            </div>
          </header>

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

  const pokemonList: PokemonCardData[] =
    data?.results.map((pokemon) => ({
      id: extractPokemonId(pokemon.url),
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractPokemonId(
        pokemon.url
      )}.png`,
    })) || [];

  const totalPages = Math.ceil((data?.count || 0) / ITEMS_PER_PAGE);
  const hasNext = data?.next !== null;
  const hasPrevious = data?.previous !== null;

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">⚡ Pokédex</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Discover and explore Pokemon with page controls
          </p>
          <div className="flex justify-center gap-3">
            <span className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium shadow-sm">
              Page Controls
            </span>
            <a
              href="/load-more"
              className="px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium shadow-sm border border-gray-200"
            >
              Infinite Scroll
            </a>
          </div>
        </header>

        {/* Pokemon Grid - 4 columns matching the design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {pokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPrevious}
              className="px-5 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm border border-gray-200"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageClick(1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-medium shadow-sm"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="px-2 py-2 text-gray-600">...</span>
                  )}
                </>
              )}

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`px-4 py-2 rounded-md transition-colors font-medium shadow-sm ${
                    page === currentPage
                      ? "bg-gray-800 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-2 py-2 text-gray-600">...</span>
                  )}
                  <button
                    onClick={() => handlePageClick(totalPages)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-medium shadow-sm"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={!hasNext}
              className="px-5 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm border border-gray-200"
            >
              Next →
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            Page {currentPage} of {totalPages} ({data?.count || 0} Pokémon
            found)
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationView;
