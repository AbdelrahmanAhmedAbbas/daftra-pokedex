import { Link } from "react-router-dom";
import { PokemonCardData } from "../../types/pokemon.types";

interface PokemonCardProps {
  pokemon: PokemonCardData;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { id, name, sprite } = pokemon;

  const formatId = (id: number): string => {
    return `#${id.toString().padStart(3, "0")}`;
  };

  const capitalizeName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const defaultSprite =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

  return (
    <Link
      to={`/pokemon/${id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 border border-gray-200 group"
    >
      <div className="flex flex-col items-center">
        <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-3 group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300">
          <img
            src={sprite || defaultSprite}
            alt={name}
            className="w-48 h-48 object-contain transform group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="text-center w-full">
          <h3 className="text-lg font-bold text-gray-800 capitalize group-hover:text-blue-600 transition-colors duration-300 mb-1">
            {capitalizeName(name)}
          </h3>
          <p className="text-sm text-gray-500 font-semibold">
            {formatId(id)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
