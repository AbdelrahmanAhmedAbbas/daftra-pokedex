import { Link } from 'react-router-dom';
import { PokemonCardData } from '../../types/pokemon.types';

interface PokemonCardProps {
  pokemon: PokemonCardData;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { id, name, sprite } = pokemon;

  const formatId = (id: number): string => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const capitalizeName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const defaultSprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

  return (
    <Link
      to={`/pokemon/${id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 border border-gray-200"
    >
      <div className="flex flex-col items-center">
        <div className="w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg mb-3">
          <img
            src={sprite || defaultSprite}
            alt={name}
            className="w-32 h-32 object-contain"
            loading="lazy"
          />
        </div>
        <div className="text-center w-full">
          <p className="text-sm text-gray-500 font-semibold mb-1">{formatId(id)}</p>
          <h3 className="text-lg font-bold text-gray-800 capitalize">{capitalizeName(name)}</h3>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
