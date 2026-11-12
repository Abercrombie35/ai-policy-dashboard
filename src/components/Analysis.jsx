import React from 'react';
import { stanceLabel, tracks, confidenceLevels, stateName } from '../lib/data';
import { STATUS, deviationCell, questionsInDomain, partyLine, timeline } from '../lib/analysis';
import { useDrafts } from '../lib/drafts';
import '../styles/Analysis.css';

const fmtDate = (record) => record.publishedDate || record.dateNote || 'Date unknown';

export function StatusTag({ status, small = false }) {
  const s = STATUS[status];
  return (
    <span className={`status-tag status-${status} ${small ? 'small' : ''}`} title={s.description}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
    </span>
  );
}

export function TrackTag({ track }) {
  if (!track) return null;
  return <span className={`track-tag track-${track}`} title={tracks[track]?.description}>{track === 'said' ? 'Said' : 'Proposed'}</span>;
}

function SourceLink({ source }) {
  if (!source?.url) return <span className="missing">No source</span>;
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title || source.url}</a>
  );
}

// The party line for one question, with its evidence.
export function PartyLineCell({ party, questionId, showEvidence = true }) {
  const line = partyLine(party, questionId);
  if (!line) return <span className="missing">Not built</span>;
  return (
    <div className="party-line-cell">
      <div className="line-stance">
        {line.stance ? <strong>{stanceLabel(questionId, line.stance)}</strong> : <strong className="missing">No clear line</strong>}
      </div>
      <p className="line-summary">{line.summary}</p>
      {showEvidence && (
        <details className="line-evidence">
          <summary>Evidence ({line.evidence.length}) · Confidence: {confidenceLevels[line.confidence]?.label}</summary>
          <ul>
            {line.evidence.map((e, i) => (
              <li key={i}>
                <TrackTag track={e.track} /> <span className="ev-date">{e.date || 'Undated'}</span> {e.summary}{' '}
                <span className="ev-source">(<SourceLink source={e.source} />)</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function TrackLine({ entry, track, questionId }) {
  if (!entry) {
    return (
      <div className="track-line empty">
        <TrackTag track={track} /> <span className="missing">nothing recorded</span>
      </div>
    );
  }
  return (
    <div className="track-line">
      <TrackTag track={track} /> <StatusTag status={entry.status} small />{' '}
      <span className="cell-stance">{stanceLabel(questionId, entry.stance)}</span>{' '}
      <span className="cell-date">({fmtDate(entry.record)})</span>
    </div>
  );
}

// Candidates (rows) by policy questions (columns) for one policy area.
export function DeviationMatrix({ domainId, rows }) {
  const { includeDrafts } = useDrafts();
  const questions = questionsInDomain(domainId);
  return (
    <div className="table-wrap">
      <table className="deviation-matrix">
        <thead>
          <tr>
            <th scope="col">Candidate</th>
            {questions.map((q) => (
              <th scope="col" key={q.id} title={q.question}>{q.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ race, candidate }) => (
            <tr key={`${race.id}-${candidate.id}`}>
              <th scope="row">
                <span className="cand-name">{candidate.name}</span>
                <span className={`cand-party ${candidate.party.toLowerCase()}`}>{candidate.party}</span>
                <span className="cand-race">{stateName(race.state)} {race.office}</span>
              </th>
              {questions.map((q) => {
                const cell = deviationCell(race, candidate, q.id, includeDrafts);
                return (
                  <td key={q.id} className={`cell-${cell.status}`}>
                    {cell.entries.length === 0 ? (
                      <StatusTag status={cell.line?.stance ? 'no-evidence' : 'no-baseline'} small />
                    ) : (
                      <>
                        <TrackLine entry={cell.byTrack.said} track="said" questionId={q.id} />
                        <TrackLine entry={cell.byTrack.proposed} track="proposed" questionId={q.id} />
                        {cell.shifted && <div className="shift-note">↺ Stance changed over time (see timeline)</div>}
                      </>
                    )}
                    <div className="cell-line">
                      Party line: {cell.line?.stance ? stanceLabel(q.id, cell.line.stance) : 'none'}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// When stances were taken, in date order, with their status against the line.
export function DeviationTimeline({ domainId, raceId }) {
  const { includeDrafts } = useDrafts();
  const entries = timeline(domainId, includeDrafts).filter((e) => !raceId || e.race.id === raceId);
  if (entries.length === 0) return <p className="empty-note">No stances recorded in this area yet.</p>;
  return (
    <ol className="deviation-timeline">
      {entries.map((e) => (
        <li key={`${e.record.id}-${e.questionId}`} className={`tl-${e.status}`}>
          <div className="tl-date">{fmtDate(e.record)}</div>
          <div className="tl-body">
            <div className="tl-head">
              <strong>{e.candidate.name}</strong> <span className="tl-meta">({e.candidate.party[0]}, {stateName(e.race.state)} {e.race.office})</span>{' '}
              <TrackTag track={e.track} /> <StatusTag status={e.status} small />
            </div>
            <div className="tl-stance">
              {questionsInDomain(domainId).find((q) => q.id === e.questionId)?.label}: <strong>{stanceLabel(e.questionId, e.stance)}</strong>
            </div>
            <p className="tl-text">{e.record.text}</p>
            <div className="tl-source">
              Source: <SourceLink source={e.record.source} /> · Confidence: {confidenceLevels[e.record.confidence]?.label}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

// Race-level view: both policy areas for the race's candidates.
export function RaceDeviation({ race }) {
  const rows = race.candidates.map((candidate) => ({ race, candidate }));
  return (
    <section className="race-deviation">
      <h3>Deviation from the party line</h3>
      <p className="section-note">
        Each candidate's stances compared with their party's line. Model-generated analysis: stances were coded by an
        AI model from sourced records and have not been reviewed. <a href="#/analysis">Full analysis and party lines</a>.
      </p>
      <h4 className="domain-heading data-centers">Data centers</h4>
      <DeviationMatrix domainId="data-centers" rows={rows} />
      <h4 className="domain-heading ai-general">Everything else in AI</h4>
      <DeviationMatrix domainId="ai-general" rows={rows} />
      <details className="race-timeline">
        <summary>When: timeline of stances in this race</summary>
        <h5>Data centers</h5>
        <DeviationTimeline domainId="data-centers" raceId={race.id} />
        <h5>Everything else in AI</h5>
        <DeviationTimeline domainId="ai-general" raceId={race.id} />
      </details>
    </section>
  );
}
