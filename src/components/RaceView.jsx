import React, { useEffect, useState } from 'react';
import CandidateComparison from './CandidateComparison';
import KalshiMarket from './KalshiMarket';
import '../styles/RaceView.css';

function RaceView({ race, state, onBack }) {
  const [kalshiData, setKalshiData] = useState(null);
  const [kalshiLoading, setKalshiLoading] = useState(true);

  useEffect(() => {
    // Placeholder for Kalshi API call
    // We'll implement this once we have API keys
    setKalshiLoading(false);
  }, [race.id]);

  return (
    <div className="race-view">
      <button className="back-button" onClick={onBack}>← Back to {state.state}</button>

      <div className="race-header">
        <h1>{race.title}</h1>
        <p className="race-meta">{state.state} • {race.year}</p>
      </div>

      {/* Candidate Comparison Split-Screen */}
      <CandidateComparison candidates={race.candidates} race={race} />

      {/* Kalshi Market Integration */}
      {!kalshiLoading && (
        <KalshiMarket race={race} data={kalshiData} />
      )}
    </div>
  );
}

export default RaceView;
