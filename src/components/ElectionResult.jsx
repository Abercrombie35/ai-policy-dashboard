import React from 'react';
import { RecordMeta } from './ItemCard';
import { CheckNote } from './PolicyBox';
import { resultForRace, hasHiddenResult, resultLabel, resultStatuses, confidenceLevels, certificationText } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/ElectionResult.css';

const partyClass = (party) => (['Democratic', 'Republican'].includes(party) ? party.toLowerCase() : 'other');

// Badges for the separate election-result label: the label itself, whether
// the figures are unofficial or certified, and the confidence level.
export function ResultBadges({ result }) {
  const status = resultStatuses[result.resultStatus];
  const confidence = confidenceLevels[result.confidence];
  return (
    <div className="label-badges">
      <span className="badge type-election-result" title={resultLabel.description}>{resultLabel.label}</span>
      <span className={`badge result-${result.resultStatus}`} title={status?.description}>{status?.label}</span>
      <span className={`badge confidence-${result.confidence}`} title={confidence?.description}>
        Confidence: {confidence?.label}
      </span>
    </div>
  );
}

// One-line summary used on race cards and in the race header.
export function ResultSummary({ raceId }) {
  const { includeDrafts } = useDrafts();
  const result = resultForRace(raceId, includeDrafts);
  if (!result) return <span className="result-summary pending">Result not yet recorded</span>;
  const status = resultStatuses[result.resultStatus]?.label.toLowerCase();
  return (
    <span className="result-summary">
      Winner ({status}): {result.winner?.name} ({result.winner?.party?.[0]})
    </span>
  );
}

const longDate = (iso) =>
  /^\d{4}-\d{2}-\d{2}$/.test(iso || '')
    ? new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : iso;

// Vote shares for one round (or the only round), highest first.
function ResultTable({ candidates, winnerName, statusLabel, label, advancing = [] }) {
  const sorted = [...(candidates || [])].sort((a, b) => (b.votePct ?? -1) - (a.votePct ?? -1));
  return (
    <div className="table-wrap" role="region" aria-label={label} tabIndex={0}>
      <table className="result-table">
        <thead>
          <tr>
            <th scope="col">Candidate</th>
            <th scope="col">Party</th>
            <th scope="col">Vote share ({statusLabel})</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.name} className={c.name === winnerName ? 'winner' : ''}>
              <th scope="row">
                {c.name}
                {c.name === winnerName && <span className="winner-mark"> · Winner</span>}
                {advancing.includes(c.name) && <span className="winner-mark"> · To the runoff</span>}
              </th>
              <td title={c.partyNote || undefined}>
                {c.party}
                {c.partyNote && <span className="party-note"> (to verify)</span>}
              </td>
              <td>
                {c.votePct == null ? (
                  <span className="missing">Not recorded</span>
                ) : (
                  <div className="meter">
                    <div className="meter-track">
                      <div className={`meter-fill ${partyClass(c.party)}`} style={{ width: `${c.votePct}%` }} />
                    </div>
                    <span className="meter-figure">{c.votePct}%</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ElectionResult({ race }) {
  const { includeDrafts } = useDrafts();
  const result = resultForRace(race.id, includeDrafts);

  if (!result) {
    return (
      <section className="election-result empty">
        <h3>Election result</h3>
        <p className="empty-note">
          {race.status === 'upcoming'
            ? `Not yet held. ${race.runoffDate ? 'First round' : 'Election day'}: ${race.electionDate}${race.runoffDate ? `; runoff: ${race.runoffDate}` : ''}.`
            : hasHiddenResult(race.id, includeDrafts)
              ? 'An unverified draft result is hidden until it is checked.'
              : 'Result not yet recorded.'}
        </p>
      </section>
    );
  }

  const sources = [result.source, ...(result.additionalSources || [])].filter((s) => s?.url);
  const statusLabel = resultStatuses[result.resultStatus]?.label.toLowerCase();
  // Two-round elections (France) keep a table for each round; the deciding
  // round is also the result's main candidate list.
  const rounds = result.rounds?.length ? result.rounds : null;
  const decidedInRunoff = rounds && rounds.length > 1;

  return (
    <section className="election-result" aria-labelledby={`result-${race.id}`}>
      <div className="result-head">
        <h3 id={`result-${race.id}`}>Election result</h3>
        <ResultBadges result={result} />
      </div>

      <p className="result-winner">
        <strong>{result.winner.name}</strong> ({result.winner.party}) won{decidedInRunoff ? ' the runoff' : rounds ? ' in the first round' : ''}.{' '}
        {result.call && <span className="result-call">{result.call}</span>}
        <CheckNote id={result.id} className="check-inline" />
      </p>

      {rounds ? (
        rounds.map((r) => (
          <div key={r.round} className="result-round">
            <h4>{r.round === 1 ? 'First round' : 'Runoff'} · {longDate(r.date)}</h4>
            {r.note && <p className="result-context">{r.note}</p>}
            <ResultTable candidates={r.candidates} winnerName={r.round === rounds[rounds.length - 1].round ? result.winner.name : null} statusLabel={statusLabel} label={`${r.round === 1 ? 'First round' : 'Runoff'} vote shares`} advancing={r.advancing} />
          </div>
        ))
      ) : (
        <ResultTable candidates={result.candidates} winnerName={result.winner.name} statusLabel={statusLabel} label="Election result vote shares" />
      )}

      <p className="result-asof">{result.figuresAsOf}</p>
      {result.certification && (
        <p className={`result-cert cert-${result.certification.status}`}>
          {certificationText(result)}
          {result.certification.source?.url && (
            <>
              {' '}
              <a href={result.certification.source.url} target="_blank" rel="noopener noreferrer">Official notice</a>
            </>
          )}
        </p>
      )}
      {result.context && <p className="result-context">{result.context}</p>}

      <RecordMeta record={result} />
      {(result.history || []).length > 0 && (
        <p className="draft-note result-history">{result.history[result.history.length - 1].note}</p>
      )}

      {sources.length > 1 && (
        <details className="result-sources">
          <summary>All sources ({sources.length})</summary>
          <ul>
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title || s.url}</a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

export default ElectionResult;
