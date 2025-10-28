interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageClick: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalCount,
  hasNext,
  hasPrevious,
  onPreviousPage,
  onNextPage,
  onPageClick,
}) => {
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
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onPreviousPage}
          disabled={!hasPrevious}
          className="px-5 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm border border-gray-200"
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          {currentPage > 3 && (
            <>
              <button
                onClick={() => onPageClick(1)}
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
              onClick={() => onPageClick(page)}
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
                onClick={() => onPageClick(totalPages)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-medium shadow-sm"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={onNextPage}
          disabled={!hasNext}
          className="px-5 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm border border-gray-200"
        >
          Next →
        </button>
      </div>

      <div className="text-center text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
        Page {currentPage} of {totalPages} ({totalCount} Pokémon found)
      </div>
    </div>
  );
};

export default PaginationControls;
