import React, { useState } from 'react';
import michiganData from '../data/michigan.json';
import RaceView from './RaceView';
import '../styles/StateView.css';

function StateView({ stateAbbr, onBack }) {
  const [selectedRaceId, setSelectedRaceId] = useState(null);

  // For now, only Michigan has data
  const stateData = stateAbbr === 'MI' ? michiganData : null;

  if (!stateData) {
    return (
      <div className="state-view empty">
        <button className="back-button" onClick={onBack}>← Back to map</button>
        <div className="empty-state">
          <h2>No data yet</h2>
          <p>Senate race data for this state is coming soon.</p>
        </div>
      </div>
    );
  }

  if (selectedRaceId) {
    const race = stateData.races.find(r => r.id === selectedRaceId);
    return (
      <RaceView
        race={race}
        state={stateData}
        onBack={() => setSelectedRaceId(null)}
      />
    );
  }

  return (
    <div className="state-view">
      <button className="back-button" onClick={onBack}>← Back to map</button>

      <div className="state-header">
        <h2>{stateData.state}</h2>
        <p>Senate races</p>
      </div>

      <div className="races-grid">
        {stateData.races.map(race => (
          <button
            key={race.id}
            className="race-card"
            onClick={() => setSelectedRaceId(race.id)}
          >
            <div className="race-type">{race.type}</div>
            <div className="race-title">{race.title}</div>
            <div className="race-year">{race.year}</div>
            <div className="candidate-previews">
              {race.candidates.map(c => (
                <span key={c.id} className={`preview ${c.party.toLowerCase()}`}>
                  {c.name.split(' ').pop()}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StateView;
