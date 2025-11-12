import { Champion, Lane, SummonerSpell, Item, PlayerAssignment } from '../types';
import { champions, summonerSpells, items, supportItems, supportStarterItems, junglePets, boots, lanes } from '../data/gameData';

// Item restriction groups - only one item from each group can be selected
const ITEM_RESTRICTION_GROUPS = [
  // Armor Penetration items (Last Whisper items)
  ['6694', '3033', '3036', '3071', '223302'], // Serylda's Grudge, Mortal Reminder, Lord Dominik's Regards, Black Cleaver, Terminus
  
  // Hydra items
  ['6698', '6631', '3074', '3748'], // Profane Hydra, Stridebreaker, Ravenous Hydra, Titanic Hydra
  
  // Spell shield items
  ['3102', '3814'], // Banshee's Veil, Edge of Night
  
  // Magic penetration items (Void items)
  ['8010', '223137', '3135', '223302'], // Bloodletter's Curse, Cryptbloom, Void Staff, Terminus
  
  // Sheen items
  ['3100', '3078'], // Lich Bane, Trinity Force
  
  // Movement speed tank items
  ['3002', '3742'], // Trailblazer, Dead Man's Plate
  
  // Lifeline items (shields on low health)
  ['3053', '3156', '226673', '3003'], // Sterak's Gage, Maw of Malmortius, Immortal Shieldbow, Archangel's Staff
];

// Items that can only be used by ranged champions
const RANGED_ONLY_ITEMS = ['3085']; // Runaan's Hurricane

// Helper to check if champion is ranged (ADC role or specific ranged champions)
const isRangedChampion = (champion: Champion): boolean => {
  // ADCs are ranged
  if (champion.roles.includes('adc')) return true;
  
  // Known ranged champions in other roles
  const rangedChampions = [
    'teemo', 'kennen', 'quinn', 'vayne-top', 'jayce', 'gnar', // Top
    'graves', 'kindred', // Jungle
    'azir', 'corki', 'velkoz', 'xerath', 'ziggs', 'twisted-fate', // Mid
  ];
  
  return rangedChampions.includes(champion.id);
};

/**
 * Får en tilfeldig champion for en spesifikk lane
 */
export const getRandomChampion = (lane: Lane, usedChampions: string[]): Champion => {
  const availableChampions = champions.filter(
    (champ) => champ.roles.includes(lane) && !usedChampions.includes(champ.id)
  );
  
  if (availableChampions.length === 0) {
    throw new Error(`Ingen tilgjengelige champions for ${lane}`);
  }
  
  return availableChampions[Math.floor(Math.random() * availableChampions.length)];
};

/**
 * Får to tilfeldige summoner spells
 */
export const getRandomSummonerSpells = (lane: Lane): [SummonerSpell, SummonerSpell] => {
  let availableSpells = [...summonerSpells];
  
  // Jungle MÅ ha Smite
  if (lane === 'jungle') {
    const smite = summonerSpells.find(spell => spell.id === 'smite')!;
    availableSpells = availableSpells.filter(spell => spell.id !== 'smite');
    const secondSpell = availableSpells[Math.floor(Math.random() * availableSpells.length)];
    return [smite, secondSpell];
  }
  
  // Andre lanes får to tilfeldige spells (men alle får vanligvis Flash)
  const flash = summonerSpells.find(spell => spell.id === 'flash')!;
  availableSpells = availableSpells.filter(spell => spell.id !== 'flash' && spell.id !== 'smite');
  const secondSpell = availableSpells[Math.floor(Math.random() * availableSpells.length)];
  
  return [flash, secondSpell];
};

/**
 * Får tilfeldige items (5 items + 1 boots)
 * Support role får både support items og regular items
 * Support role MÅ ha en support starter item
 * Respekterer item restrictions (ingen konflikter)
 */
