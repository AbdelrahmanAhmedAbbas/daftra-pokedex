const SkeletonCard: React.FC = () => (
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

export default SkeletonCard;
