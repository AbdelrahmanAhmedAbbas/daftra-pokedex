import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import PaginationView from './';
import * as pokemonService from '../../services/pokemon.service';

// Mock the pokemon service
jest.mock('../../services/pokemon.service', () => ({
  fetchPokemonList: jest.fn(),
  extractPokemonId: jest.fn((url: string) => {
    const matches = url.match(/\/pokemon\/(\d+)\/?$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PaginationView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (pokemonService.fetchPokemonList as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithProviders(<PaginationView />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render pokemon list after loading', async () => {
    const mockData = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    };

    (pokemonService.fetchPokemonList as jest.Mock).mockResolvedValue(mockData);

    renderWithProviders(<PaginationView />);

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    });
  });

  it('should render error state when fetch fails', async () => {
    (pokemonService.fetchPokemonList as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    renderWithProviders(<PaginationView />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('should handle retry after error', async () => {
    (pokemonService.fetchPokemonList as jest.Mock)
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockResolvedValueOnce({
        count: 1302,
        next: null,
        previous: null,
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        ],
      });

    renderWithProviders(<PaginationView />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });
  });

  it('should navigate to next page', async () => {
    const page1Data = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };

    const page2Data = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=40&limit=20',
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20',
      results: [
        { name: 'rattata', url: 'https://pokeapi.co/api/v2/pokemon/19/' },
      ],
    };

    (pokemonService.fetchPokemonList as jest.Mock)
      .mockResolvedValueOnce(page1Data)
      .mockResolvedValueOnce(page2Data);

    renderWithProviders(<PaginationView />);

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Rattata')).toBeInTheDocument();
    });
  });

  it('should disable previous button on first page', async () => {
    (pokemonService.fetchPokemonList as jest.Mock).mockResolvedValue({
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    renderWithProviders(<PaginationView />);

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', async () => {
    (pokemonService.fetchPokemonList as jest.Mock).mockResolvedValue({
      count: 1302,
      next: null,
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=1280&limit=20',
      results: [
        { name: 'calyrex', url: 'https://pokeapi.co/api/v2/pokemon/898/' },
      ],
    });

    renderWithProviders(<PaginationView />);

    await waitFor(() => {
      expect(screen.getByText('Calyrex')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });
});