export const getRandomItems = (lane: Lane, count: number = 5, champion?: Champion): Item[] => {
  // Velg 1 random boots
  const randomBoots = boots[Math.floor(Math.random() * boots.length)];
  
  let availableItems: Item[];
  let selectedItems: Item[] = [];
  
  if (lane === 'support') {
    // Support MÅ ha 1 support starter item
    const starterItem = supportStarterItems[Math.floor(Math.random() * supportStarterItems.length)];
    selectedItems.push(starterItem);
    
    // Kombiner support items og regular items for de resterende
    availableItems = [...items, ...supportItems];
  } else {
    // Andre roller får bare regular items
    availableItems = [...items];
  }
  
  // Filter out ranged-only items if champion is melee
  if (champion && !isRangedChampion(champion)) {
    availableItems = availableItems.filter(item => !RANGED_ONLY_ITEMS.includes(item.itemId));
  }
  
  // Velg items én om gangen med restriction-sjekk
  const usedItemIds = new Set<string>(selectedItems.map(item => item.itemId));
  const usedRestrictionGroups = new Set<number>();
  
  while (selectedItems.length < count && availableItems.length > 0) {
    // Shuffle available items
    const shuffled = [...availableItems].sort(() => Math.random() - 0.5);
    
    let itemAdded = false;
    for (const item of shuffled) {
      // Skip if already selected
      if (usedItemIds.has(item.itemId)) continue;
      
      // Check if item is in any restriction group
      let conflictFound = false;
      for (let groupIndex = 0; groupIndex < ITEM_RESTRICTION_GROUPS.length; groupIndex++) {
        const group = ITEM_RESTRICTION_GROUPS[groupIndex];
        
        if (group.includes(item.itemId)) {
          // If we already have an item from this group, skip this item
          if (usedRestrictionGroups.has(groupIndex)) {
            conflictFound = true;
            break;
          }
          // Mark this group as used
          usedRestrictionGroups.add(groupIndex);
        }
      }
      
      if (!conflictFound) {
        selectedItems.push(item);
        usedItemIds.add(item.itemId);
        itemAdded = true;
        break;
      }
    }
    
    // If no valid item found, break to avoid infinite loop
    if (!itemAdded) break;
  }
  
  // Returner boots først, deretter de andre items
  return [randomBoots, ...selectedItems];
};

/**
 * Get a random jungle pet for jungle role
 */
export const getRandomJunglePet = (): Item => {
  return junglePets[Math.floor(Math.random() * junglePets.length)];
};

/**
 * Genererer en komplett gameplan for et gitt antall spillere
 */
export const generateGamePlan = (playerCount: number, selectedLanes?: Lane[]): PlayerAssignment[] => {
  if (playerCount < 1 || playerCount > 5) {
    throw new Error('Antall spillere må være mellom 1 og 5');
  }
  
  // Bruk valgte lanes hvis de er gitt, ellers bruk de første N lanes
  let lanesToUse: Lane[];
  
  if (selectedLanes && selectedLanes.length === playerCount) {
    lanesToUse = selectedLanes;
  } else if (playerCount === 5) {
    lanesToUse = [...lanes];
  } else {
    // Random lanes
    const shuffled = [...lanes].sort(() => Math.random() - 0.5);
    lanesToUse = shuffled.slice(0, playerCount);
  }
  
  const usedChampions: string[] = [];
  const assignments: PlayerAssignment[] = [];
  
  for (const lane of lanesToUse) {
    const champion = getRandomChampion(lane, usedChampions);
    usedChampions.push(champion.id);
    
    const assignment: PlayerAssignment = {
      lane,
      champion,
      summonerSpells: getRandomSummonerSpells(lane),
      items: getRandomItems(lane, 5, champion), // Pass champion for restriction checks
      ...(lane === 'jungle' && { junglePet: getRandomJunglePet() }), // Add jungle pet if jungle role
    };
    
    assignments.push(assignment);
  }
  
  return assignments;
};

/**
 * Reroller en enkelt spiller assignment
 */
export const rerollPlayer = (lane: Lane, usedChampions: string[]): PlayerAssignment => {
  const champion = getRandomChampion(lane, usedChampions);
  
  return {
    lane,
    champion,
    summonerSpells: getRandomSummonerSpells(lane),
    items: getRandomItems(lane, 5, champion), // Pass champion for restriction checks
    ...(lane === 'jungle' && { junglePet: getRandomJunglePet() }), // Add jungle pet if jungle role
  };
};
