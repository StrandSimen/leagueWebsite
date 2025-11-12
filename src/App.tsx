import { useState } from 'react';
import { PlayerCard } from './components/PlayerCard';
import { PlayerSelector } from './components/PlayerSelector';
import { LaneSelector } from './components/LaneSelector';
import { generateGamePlan, rerollPlayer } from './utils/randomizer';
import { PlayerAssignment, Lane } from './types';
import './App.css';

function App() {
  const [selectedPlayers, setSelectedPlayers] = useState<number>(5);
  const [gamePlan, setGamePlan] = useState<PlayerAssignment[]>([]);
  const [laneMode, setLaneMode] = useState<'choose' | 'random'>('random');
  const [selectedLanes, setSelectedLanes] = useState<Lane[]>([]);

  const handlePlayerCountChange = (count: number) => {
    setSelectedPlayers(count);
    setGamePlan([]);
    setSelectedLanes([]);
    setLaneMode('random'); // Reset til random når man bytter antall spillere
  };

  const handleGeneratePlan = () => {
    // Hvis 5 spillere eller random lanes er valgt, send ingen lanes (bruker random/alle)
    if (selectedPlayers === 5 || laneMode === 'random') {
      const plan = generateGamePlan(selectedPlayers);
      setGamePlan(plan);
    } else {
      // Bruk valgte lanes
      if (selectedLanes.length === selectedPlayers) {
        const plan = generateGamePlan(selectedPlayers, selectedLanes);
        setGamePlan(plan);
      } else {
        alert(`Please select ${selectedPlayers} lanes!`);
      }
    }
  };

  const handleRerollPlayer = (lane: Lane) => {
    // Finn alle brukte champions unntatt den som skal rerolles
    const usedChampions = gamePlan
      .filter(p => p.lane !== lane)
      .map(p => p.champion.id);
    
    // Generer ny assignment for denne lanen
    const newAssignment = rerollPlayer(lane, usedChampions);
    
    // Oppdater game plan med den nye assignmenten
    setGamePlan(prevPlan => 
      prevPlan.map(p => p.lane === lane ? newAssignment : p)
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>League of Legends Randomizer</h1>
        <p className="subtitle">Random champion, spells and items for each lane</p>
      </header>

      <main className="app-main">
        <PlayerSelector
          selectedPlayers={selectedPlayers}
          onSelectPlayers={handlePlayerCountChange}
        />

        {selectedPlayers < 5 ? (
          <LaneSelector
            playerCount={selectedPlayers}
            selectedLanes={selectedLanes}
            onLanesChange={setSelectedLanes}
            mode={laneMode}
            onModeChange={setLaneMode}
            onGenerate={handleGeneratePlan}
          />
        ) : (
          <div className="action-section">
            <button className="generate-button" onClick={handleGeneratePlan}>
              Generate Game Plan
            </button>
          </div>
        )}

        {gamePlan.length > 0 && (
          <div className="game-plan">
            <div className="players-grid">
              {gamePlan
                .sort((a, b) => {
                  const laneOrder: Lane[] = ['top', 'jungle', 'mid', 'adc', 'support'];
                  return laneOrder.indexOf(a.lane) - laneOrder.indexOf(b.lane);
                })
                .map((assignment) => (
                  <PlayerCard
                    key={assignment.lane}
                    assignment={assignment}
                    onReroll={handleRerollPlayer}
                  />
                ))}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>This project is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.</p>
      </footer>
    </div>
  );
}

export default App;
