export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

export const capitalizeName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const extractPokemonId = (url: string): number => {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1]);
};

export const getPokemonSpriteUrl = (id: number): string => {
  // Using official Pokemon.com CDN to avoid GitHub rate limiting
  // Pad the ID to 3 digits as required by pokemon.com
  const paddedId = id.toString().padStart(3, "0");
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedId}.png`;
};

export const getDefaultSpriteUrl = (): string => {
  return "https://assets.pokemon.com/assets/cms2/img/pokedex/full/000.png";
};
