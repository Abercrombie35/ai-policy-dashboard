import React from 'react';
import { RecordMeta } from './ItemCard';
import { resultForRace, hasHiddenResult, resultLabel, resultStatuses, confidenceLevels } from '../lib/data';
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
      Winner ({status}): {result.winner.name} ({result.winner.party[0]})
    </span>
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
          {hasHiddenResult(race.id, includeDrafts)
            ? 'An unverified draft result is hidden until it is checked.'
            : 'Result not yet recorded.'}
        </p>
      </section>
    );
  }

  const sorted = [...result.candidates].sort((a, b) => (b.votePct ?? -1) - (a.votePct ?? -1));
  const sources = [result.source, ...(result.additionalSources || [])].filter((s) => s?.url);

  return (
    <section className="election-result" aria-labelledby={`result-${race.id}`}>
      <div className="result-head">
        <h3 id={`result-${race.id}`}>Election result</h3>
        <ResultBadges result={result} />
      </div>

      <p className="result-winner">
        <strong>{result.winner.name}</strong> ({result.winner.party}) won.{' '}
        {result.call && <span className="result-call">{result.call}</span>}
      </p>

      <table className="result-table">
        <thead>
          <tr>
            <th scope="col">Candidate</th>
            <th scope="col">Party</th>
            <th scope="col">Vote share ({resultStatuses[result.resultStatus]?.label.toLowerCase()})</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.name} className={c.name === result.winner.name ? 'winner' : ''}>
              <th scope="row">
                {c.name}
                {c.name === result.winner.name && <span className="winner-mark"> · Winner</span>}
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

      <p className="result-asof">{result.figuresAsOf}</p>
      {result.context && <p className="result-context">{result.context}</p>}

      <RecordMeta record={result} />
      {result.history.length > 0 && (
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
