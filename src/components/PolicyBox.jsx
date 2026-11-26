import React from 'react';
import { headlineOf, placeOf, billStatuses, trackOf, checkOf, CHECK_RESULTS } from '../lib/data';
import '../styles/PolicyBox.css';

const tintOf = (party) => {
  if (party === 'Democratic') return 'democratic';
  if (party === 'Republican') return 'republican';
  if (party === 'Bipartisan') return 'bipartisan';
  return 'other';
};
// Short party name: D or R in the U.S.; abroad the party's own abbreviation,
// e.g. "Rassemblement National (RN)" -> RN, or its name.
const abbr = (party) => {
  if (!party) return '?';
  if (party === 'Independent Party') return 'IP';
  if (party === 'Democratic' || party === 'Republican') return party[0];
  return party.match(/\(([^)]+)\)$/)?.[1] || party;
};
const roleOf = (race) => (race.office === 'President' ? 'presidential candidate' : `${race.office} candidate`);

// Who is behind a record: a bill's sponsors, or the candidate.
export function whoOf(record, { race, candidate } = {}) {
  if (record.billNumber) {
    if (record.sponsors?.length) return `Sponsors: ${record.sponsors.map((s) => `${s.name} (${abbr(s.party)})`).join(', ')}`;
    return record.sponsorsNote || 'Sponsors not yet recorded';
  }
  const verb = record.kind === 'action' ? 'Action by' : trackOf(record) === 'said' ? 'Said by' : 'Proposed by';
  const office = race ? `, ${roleOf(race)}, ${placeOf(race)}` : '';
  return `${verb} ${candidate?.name}${candidate ? ` (${abbr(candidate.party)})` : ''}${office}`;
}

// The small line at the bottom right: where, status and date.
function metaOf(record) {
  if (record.billNumber) {
    const status = billStatuses[record.status]?.label;
    const number = /verify|to be filed|announcement/i.test(record.billNumber) ? '' : ` ${record.billNumber}`;
    return [`${placeOf(record)}${number}`, status, record.statusDate].filter(Boolean).join(' · ');
  }
  return record.publishedDate || record.dateNote || '';
}

// The tiny note on a claim that could not be fully confirmed (or was
// corrected); nothing for confirmed claims.
export function CheckNote({ id, className = 'policy-check' }) {
  const check = checkOf(id);
  const info = check && CHECK_RESULTS[check.result];
  if (!info?.short) return null;
  const detail = [
    check.note,
    check.unconfirmed?.length ? `Not confirmed: ${check.unconfirmed.join('; ')}.` : '',
    check.method === 'chatgpt-primary-source' ? `Checked against the primary source with ChatGPT web browsing, relayed by the project owner (${check.checkedOn}).` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={`${className} check-${check.result}`} title={detail || info.description}>
      {info.short}
    </span>
  );
}

// Numbers sources in order of first use; boxes that share a source share its
// number. Each source also lists the other reports that confirmed the claims
// citing it.
export function makeSourceIndex(records) {
  const byUrl = new Map();
  const list = [];
  for (const r of records) {
    const url = r.source?.url;
    if (!url) continue;
    if (!byUrl.has(url)) {
      byUrl.set(url, list.length + 1);
      list.push({ n: list.length + 1, source: r.source, also: [], primary: false });
    }
    const entry = list[byUrl.get(url) - 1];
    if (r.confidence === 'high') entry.primary = true;
    const check = checkOf(r.id);
    if (check && ['confirmed', 'corrected', 'partly-confirmed'].includes(check.result)) {
      for (const s of check.sources || []) {
        if (s.url !== url && !entry.also.some((a) => a.url === s.url) && entry.also.length < 3) entry.also.push(s);
      }
    }
  }
  return { numberOf: (r) => byUrl.get(r.source?.url), list };
}

// "Outlet: headline" -> "Outlet", for the short confirming-source links.
const outletOf = (s) => (s.title || s.url).split(':')[0].trim();

// A policy box: the central point in large type, who is behind it (tinted by
// party in the U.S., by bloc abroad), a numbered source reference, and the
// date in small type.
export function PolicyBox({ record, party, bloc, race, candidate, refNum, refPrefix, details }) {
  const tint = bloc || candidate?.bloc ? `bloc-${bloc || candidate.bloc}` : tintOf(party);
  return (
    <article className={`policy-box tint-${tint}`}>
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
      <div className="policy-foot">
        <CheckNote id={record.id} />
        <p className="policy-date">{metaOf(record)}</p>
      </div>
    </article>
  );
}

// The numbered sources for a group of boxes, listed under the group.
export function SourceList({ index, refPrefix }) {
  if (index.list.length === 0) return null;
  return (
    <ol className="source-list" aria-label="Sources">
      {index.list.map(({ n, source, also, primary }) => (
        <li key={n} id={`${refPrefix}-${n}`}>
          <span className="src-n">[{n}]</span>{' '}
          <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title || source.url}</a>
          {primary && <span className="src-primary" title="Wording and date checked against this primary source (High confidence)"> · primary source checked</span>}
          {also.length > 0 && (
            <span className="src-check">
              {' '}· confirmed by{' '}
              {also.map((a, i) => (
                <React.Fragment key={a.url}>
                  {i > 0 && ', '}
                  <a href={a.url} target="_blank" rel="noopener noreferrer" title={a.title}>{outletOf(a)}</a>
                </React.Fragment>
              ))}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
