// Riot Games Data Dragon CDN URLs
// Versjon kan oppdateres - sjekk https://ddragon.leagueoflegends.com/api/versions.json
const DDRAGON_VERSION = '15.22.1';
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;

export const getChampionImage = (championId: string): string => {
  return `${DDRAGON_BASE}/img/champion/${championId}.png`;
};

export const getSummonerSpellImage = (spellKey: string): string => {
  return `${DDRAGON_BASE}/img/spell/${spellKey}.png`;
};

export const getItemImage = (itemId: string): string => {
  return `${DDRAGON_BASE}/img/item/${itemId}.png`;
};

// Lane ikoner - Community Dragon eller custom
export const getLaneIcon = (lane: string): string => {
  // Bruker raw.communitydragon.org for lane ikoner
  const laneMap: Record<string, string> = {
    'top': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/svg/position-top.svg',
    'jungle': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/svg/position-jungle.svg',
    'mid': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/svg/position-middle.svg',
    'adc': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/svg/position-bottom.svg',
    'support': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/svg/position-utility.svg',
  };
  return laneMap[lane] || '';
};

// Backup/placeholder images
export const PLACEHOLDER_CHAMPION = 'https://via.placeholder.com/120x120/1e3a5f/ffd700?text=Champion';
export const PLACEHOLDER_ITEM = 'https://via.placeholder.com/64x64/1e3a5f/ffd700?text=Item';
export const PLACEHOLDER_SPELL = 'https://via.placeholder.com/64x64/1e3a5f/ffd700?text=Spell';
