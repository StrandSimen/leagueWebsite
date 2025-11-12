import './PlayerSelector.css';

interface PlayerSelectorProps {
  selectedPlayers: number;
  onSelectPlayers: (count: number) => void;
}

export const PlayerSelector = ({ selectedPlayers, onSelectPlayers }: PlayerSelectorProps) => {
  const playerCounts = [1, 2, 3, 4, 5];

  return (
    <div className="player-selector">
      <h2>Select Number of Players</h2>
      <div className="player-buttons">
        {playerCounts.map((count) => (
          <button
            key={count}
            className={`player-button ${selectedPlayers === count ? 'active' : ''}`}
            onClick={() => onSelectPlayers(count)}
          >
            {count} Player{count > 1 ? 's' : ''}
          </button>
        ))}
      </div>
    </div>
  );
};
