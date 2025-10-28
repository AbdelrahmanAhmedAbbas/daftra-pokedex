import { useState } from "react";
import { usePokemonList } from "../../hooks/usePokemonList";
import { mapPokemonListToCardData } from "../../utils/pokemonMappers";
import PageHeader from "../../components/PageHeader";
import PokemonGrid from "../../components/PokemonGrid";
import PaginationControls from "../../components/PaginationControls";

const ITEMS_PER_PAGE = 20;

const PaginationView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data } = usePokemonList(ITEMS_PER_PAGE, offset);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const pokemonList = data?.results ? mapPokemonListToCardData(data.results) : [];
  const totalPages = Math.ceil((data?.count || 0) / ITEMS_PER_PAGE);
  const hasNext = data?.next !== null;
  const hasPrevious = data?.previous !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="⚡ Pokédex"
          subtitle="Discover and explore Pokemon with page controls"
          currentView="pagination"
        />

        <PokemonGrid pokemonList={pokemonList} />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={data?.count || 0}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onPageClick={handlePageClick}
        />
      </div>
    </div>
  );
};

export default PaginationView;
