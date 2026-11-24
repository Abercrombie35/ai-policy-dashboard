import React from 'react';
import { stanceLabel, tracks, confidenceLevels, stateName, blocs, BLOC_IDS } from '../lib/data';
import { STATUS, deviationCell, questionsInDomain, partyLine, timeline } from '../lib/analysis';
import { useDrafts } from '../lib/drafts';
import { PolicyBox, SourceList, makeSourceIndex, CheckNote } from './PolicyBox';
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
                <CheckNote id={`${line.id}#${i}`} className="check-inline" />
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
export function DeviationTimeline({ domainId, raceId, race }) {
  const { includeDrafts } = useDrafts();
  // Abroad there is no party line: the timeline shows stances only.
  const abroad = Boolean(race?.country);
  const candidates = race ? (race.candidates || []).map((candidate) => ({ race, candidate })) : undefined;
  const entries = timeline(domainId, includeDrafts, candidates).filter((e) => !raceId || e.race.id === raceId);
  if (entries.length === 0) return <p className="empty-note">No stances recorded in this area yet.</p>;
  const index = makeSourceIndex(entries.map((e) => e.record));
  const refPrefix = `src-tl-${domainId}-${raceId || 'all'}`;
  return (
    <>
      <ol className="deviation-timeline">
        {entries.map((e) => (
          <li key={`${e.record.id}-${e.questionId}`} className={`tl-${e.status}`}>
            <div className="tl-date">{fmtDate(e.record)}</div>
            <div className="tl-body">
              <PolicyBox
                record={e.record}
                party={e.candidate.party}
                race={e.race}
                candidate={e.candidate}
                refNum={index.numberOf(e.record)}
                refPrefix={refPrefix}
              />
              <div className="tl-stance">
                {!abroad && <StatusTag status={e.status} small />} {questionsInDomain(domainId).find((q) => q.id === e.questionId)?.label}:{' '}
                <strong>{stanceLabel(e.questionId, e.stance)}</strong>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <SourceList index={index} refPrefix={refPrefix} />
    </>
  );
}

// Race-level view: both policy areas for the race's candidates.
export function RaceDeviation({ race }) {
  const rows = (race.candidates || []).map((candidate) => ({ race, candidate }));
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

// Abroad: where each candidate stands on the policy questions, ordered from
// left to far right. There is no U.S.-style party line to deviate from, so
// candidates are compared with each other.
function StanceMatrix({ domainId, race }) {
  const { includeDrafts } = useDrafts();
  const questions = questionsInDomain(domainId, 'intl');
  const rows = [...(race.candidates || [])].sort((a, b) => BLOC_IDS.indexOf(a.bloc) - BLOC_IDS.indexOf(b.bloc));
  return (
    <div className="table-wrap" role="region" aria-label={`Stances: ${domainId}`} tabIndex={0}>
      <table className="deviation-matrix stance-matrix">
        <thead>
          <tr>
            <th scope="col">Candidate</th>
            {questions.map((q) => <th scope="col" key={q.id} title={q.question}>{q.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((candidate) => (
            <tr key={candidate.id}>
              <th scope="row">
                <span className="cand-name">{candidate.name}</span>
                <span className="cand-party"><span className={`bloc-swatch ${candidate.bloc}`} aria-hidden="true" />{candidate.party}</span>
                <span className="cand-race">{blocs[candidate.bloc]?.label}</span>
              </th>
              {questions.map((q) => {
                const cell = deviationCell(race, candidate, q.id, includeDrafts);
                return (
                  <td key={q.id} className={cell.entries.length ? 'cell-stance-known' : 'cell-no-evidence'}>
                    {cell.entries.length === 0 ? (
                      <span className="missing">No stance recorded</span>
                    ) : (
                      ['said', 'proposed'].map((t) => {
                        const entry = cell.byTrack[t];
                        if (!entry) return null;
                        return (
                          <div key={t} className="track-line">
                            <TrackTag track={t} /> <span className="cell-stance">{stanceLabel(q.id, entry.stance)}</span>{' '}
                            <span className="cell-date">({fmtDate(entry.record)})</span>
                          </div>
                        );
                      })
                    )}
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

export function RaceStances({ race }) {
  return (
    <section className="race-deviation">
      <h3>Where the candidates stand</h3>
      <p className="section-note">
        Each candidate's stance on the policy questions, from the left to the far right, split into what they said and
        what they proposed. Outside the U.S. there is no party line to measure deviation against, so candidates are
        compared with each other. Model-generated analysis: stances were coded by an AI model from sourced records and
        have not been reviewed. Questions that only apply in the U.S. (federal preemption, chip sales to China) are left
        out.
      </p>
      <h4 className="domain-heading data-centers">Data centers</h4>
      <StanceMatrix domainId="data-centers" race={race} />
      <h4 className="domain-heading ai-general">Everything else in AI</h4>
      <StanceMatrix domainId="ai-general" race={race} />
      <details className="race-timeline">
        <summary>When: timeline of stances in this race</summary>
        <h5>Data centers</h5>
        <DeviationTimeline domainId="data-centers" raceId={race.id} race={race} />
        <h5>Everything else in AI</h5>
        <DeviationTimeline domainId="ai-general" raceId={race.id} race={race} />
      </details>
    </section>
  );
}
