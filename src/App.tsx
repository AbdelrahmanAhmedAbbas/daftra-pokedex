import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaginationView from './pages/PaginationView';

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
          {/* Detail page will be added next */}
          {/* Load More view will be added next */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
