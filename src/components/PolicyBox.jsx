import React from 'react';
import { headlineOf, stateName, billStatuses, confidenceLevels, trackOf } from '../lib/data';
import '../styles/PolicyBox.css';

const tintOf = (party) => {
  if (party === 'Democratic') return 'democratic';
  if (party === 'Republican') return 'republican';
  if (party === 'Bipartisan') return 'bipartisan';
  return 'other';
};
const abbr = (party) => (party ? (party === 'Independent Party' ? 'IP' : party[0]) : '?');

// Who is behind a record: a bill's sponsors, or the candidate.
export function whoOf(record, { race, candidate } = {}) {
  if (record.billNumber) {
    if (record.sponsors?.length) return `Sponsors: ${record.sponsors.map((s) => `${s.name} (${abbr(s.party)})`).join(', ')}`;
    return record.sponsorsNote || 'Sponsors not yet recorded';
  }
  const verb = record.kind === 'action' ? 'Action by' : trackOf(record) === 'said' ? 'Said by' : 'Proposed by';
  const office = race ? `, ${race.office} candidate, ${stateName(race.state)}` : '';
  return `${verb} ${candidate?.name}${candidate ? ` (${abbr(candidate.party)})` : ''}${office}`;
}

// The small line at the bottom right: where, status and date.
function metaOf(record) {
  if (record.billNumber) {
    const status = billStatuses[record.status]?.label;
    const number = /verify|to be filed/i.test(record.billNumber) ? '' : ` ${record.billNumber}`;
    return [`${stateName(record.state)}${number}`, status, record.statusDate].filter(Boolean).join(' · ');
  }
  return record.publishedDate || record.dateNote || '';
}

// Numbers sources in order of first use; boxes that share a source share its number.
export function makeSourceIndex(records) {
  const byUrl = new Map();
  const list = [];
  for (const r of records) {
    const url = r.source?.url;
    if (!url || byUrl.has(url)) continue;
    byUrl.set(url, list.length + 1);
    list.push({ n: list.length + 1, source: r.source, confidence: r.confidence });
  }
  return { numberOf: (r) => byUrl.get(r.source?.url), list };
}

// A policy box: the central point in large type, who is behind it (tinted by
// party), a numbered source reference, and the date in small type.
export function PolicyBox({ record, party, race, candidate, refNum, refPrefix, details }) {
  return (
    <article className={`policy-box tint-${tintOf(party)}`}>
      <p className="policy-headline">
        {headlineOf(record)}
        {refNum && (
          <sup className="policy-ref">
            <a href={`#${refPrefix}-${refNum}`} onClick={(e) => { e.preventDefault(); document.getElementById(`${refPrefix}-${refNum}`)?.scrollIntoView({ block: 'center' }); }} aria-label={`Source ${refNum}`}>
              [{refNum}]
            </a>
          </sup>
        )}
      </p>
      <p className="policy-who">{whoOf(record, { race, candidate })}</p>
      {details && (
        <details className="policy-details">
          <summary>What it does</summary>
          <p>{details}</p>
        </details>
      )}
      <p className="policy-date">{metaOf(record)}</p>
    </article>
  );
}

// The numbered sources for a group of boxes, listed under the group.
export function SourceList({ index, refPrefix }) {
  if (index.list.length === 0) return null;
  return (
    <ol className="source-list" aria-label="Sources">
      {index.list.map(({ n, source, confidence }) => (
        <li key={n} id={`${refPrefix}-${n}`}>
          <span className="src-n">[{n}]</span>{' '}
          <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title || source.url}</a>
          {confidence !== 'high' && (
            <span className="src-check"> · {confidenceLevels[confidence]?.label} confidence, to verify</span>
          )}
        </li>
      ))}
    </ol>
  );
}
