import React, { useEffect, useRef } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { countryName, europeGeo, electionsForCountry, internationalNextSteps, internationalNote, racesForCountry } from '../lib/data';
import { RaceCard } from './StateView';
import { CheckNote } from './PolicyBox';
import { PlaceVoterPriorities } from './OpinionCharts';
import { checkOf } from '../lib/data';
import { takeLastRace } from '../lib/router';
import '../styles/StateModal.css';
import '../styles/StateView.css';

const UNIT = { candidate: 'Candidates', 'party-manifesto': 'Party manifestos' };

function CountryView({ code, onClose }) {
  const name = countryName(code);
  const country = europeGeo.countries[code];
  const elections = electionsForCountry(code);
  const isPilot = internationalNextSteps?.countryCode === code;
  const tracked = racesForCountry(code);
  return (
    <div className="state-view">
      <button type="button" className="back-button" onClick={onClose}>← Back to map</button>
      <div className="state-header">
        <h2>{name}</h2>
        <p className="race-source">{country?.eu ? 'EU member state: national AI policy sits within the EU AI Act.' : 'Not an EU member state.'}</p>
      </div>

      {tracked.length > 0 && (
        <section className="state-section">
          <h3>Tracked race</h3>
          <div className="races-grid">
            {tracked.map((race) => <RaceCard key={race.id} race={race} />)}
          </div>
        </section>
      )}

      <PlaceVoterPriorities country={code} />

      <section className="state-section">
        <h3>Elections listed</h3>
        {elections.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th scope="col">Election</th><th scope="col">Date</th><th scope="col">Compares</th><th scope="col">Plan</th></tr></thead>
              <tbody>
                {elections.map((e) => (
                  <tr key={e.id}>
                    <th scope="row">{e.type}</th>
                    <td>
                      {e.dateText}{e.dateText.includes(String(e.year)) ? '' : `, ${e.year}`}{' '}
                      {checkOf(`international#${e.id}`) ? <CheckNote id={`international#${e.id}`} className="check-inline" /> : <span className="badge confidence-unverified small">To verify</span>}
                    </td>
                    <td>{UNIT[e.unit]}</td>
                    <td>{e.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-note">No election in {name} is tracked yet.</p>
        )}
      </section>

      {isPilot && (
        <section className="state-section">
          <h3>{internationalNextSteps.title}</h3>
          <ol className="next-steps">
            {internationalNextSteps.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </section>
      )}
      <p className="fine-print">{internationalNote} <a href="#/international">All international elections</a>.</p>
    </div>
  );
}

function CountryModal({ code, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';
    // Coming back from a race pop-up, focus returns to that race's card.
    const lastRace = takeLastRace();
    const card = lastRace && ref.current?.querySelector(`[data-race-id="${lastRace}"]`);
    (card || ref.current)?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="state-modal-overlay" onClick={onClose}>
      <div className="state-modal-content" role="dialog" aria-modal="true" aria-label={countryName(code)} tabIndex={-1} ref={ref} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <ErrorBoundary resetKey={code}>
          <CountryView code={code} onClose={onClose} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default CountryModal;
