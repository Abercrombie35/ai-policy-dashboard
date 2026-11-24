import React from 'react';
import ProposalsPanel from './ProposalsPanel';
import CategoryBreakdown from './CategoryBreakdown';
import { ResultSummary } from './ElectionResult';
import { racesForState, stateName, isVerified, itemsForRace } from '../lib/data';
import { navigate } from '../lib/router';
import '../styles/StateView.css';

export function RaceCard({ race }) {
  const records = [...itemsForRace(race), ...(race.contextSignals || [])];
  const verified = records.filter(isVerified).length;
  return (
    <button type="button" className="race-card" onClick={() => navigate(race.country ? `/country/${race.country}/${race.id}` : `/state/${race.state}/${race.id}`)}>
      <div className="race-type">{race.office}</div>
      <div className="race-title">{race.cycle} election · {race.electionDate}</div>
      <div className="candidate-previews">
        {(race.candidates || []).map((c) => (
          <span key={c.id} className={`preview ${(c.party || '').toLowerCase()}`}>{c.name}</span>
        ))}
      </div>
      <div className="race-counts">
        {verified} sourced record{verified === 1 ? '' : 's'} · {records.length - verified} unverified draft{records.length - verified === 1 ? '' : 's'}
      </div>
      <ResultSummary raceId={race.id} />
    </button>
  );
}

function StateView({ stateAbbr, onClose }) {
  const name = stateName(stateAbbr);

  const stateRaces = racesForState(stateAbbr);

  return (
    <div className="state-view">
      <button type="button" className="back-button" onClick={onClose}>← Back to map</button>
      <div className="state-header">
        <h2>{name}</h2>
      </div>

      <section className="state-section">
        <h3>Tracked races</h3>
        {stateRaces.length ? (
          <div className="races-grid">
            {stateRaces.map((race) => <RaceCard key={race.id} race={race} />)}
          </div>
        ) : (
          <p className="empty-note">No race in {name} is tracked yet.</p>
        )}
      </section>

      <section className="state-section">
        <h3>{name} by category: said and proposed</h3>
        <h4 className="domain-heading data-centers">Data centers</h4>
        <CategoryBreakdown domainId="data-centers" state={stateAbbr} />
        <h4 className="domain-heading ai-general">Everything else in AI</h4>
        <CategoryBreakdown domainId="ai-general" state={stateAbbr} />
      </section>

      <ProposalsPanel state={stateAbbr} title={`Proposed bills and moratoriums: federal and ${name}`} />
    </div>
  );
}

export default StateView;
