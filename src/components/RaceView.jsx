import React from 'react';
import CandidateComparison from './CandidateComparison';
import ItemCard, { HiddenDraftsNotice } from './ItemCard';
import ElectionResult, { ResultSummary } from './ElectionResult';
import { stateName, filterDrafts } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/RaceView.css';

const SEAT_LABELS = { open: 'Open seat', incumbent: 'Incumbent running', 'to-verify': 'Seat status to verify' };

function RaceView({ race, onBack }) {
  const { includeDrafts } = useDrafts();
  const signals = filterDrafts(race.contextSignals, includeDrafts);

  return (
    <div className="race-view">
      <button type="button" className="back-button" onClick={onBack}>← Back to {stateName(race.state)}</button>

      <div className="race-header">
        <h1>{race.office}: {stateName(race.state)}</h1>
        <p className="race-meta">
          <span>{race.cycle} general election · {race.electionDate}</span>
          <span title={race.seat?.note}>{SEAT_LABELS[race.seat?.type] || race.seat?.type}</span>
          <ResultSummary raceId={race.id} />
        </p>
        {race.nomineesSource && <p className="race-source">Candidates listed: {race.nomineesSource}</p>}
      </div>

      <ElectionResult race={race} />

      <h2 className="section-title">AI policy records</h2>
      <CandidateComparison race={race} />

      <section className="context-signals">
        <h3>Context signals</h3>
        <p className="section-note">
          Polling and prediction-market figures are forecasts, not facts, and are shown only as secondary context.
          Live market data would come through a backend proxy, which is not built yet.
        </p>
        <HiddenDraftsNotice count={race.contextSignals.length - signals.length} />
        {signals.length > 0 ? (
          <div className="signals-grid">
            {signals.map((s) => (
              <div key={s.id}>
                <div className="signal-candidate">{race.candidates.find((c) => c.id === s.candidateId)?.name}</div>
                <ItemCard item={s} />
              </div>
            ))}
          </div>
        ) : (
          race.contextSignals.length === 0 && <p className="empty-note">No context signals recorded.</p>
        )}
      </section>
    </div>
  );
}

export default RaceView;
