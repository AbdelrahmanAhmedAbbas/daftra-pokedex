interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  currentCount: number;
  totalCount: number;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onLoadMore,
  isLoading,
  hasMore,
  currentCount,
  totalCount,
}) => {
  if (!hasMore && currentCount > 0) {
    return (
      <div className="text-center">
        <div className="inline-block bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg font-semibold shadow-sm">
          🎉 You've reached the end of the Pokédex!
        </div>
      </div>
    );
  }

  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Loading...
          </span>
        ) : (
          "Load More Pokémon"
        )}
      </button>
      <div className="text-center text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
        Showing {currentCount} of {totalCount} Pokémon
      </div>
    </div>
  );
};

export default LoadMoreButton;
