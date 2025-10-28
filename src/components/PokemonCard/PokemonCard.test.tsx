import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PokemonCard from "./";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("PokemonCard", () => {
  const mockPokemon = {
    id: 25,
    name: "pikachu",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  };

  it("should render pokemon name", () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("should render pokemon image with correct alt text", () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
    const image = screen.getByAltText("pikachu");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockPokemon.sprite);
  });

  it("should render pokemon ID", () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText("#025")).toBeInTheDocument();
  });

  it("should format ID with leading zeros", () => {
    const pokemon = { ...mockPokemon, id: 5 };
    renderWithRouter(<PokemonCard pokemon={pokemon} />);
    expect(screen.getByText("#005")).toBeInTheDocument();
  });

  it("should link to pokemon detail page", () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pokemon/25");
  });

  it("should handle pokemon with no sprite", () => {
    const pokemonWithoutSprite = { ...mockPokemon, sprite: null };
    renderWithRouter(<PokemonCard pokemon={pokemonWithoutSprite} />);

    const image = screen.getByAltText("pikachu");
    expect(image).toBeInTheDocument();
    // Should have a placeholder or default image
  });

  it("should capitalize pokemon name", () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    // The component should display it as "Pikachu" in the UI
  });
});
