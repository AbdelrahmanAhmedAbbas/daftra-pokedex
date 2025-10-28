import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import PaginationView from './pages/PaginationView';
import LoadMoreView from './pages/LoadMoreView';
import PokemonDetail from './pages/PokemonDetail';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Skeleton Card Component
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

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100 py-12 px-4">
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">⚡ Pokédex</h1>
        <p className="text-gray-600 mb-6 text-lg">Loading...</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
      <p className="text-gray-700 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<PaginationView />} />
              <Route path="/load-more" element={<LoadMoreView />} />
              <Route path="/pokemon/:id" element={<PokemonDetail />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
