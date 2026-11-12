import React from 'react';
import { codebook, races, bills, results, elections, filterDrafts, stateName, datasetUpdated, countRecords, raceById, itemsForRace, trackOf, domainsOf, partyLines, researchRecords, policyQuestions } from '../lib/data';
import { allCandidates, deviationCell } from '../lib/analysis';
import { useDrafts } from '../lib/drafts';

// Quote every field and neutralise spreadsheet formulas (CSV injection).
function csvCell(value) {
  let s = value == null ? '' : Array.isArray(value) ? value.join('; ') : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
const toCsv = (header, rows) => [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');

const CODING_COLUMNS = codebook.dimensions.map((d) => d.id);

function itemRows(includeDrafts) {
  const rows = [];
  for (const race of races) {
    for (const item of filterDrafts([...itemsForRace(race), ...race.contextSignals], includeDrafts)) {
      const c = race.candidates.find((x) => x.id === item.candidateId);
      rows.push([
        item.id, race.id, race.state, race.office, race.cycle, item.candidateId, c?.name, c?.party,
        item.kind, item.labelType, item.confidence, item.text, item.source?.title, item.source?.url,
        item.publishedDate, item.lastVerified, item.version,
        ...CODING_COLUMNS.map((k) => item.coding?.[k]), item.coding ? item.coding.reviewed : '',
        trackOf(item), domainsOf(item), Object.entries(item.stances || {}).map(([q, s]) => `${q}=${s}`), item.dateNote,
      ]);
    }
  }
  return toCsv(
    ['id', 'race_id', 'state', 'office', 'cycle', 'candidate_id', 'candidate_name', 'party', 'kind', 'label_type',
      'confidence', 'text', 'source_title', 'source_url', 'published_date', 'last_verified', 'version',
      ...CODING_COLUMNS, 'coding_reviewed', 'track', 'policy_areas', 'stances', 'date_note'],
    rows,
  );
}

// One row per candidate per policy question: the latest stance in each track
// and its status against the party line.
function deviationRows(includeDrafts) {
  const rows = [];
  for (const { race, candidate } of allCandidates()) {
    for (const q of policyQuestions) {
      const cell = deviationCell(race, candidate, q.id, includeDrafts);
      rows.push([
        race.id, race.state, race.office, candidate.id, candidate.name, candidate.party, q.id,
        cell.line?.stance ?? '', cell.status, cell.shifted,
        cell.byTrack.said?.stance ?? '', cell.byTrack.said?.status ?? '', cell.byTrack.said?.record.publishedDate ?? '', cell.byTrack.said?.record.source?.url ?? '',
        cell.byTrack.proposed?.stance ?? '', cell.byTrack.proposed?.status ?? '', cell.byTrack.proposed?.record.publishedDate ?? '', cell.byTrack.proposed?.record.source?.url ?? '',
      ]);
    }
  }
  return toCsv(
    ['race_id', 'state', 'office', 'candidate_id', 'candidate_name', 'party', 'question', 'party_line_stance', 'current_status',
      'shifted', 'said_stance', 'said_status', 'said_date', 'said_source', 'proposed_stance', 'proposed_status',
      'proposed_date', 'proposed_source'],
    rows,
  );
}

function billRows(includeDrafts) {
  const rows = filterDrafts(bills, includeDrafts).map((b) => [
    b.id, b.state, stateName(b.state), b.session, b.billNumber, b.title, b.status, b.statusDate,
    b.sponsors.map((s) => `${s.name} (${s.party})`), b.labelType, b.confidence, b.summary, b.source?.title,
    b.source?.url, b.lastVerified, b.version, ...CODING_COLUMNS.map((k) => b.coding?.[k]), b.coding ? b.coding.reviewed : '',
    domainsOf(b), b.tags, b.statusNote, b.sponsorsNote,
  ]);
  return toCsv(
    ['id', 'state', 'state_name', 'session', 'bill_number', 'title', 'status', 'status_date', 'sponsors', 'label_type',
      'confidence', 'summary', 'source_title', 'source_url', 'last_verified', 'version', ...CODING_COLUMNS, 'coding_reviewed',
      'policy_areas', 'tags', 'status_note', 'sponsors_note'],
    rows,
  );
}

// One row per candidate per result, so the file opens cleanly in a spreadsheet.
function resultRows(includeDrafts) {
  const rows = [];
  for (const r of filterDrafts(results, includeDrafts)) {
    const race = raceById(r.raceId);
    for (const c of r.candidates) {
      rows.push([
        r.id, r.raceId, race?.state, race?.office, race?.cycle, r.labelType, r.resultStatus, c.name, c.party,
        c.candidateId, c.votePct, c.votes, c.name === r.winner.name, r.figuresAsOf, r.source?.title, r.source?.url,
        r.confidence, r.lastVerified, r.version,
      ]);
    }
  }
  return toCsv(
    ['result_id', 'race_id', 'state', 'office', 'cycle', 'label_type', 'result_status', 'candidate_name', 'party',
      'candidate_id', 'vote_pct', 'votes', 'is_winner', 'figures_as_of', 'source_title', 'source_url', 'confidence',
      'last_verified', 'version'],
    rows,
  );
}

function fullJson(includeDrafts) {
  return JSON.stringify(
    {
      generated: new Date().toISOString(),
      datasetUpdated,
      includesUnverifiedDrafts: includeDrafts,
      codebook,
      races: races.map((r) => ({
        ...r,
        items: filterDrafts(r.items, includeDrafts),
        researchRecords: filterDrafts(researchRecords.filter((x) => x.raceId === r.id), includeDrafts),
        contextSignals: filterDrafts(r.contextSignals, includeDrafts),
      })),
      electionResults: filterDrafts(results, includeDrafts),
      partyLines,
      bills: filterDrafts(bills, includeDrafts),
      internationalElections: elections,
    },
    null,
    2,
  );
}

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function DataView() {
  const { includeDrafts, setIncludeDrafts } = useDrafts();
  const { sourced, drafts } = countRecords();
  const suffix = includeDrafts ? '-with-drafts' : '';

  const files = [
    { name: `ai-policy-dataset${suffix}.json`, label: 'Full dataset (JSON)', desc: 'Races, candidates, labeled records, election results, bills, international elections and the codebook.', make: () => fullJson(includeDrafts), type: 'application/json' },
    { name: `election-results${suffix}.csv`, label: 'Election results (CSV)', desc: 'One row per candidate per race, with unofficial or certified status and sources.', make: () => resultRows(includeDrafts), type: 'text/csv' },
    { name: `campaign-records${suffix}.csv`, label: 'Campaign records (CSV)', desc: 'One row per candidate record, with labels and coding.', make: () => itemRows(includeDrafts), type: 'text/csv' },
    { name: `party-line-deviation${suffix}.csv`, label: 'Party-line deviation (CSV)', desc: 'One row per candidate per policy question: party line, latest said and proposed stances, status and sources.', make: () => deviationRows(includeDrafts), type: 'text/csv' },
    { name: `ai-bills${suffix}.csv`, label: 'AI bills and moratoriums (CSV)', desc: 'One row per federal or state bill, with sponsors, status, policy area, labels and coding.', make: () => billRows(includeDrafts), type: 'text/csv' },
    { name: 'codebook.json', label: 'Codebook (JSON)', desc: 'Dimensions, categories, label types and confidence levels.', make: () => JSON.stringify(codebook, null, 2), type: 'application/json' },
  ];

  return (
    <div className="page">
      <header className="page-head">
        <h2>Download the data</h2>
        <p>
          The coded dataset and its codebook, released for reuse. Last edited {datasetUpdated || 'never'}.
          {' '}{sourced} sourced record{sourced === 1 ? '' : 's'}, {drafts} unverified draft{drafts === 1 ? '' : 's'}.
        </p>
      </header>

      <label className="checkbox-row">
        <input type="checkbox" checked={includeDrafts} onChange={(e) => setIncludeDrafts(e.target.checked)} />
        Include unverified drafts (the file names will say "with-drafts")
      </label>

      <div className="download-grid">
        {files.map((f) => (
          <div key={f.name} className="download-card">
            <h3>{f.label}</h3>
            <p>{f.desc}</p>
            <button type="button" className="chip active" onClick={() => download(f.name, f.make(), f.type)}>
              Download {f.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataView;
