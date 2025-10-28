import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PokemonDetail from './';
import * as pokemonService from '../../services/pokemon.service';

jest.mock('../../services/pokemon.service');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement, route: string = '/pokemon/25') => {
  const queryClient = createTestQueryClient();
  window.history.pushState({}, 'Test page', route);

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/pokemon/:id" element={component} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PokemonDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    base_experience: 112,
    types: [
      {
        slot: 1,
        type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
      },
    ],
    stats: [
      { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 90, effort: 0, stat: { name: 'speed', url: '' } },
    ],
    abilities: [
      {
        is_hidden: false,
        slot: 1,
        ability: { name: 'static', url: '' },
      },
      {
        is_hidden: true,
        slot: 3,
        ability: { name: 'lightning-rod', url: '' },
      },
    ],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      front_shiny: null,
      front_female: null,
      front_shiny_female: null,
      back_default: null,
      back_shiny: null,
      back_female: null,
      back_shiny_female: null,
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        },
      },
    },
  };

  it('should render loading state initially', () => {
    (pokemonService.fetchPokemonById as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithProviders(<PokemonDetail />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render pokemon details after loading', async () => {
    (pokemonService.fetchPokemonById as jest.Mock).mockResolvedValue(mockPokemon);

    renderWithProviders(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('#025')).toBeInTheDocument();
    });
  });

  it('should display pokemon height and weight', async () => {
    (pokemonService.fetchPokemonById as jest.Mock).mockResolvedValue(mockPokemon);

    renderWithProviders(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText(/height/i)).toBeInTheDocument();
      expect(screen.getByText(/0.4 m/i)).toBeInTheDocument();
      expect(screen.getByText(/weight/i)).toBeInTheDocument();
      expect(screen.getByText(/6.0 kg/i)).toBeInTheDocument();
    });
  });

  it('should display pokemon types', async () => {
    (pokemonService.fetchPokemonById as jest.Mock).mockResolvedValue(mockPokemon);

    renderWithProviders(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText('electric')).toBeInTheDocument();
    });
  });

  it('should display multiple types', async () => {
    const multiTypePokemon = {
      ...mockPokemon,
      types: [
        {
          slot: 1,
          type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
        },
        {
          slot: 2,
          type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
        },
      ],
    };

    (pokemonService.fetchPokemonById as jest.Mock).mockResolvedValue(multiTypePokemon);

    renderWithProviders(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText('grass')).toBeInTheDocument();
      expect(screen.getByText('poison')).toBeInTheDocument();
    });
  });

  it('should render error state when fetch fails', async () => {
    (pokemonService.fetchPokemonById as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    renderWithProviders(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('should handle retry after error', async () => {
    (pokemonService.fetchPokemonById as jest.Mock)
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockResolvedValueOnce(mockPokemon);

    renderWithProviders(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });
  });

  it('should have a back button', async () => {
    (pokemonService.fetchPokemonById as jest.Mock).mockResolvedValue(mockPokemon);

    renderWithProviders(<PokemonDetail />);

    await waitFor(() => {
      const backButton = screen.getByRole('link', { name: /back/i });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute('href', '/');
    });
  });

  it('should display pokemon image from pokemon.com CDN', async () => {
    (pokemonService.fetchPokemonById as jest.Mock).mockResolvedValue(mockPokemon);

    renderWithProviders(<PokemonDetail />);

    await waitFor(() => {
      const image = screen.getByAltText('Pikachu');
      expect(image).toHaveAttribute(
        'src',
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png'
      );
    });
  });
});
