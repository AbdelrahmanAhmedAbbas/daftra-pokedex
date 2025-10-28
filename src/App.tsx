import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaginationView from './pages/PaginationView';
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaginationView />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          {/* Load More view will be added next */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
