import PokemonCard from "../PokemonCard";
import { PokemonCardData } from "../../types/pokemon.types";

interface PokemonGridProps {
  pokemonList: PokemonCardData[];
}

const PokemonGrid: React.FC<PokemonGridProps> = ({ pokemonList }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonGrid;
