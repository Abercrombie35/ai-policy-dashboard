import React from 'react';
import CandidateComparison from './CandidateComparison';
import ItemCard, { HiddenDraftsNotice } from './ItemCard';
import ElectionResult from './ElectionResult';
import ProposalsPanel from './ProposalsPanel';
import { RaceDeviation, RaceStances } from './Analysis';
import { CheckNote } from './PolicyBox';
import { filterDrafts, placeOf, blocs, BLOC_IDS } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/RaceView.css';

const SEAT_LABELS = { open: 'Open seat', incumbent: 'Incumbent running', 'to-verify': 'Seat status to verify' };

const longDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// Sourced background on a race abroad (dates, who can run), numbered like
// the sources under policy boxes.
function ContextNotes({ race }) {
  const notes = race.contextNotes || [];
  if (notes.length === 0) return null;
  return (
    <section className="race-context-notes">
      <ul>
        {notes.map((n, i) => (
          <li key={n.source.url}>
            {n.text}{' '}
            <sup className="policy-ref"><a href={`#ctx-${race.id}-${i + 1}`} onClick={(e) => { e.preventDefault(); document.getElementById(`ctx-${race.id}-${i + 1}`)?.scrollIntoView({ block: 'center' }); }}>[{i + 1}]</a></sup>
            <CheckNote id={`${race.id}#context${i}`} className="check-inline" />
          </li>
        ))}
      </ul>
      <ol className="source-list">
        {notes.map((n, i) => (
          <li key={n.source.url} id={`ctx-${race.id}-${i + 1}`}>
            <span className="src-n">[{i + 1}]</span>{' '}
            <a href={n.source.url} target="_blank" rel="noopener noreferrer">{n.source.title}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Colour key for policy boxes abroad.
function BlocLegend() {
  return (
    <p className="bloc-legend">
      {BLOC_IDS.map((b) => (
        <span key={b}><span className={`bloc-swatch ${b}`} aria-hidden="true" />{blocs[b].label}</span>
      ))}
    </p>
  );
}

function RaceView({ race, onBack }) {
  const { includeDrafts } = useDrafts();
  const allSignals = race.contextSignals || [];
  const signals = filterDrafts(allSignals, includeDrafts);
  const abroad = Boolean(race.country);
  const place = placeOf(race);

  return (
    <div className="race-view">
      <button type="button" className="back-button" onClick={onBack}>← Back to {place}</button>

      <div className="race-header">
        <h1>{race.office}: {place}</h1>
        <p className="race-meta">
          {abroad ? (
            <span>
              {race.cycle} presidential election · first round {longDate(race.electionDate)}
              {race.runoffDate && <>, runoff {longDate(race.runoffDate)}</>}
            </span>
          ) : (
            <span>{race.cycle} general election · {race.electionDate}</span>
          )}
          <span title={race.seat?.note}>{SEAT_LABELS[race.seat?.type] || race.seat?.type}{abroad && race.seat?.note ? `: ${race.seat.note}` : ''}</span>
        </p>
        {race.nomineesSource && <p className="race-source">Candidates listed: {race.nomineesSource}</p>}
        {abroad && <ContextNotes race={race} />}
        {abroad && <BlocLegend />}
      </div>

      {/* Pre-election tracking comes first; the election result follows it. */}
      <h2 className="section-title">Pre-election tracking</h2>
      <CandidateComparison race={race} />
      {abroad ? <RaceStances race={race} /> : <RaceDeviation race={race} />}

      {(!abroad || allSignals.length > 0) && (
      <section className="context-signals">
        <h3>Context signals</h3>
        <p className="section-note">
          Polling and prediction-market figures are forecasts, not facts, and are shown only as secondary context.
          Live market data would come through a backend proxy, which is not built yet.
        </p>
        <HiddenDraftsNotice count={allSignals.length - signals.length} />
        {signals.length > 0 ? (
          <div className="signals-grid">
            {signals.map((s) => (
              <div key={s.id}>
                <div className="signal-candidate">{(race.candidates || []).find((c) => c.id === s.candidateId)?.name}</div>
                <ItemCard item={s} />
              </div>
            ))}
          </div>
        ) : (
          allSignals.length === 0 && <p className="empty-note">No context signals recorded.</p>
        )}
      </section>
      )}

      <ElectionResult race={race} />

      {abroad ? (
        <ProposalsPanel country={race.country} title={`Proposed laws and plans: ${place} and the EU`} />
      ) : (
        <ProposalsPanel state={race.state} title={`Proposed bills and moratoriums: federal and ${place}`} />
      )}
    </div>
  );
}

export default RaceView;
