import { useParams, Link } from 'react-router-dom';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pokemonId = parseInt(id || '0', 10);

  const { data: pokemon, isLoading, isError, error, refetch } = usePokemonDetail(pokemonId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">
            {error?.message || 'Failed to load Pokémon'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
            <Link
              to="/"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatId = (id: number): string => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const capitalizeName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatHeight = (height: number): string => {
    // Height is in decimeters, convert to meters
    return `${(height / 10).toFixed(1)} m`;
  };

  const formatWeight = (weight: number): string => {
    // Weight is in hectograms, convert to kilograms
    return `${(weight / 10).toFixed(1)} kg`;
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-700',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-400';
  };

  const sprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default ||
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold"
        >
          ← Back to Pokédex
        </Link>

        {/* Pokemon Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-50 rounded-lg p-8 w-full">
                <img
                  src={sprite}
                  alt={capitalizeName(pokemon.name)}
                  className="w-full h-auto max-w-md mx-auto object-contain"
                />
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex flex-col justify-center">
              <p className="text-gray-500 font-semibold text-lg mb-2">
                {formatId(pokemon.id)}
              </p>
              <h1 className="text-4xl font-bold text-gray-800 mb-6 capitalize">
                {capitalizeName(pokemon.name)}
              </h1>

              {/* Types */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                  Type
                </h2>
                <div className="flex gap-2">
                  {pokemon.types.map((typeInfo) => (
                    <span
                      key={typeInfo.type.name}
                      className={`${getTypeColor(
                        typeInfo.type.name
                      )} text-white px-4 py-1 rounded-full text-sm font-semibold capitalize`}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-1">
                    Height
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatHeight(pokemon.height)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-1">
                    Weight
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatWeight(pokemon.weight)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
