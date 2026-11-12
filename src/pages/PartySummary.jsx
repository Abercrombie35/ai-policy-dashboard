import React, { useMemo, useState } from 'react';
import { allCodedRecords, dimensions, countRecords } from '../lib/data';
import { useDrafts } from '../lib/drafts';

const PARTIES = ['Democratic', 'Republican'];
const SOURCES = [
  { id: 'all', label: 'Campaigns and legislation' },
  { id: 'campaign', label: 'Campaign records only' },
  { id: 'legislation', label: 'Legislation only' },
];

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

function DimensionBlock({ dim, records }) {
  const totals = Object.fromEntries(PARTIES.map((p) => [p, records.filter((r) => r.party === p).length]));
  const rows = dim.categories.map((cat) => {
    const counts = {};
    for (const p of PARTIES) {
      counts[p] = records.filter((r) => {
        if (r.party !== p) return false;
        const v = r.record.coding?.[dim.id];
        return Array.isArray(v) ? v.includes(cat.id) : v === cat.id;
      }).length;
    }
    return { cat, counts };
  });

  return (
    <section className="dimension-block">
      <h3>{dim.label}</h3>
      <p className="dimension-note">
        {dim.multi
          ? 'Share of each party’s coded records that mention the category. A record can mention several, so shares need not sum to 100%.'
          : 'Share of each party’s coded records in each category.'}
      </p>
      <table className="meter-table">
        <thead>
          <tr>
            <th scope="col">Category</th>
            {PARTIES.map((p) => (
              <th scope="col" key={p}>{p} (n = {totals[p]})</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ cat, counts }) => (
            <tr key={cat.id}>
              <th scope="row">{cat.label}</th>
              {PARTIES.map((p) => {
                const share = pct(counts[p], totals[p]);
                return (
                  <td key={p}>
                    <div className="meter" title={`${p}: ${counts[p]} of ${totals[p]} records (${share}%)`}>
                      <div className="meter-track">
                        <div className={`meter-fill ${p.toLowerCase()}`} style={{ width: `${share}%` }} />
                      </div>
                      <span className="meter-figure">
                        {counts[p]}/{totals[p]} · {share}%
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PartySummary() {
  const { includeDrafts, setIncludeDrafts } = useDrafts();
  const [source, setSource] = useState('all');

  const records = useMemo(
    () => allCodedRecords(includeDrafts).filter((r) => source === 'all' || r.source === source),
    [includeDrafts, source],
  );
  const { drafts } = countRecords();
  const anyUnreviewed = records.some((r) => !r.record.coding.reviewed);

  return (
    <div className="page">
      <header className="page-head">
        <h2>Party comparison</h2>
        <p>
          How Democratic and Republican records differ across the codebook dimensions (research questions 1 and 3).
          Figures are counts of coded records, not people, and say nothing about which approach is better.
        </p>
      </header>

      <div className="filter-row">
        <label>
          Records
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {SOURCES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <ul className="legend" aria-label="Legend">
          {PARTIES.map((p) => (
            <li key={p}><span className={`legend-swatch ${p.toLowerCase()}`} /> {p}</li>
          ))}
        </ul>
      </div>

      {records.length === 0 ? (
        <div className="empty-panel">
          <h3>No verified coded records yet</h3>
          <p>
            Party comparisons appear here once records have been checked against sources and coded.
            {!includeDrafts && drafts > 0 && ` ${drafts} unverified draft records exist.`}
          </p>
          {!includeDrafts && drafts > 0 && (
            <button type="button" className="chip" onClick={() => setIncludeDrafts(true)}>Preview with drafts</button>
          )}
        </div>
      ) : (
        <>
          {(includeDrafts || anyUnreviewed) && (
            <div className="warning-panel" role="note">
              This view includes unverified drafts and/or coding produced by an AI model that no person has reviewed.
              It shows how the view works. It is not a finding.
            </div>
          )}
          <div className="dimension-grid">
            {dimensions.map((dim) => <DimensionBlock key={dim.id} dim={dim} records={records} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default PartySummary;
