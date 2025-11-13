import { Lane } from '../types';
import { laneNames } from '../data/gameData';
import { getLaneIcon } from '../utils/imageUrls';
import './LaneSelector.css';

interface LaneSelectorProps {
  playerCount: number;
  selectedLanes: Lane[];
  onLanesChange: (lanes: Lane[]) => void;
  mode: 'choose' | 'random';
  onModeChange: (mode: 'choose' | 'random') => void;
  onGenerate: () => void;
}

export const LaneSelector = ({ 
  playerCount, 
  selectedLanes, 
  onLanesChange,
  mode,
  onModeChange,
  onGenerate
}: LaneSelectorProps) => {
  const allLanes: Lane[] = ['top', 'jungle', 'mid', 'adc', 'support'];

  const toggleLane = (lane: Lane) => {
    if (selectedLanes.includes(lane)) {
      onLanesChange(selectedLanes.filter(l => l !== lane));
    } else {
      if (selectedLanes.length < playerCount) {
        onLanesChange([...selectedLanes, lane]);
      }
    }
  };

  if (playerCount === 5) {
    return null; // Vis ikke lane selector for 5 spillere (alle lanes)
  }

  return (
    <div className="lane-selector">
      <div className="lane-mode-buttons">
        <button 
          className={`mode-button ${mode === 'choose' ? 'active' : ''}`}
          onClick={() => onModeChange('choose')}
        >
          Choose Lanes
        </button>
        <button 
          className={`mode-button ${mode === 'random' ? 'active' : ''}`}
          onClick={() => onModeChange('random')}
        >
          Random Lanes
        </button>
      </div>

      {mode === 'choose' && (
        <>
          <p className="lane-selector-hint">
            Select {playerCount} lane{playerCount > 1 ? 's' : ''} ({selectedLanes.length}/{playerCount} selected)
          </p>
          <div className="lane-options">
            {allLanes.map((lane) => (
              <button
                key={lane}
                className={`lane-option ${selectedLanes.includes(lane) ? 'selected' : ''} ${
                  !selectedLanes.includes(lane) && selectedLanes.length >= playerCount ? 'disabled' : ''
                }`}
                onClick={() => toggleLane(lane)}
                disabled={!selectedLanes.includes(lane) && selectedLanes.length >= playerCount}
                title={laneNames[lane]}
              >
                <img 
                  src={getLaneIcon(lane)} 
                  alt={laneNames[lane]}
                  className="lane-option-icon"
                />
              </button>
            ))}
          </div>
          <div className="generate-section">
            <button 
              className="generate-button-inline"
              onClick={onGenerate}
              disabled={selectedLanes.length !== playerCount}
            >
              Generate with selected lanes
            </button>
          </div>
        </>
      )}

      {mode === 'random' && (
        <div className="generate-section">
          <button 
            className="generate-button-inline"
            onClick={onGenerate}
          >
            Generate with random lanes
          </button>
        </div>
      )}
    </div>
  );
};
