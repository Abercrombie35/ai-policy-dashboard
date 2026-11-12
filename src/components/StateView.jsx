import React from 'react';
import RaceView from './RaceView';
import BillCard from './BillCard';
import { HiddenDraftsNotice } from './ItemCard';
import { ResultSummary } from './ElectionResult';
import { racesForState, billsForState, raceById, stateName, filterDrafts, isVerified } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import { navigate } from '../lib/router';
import '../styles/StateView.css';

function RaceCard({ race }) {
  const records = [...race.items, ...race.contextSignals];
  const verified = records.filter(isVerified).length;
  return (
    <button type="button" className="race-card" onClick={() => navigate(`/state/${race.state}/${race.id}`)}>
      <div className="race-type">{race.office}</div>
      <div className="race-title">{race.cycle} election · {race.electionDate}</div>
      <div className="candidate-previews">
        {race.candidates.map((c) => (
          <span key={c.id} className={`preview ${c.party.toLowerCase()}`}>{c.name}</span>
        ))}
      </div>
      <div className="race-counts">
        {verified} verified record{verified === 1 ? '' : 's'} · {records.length - verified} unverified draft{records.length - verified === 1 ? '' : 's'}
      </div>
      <ResultSummary raceId={race.id} />
    </button>
  );
}

function StateView({ stateAbbr, raceId, onClose }) {
  const { includeDrafts } = useDrafts();
  const name = stateName(stateAbbr);

  if (raceId) {
    const race = raceById(raceId);
    if (race && race.state === stateAbbr) {
      return <RaceView race={race} onBack={() => navigate(`/state/${stateAbbr}`)} />;
    }
  }

  const stateRaces = racesForState(stateAbbr);
  const allBills = billsForState(stateAbbr);
  const shownBills = filterDrafts(allBills, includeDrafts);

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
        <h3>State AI legislation</h3>
        <HiddenDraftsNotice count={allBills.length - shownBills.length} />
        {shownBills.length ? (
          <div className="bill-list">
            {shownBills.map((bill) => <BillCard key={bill.id} bill={bill} />)}
          </div>
        ) : (
          allBills.length === 0 && <p className="empty-note">No {name} AI bills have been coded yet.</p>
        )}
      </section>
    </div>
  );
}

export default StateView;
