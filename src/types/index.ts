export type Lane = 'top' | 'jungle' | 'mid' | 'adc' | 'support';

export interface Champion {
  id: string;
  name: string;
  roles: Lane[];
  image: string;
}

export interface SummonerSpell {
  id: string;
  name: string;
  key: string;
  image: string;
}

export interface Item {
  id: string;
  name: string;
  itemId: string;
  image: string;
}

export interface PlayerAssignment {
  lane: Lane;
  champion: Champion;
  summonerSpells: [SummonerSpell, SummonerSpell];
  items: Item[];
  junglePet?: Item; // Optional jungle pet for jungle role
}

export interface GamePlan {
  players: PlayerAssignment[];
  timestamp: number;
}
