import { PlayerAssignment, Lane } from '../types';
import { laneNames } from '../data/gameData';
import { useState } from 'react';
import { PLACEHOLDER_CHAMPION, PLACEHOLDER_SPELL, PLACEHOLDER_ITEM, getLaneIcon } from '../utils/imageUrls';
import './PlayerCard.css';

interface PlayerCardProps {
  assignment: PlayerAssignment;
  onReroll: (lane: Lane) => void;
}

export const PlayerCard = ({ assignment, onReroll }: PlayerCardProps) => {
  const [championImgError, setChampionImgError] = useState(false);
  const [spellImgErrors, setSpellImgErrors] = useState<Set<string>>(new Set());
  const [itemImgErrors, setItemImgErrors] = useState<Set<string>>(new Set());
  const [junglePetImgError, setJunglePetImgError] = useState(false);

  const handleChampionError = () => setChampionImgError(true);
  
  const handleSpellError = (spellId: string) => {
    setSpellImgErrors(prev => new Set(prev).add(spellId));
  };
  
  const handleItemError = (itemId: string) => {
    setItemImgErrors(prev => new Set(prev).add(itemId));
  };

  const handleJunglePetError = () => setJunglePetImgError(true);

  return (
    <div className="player-card">
      <div className="player-header">
        <span className="lane-badge">
          <img 
            src={getLaneIcon(assignment.lane)} 
            alt={laneNames[assignment.lane]}
            className="lane-icon"
            title={laneNames[assignment.lane]}
          />
        </span>
      </div>
      
      <div className="champion-section">
        <img 
          src={championImgError ? PLACEHOLDER_CHAMPION : assignment.champion.image} 
          alt={assignment.champion.name}
          className="champion-image"
          onError={handleChampionError}
        />
        <h2>{assignment.champion.name}</h2>
      </div>
      
      <div className="spells-and-pet-container">
        <div className="spells-section">
          <h4>Summoner Spells</h4>
          <div className="spells">
            {assignment.summonerSpells.map((spell) => (
              <div key={spell.id} className="spell" title={spell.name}>
                <img 
                  src={spellImgErrors.has(spell.id) ? PLACEHOLDER_SPELL : spell.image} 
                  alt={spell.name}
                  className="spell-image"
                  onError={() => handleSpellError(spell.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {assignment.junglePet && (
          <div className="jungle-pet-section">
            <h4>Jungle Pet</h4>
            <div className="jungle-pet">
              <div className="pet" title={assignment.junglePet.name}>
                <img 
                  src={junglePetImgError ? PLACEHOLDER_ITEM : assignment.junglePet.image} 
                  alt={assignment.junglePet.name}
                  className="pet-image"
                  onError={handleJunglePetError}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="items-section">
        <h4>Items</h4>
        <div className="items">
          {assignment.items.map((item) => (
            <div key={item.id} className="item" title={item.name}>
              <img 
                src={itemImgErrors.has(item.id) ? PLACEHOLDER_ITEM : item.image} 
                alt={item.name}
                className="item-image"
                onError={() => handleItemError(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <button className="reroll-button" onClick={() => onReroll(assignment.lane)}>
        Reroll
      </button>
    </div>
  );
};
