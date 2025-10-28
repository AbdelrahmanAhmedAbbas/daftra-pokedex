import { useParams, Link } from 'react-router-dom';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { LuWeight } from "react-icons/lu";
import { CiRuler } from "react-icons/ci";
import { getPokemonSpriteUrl, getDefaultSpriteUrl } from '../../utils/pokemonFormatters';

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pokemonId = parseInt(id || '0', 10);

  const { data: pokemon } = usePokemonDetail(pokemonId);

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
      fire: 'bg-gradient-to-r from-orange-500 to-red-500',
      water: 'bg-gradient-to-r from-blue-400 to-blue-600',
      electric: 'bg-gradient-to-r from-yellow-300 to-yellow-500',
      grass: 'bg-gradient-to-r from-green-400 to-green-600',
      ice: 'bg-gradient-to-r from-cyan-300 to-blue-400',
      fighting: 'bg-gradient-to-r from-red-600 to-red-800',
      poison: 'bg-gradient-to-r from-purple-400 to-purple-600',
      ground: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
      flying: 'bg-gradient-to-r from-indigo-300 to-indigo-500',
      psychic: 'bg-gradient-to-r from-pink-400 to-pink-600',
      bug: 'bg-gradient-to-r from-green-400 to-green-500',
      rock: 'bg-gradient-to-r from-yellow-700 to-yellow-900',
      ghost: 'bg-gradient-to-r from-purple-600 to-purple-800',
      dragon: 'bg-gradient-to-r from-indigo-600 to-purple-700',
      dark: 'bg-gradient-to-r from-gray-700 to-gray-900',
      steel: 'bg-gradient-to-r from-gray-400 to-gray-600',
      fairy: 'bg-gradient-to-r from-pink-300 to-pink-500',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getStatName = (stat: string): string => {
    const names: { [key: string]: string } = {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      speed: 'Speed',
    };
    return names[stat] || stat;
  };

  // Use pokemon.com CDN instead of GitHub raw URLs to avoid rate limiting
  const sprite = getPokemonSpriteUrl(pokemon.id) || getDefaultSpriteUrl();

  // Get primary type for header gradient
  const primaryType = pokemon.types[0]?.type.name || 'normal';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-6 font-semibold bg-white px-4 py-2 rounded-lg"
        >
          ← Back to List
        </Link>

        {/* Pokemon Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className={`${getTypeColor(primaryType)} text-white text-center py-4`}>
            <h1 className="text-2xl font-bold capitalize">
              {capitalizeName(pokemon.name)}
            </h1>
            <p className="text-sm opacity-90">{formatId(pokemon.id)}</p>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Image, Type Badge, Height & Weight */}
              <div>
                {/* Image Section with Gray Circle Background */}
                <div className="flex justify-center mb-4">
                  <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center">
                    <img
                      src={sprite}
                      alt={capitalizeName(pokemon.name)}
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                </div>

                {/* Type Badge */}
                {primaryType === 'fire' && (
                  <div className="flex justify-center mb-6">
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      Fire
                    </span>
                  </div>
                )}

                {/* Height and Weight in Boxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CiRuler className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-600 font-semibold">Height</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {formatHeight(pokemon.height)}
                    </p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <LuWeight className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-600 font-semibold">Weight</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {formatWeight(pokemon.weight)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats, Abilities, Experience */}
              <div>
                {/* Base Stats Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Base Stats</h2>
                  <div className="space-y-3">
                    {pokemon.stats.map((statInfo) => (
                      <div key={statInfo.stat.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-gray-600">
                            {getStatName(statInfo.stat.name)}
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                            {statInfo.base_stat}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((statInfo.base_stat / 200) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abilities Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">Abilities</h2>
                  <div className="space-y-2">
                    {pokemon.abilities.map((abilityInfo) => (
                      <div key={abilityInfo.ability.name} className="flex items-center gap-2">
                        <span className="text-sm text-gray-800 font-semibold capitalize">
                          {abilityInfo.ability.name.replace('-', ' ')}
                        </span>
                        {abilityInfo.is_hidden && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                            Hidden
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Base Experience */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Base Experience</h2>
                  <p className="text-2xl font-bold text-purple-600">{pokemon.base_experience} XP</p>
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
