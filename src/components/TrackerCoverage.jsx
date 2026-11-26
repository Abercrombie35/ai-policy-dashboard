import React from 'react';
import { trackers, usBills, jurisdictionLabel, filterDrafts, domainsOf } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import { SourceList } from './PolicyBox';

// "ALL" holds the trackers' national totals across the states.
const JURISDICTIONS = ['ALL', 'US', 'CA', 'CT', 'MI', 'TX'];
const label = (j) => (j === 'ALL' ? 'All states' : jurisdictionLabel(j));

// How this dataset's bill list compares with the three trackers named in the
// proposal: their published counts per jurisdiction, how many of our bills
// each tracker lists, and their terms of use.
function TrackerCoverage() {
  const { includeDrafts } = useDrafts();
  const ids = Object.keys(trackers.trackers);
  if (ids.length === 0) return null;
  const ours = filterDrafts(usBills, includeDrafts);

  // Number the count sources once, in table order.
  const list = [];
  const numberOf = new Map();
  const ref = (source) => {
    if (!numberOf.has(source.url)) {
      numberOf.set(source.url, list.length + 1);
      list.push({ n: list.length + 1, source, also: [], primary: false });
    }
    return numberOf.get(source.url);
  };
  const refPrefix = 'src-trackers';

  return (
    <section className="tracker-coverage">
      <h3>Compared with the IAPP, NCSL and MultiState trackers</h3>
      <p className="section-note">
        {trackers.note} The trackers count every AI bill; this dataset keeps the AI and data center bills most relevant to the
        tracked races, so its counts are smaller by design.
      </p>
      <div className="table-wrap" role="region" aria-label="Bill counts compared with the trackers" tabIndex={0}>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Jurisdiction</th>
              <th scope="col">This dashboard</th>
              {ids.map((id) => <th scope="col" key={id}>{trackers.trackers[id].short}</th>)}
            </tr>
          </thead>
          <tbody>
            {JURISDICTIONS.map((j) => {
              const mine = j === 'ALL' ? ours.filter((b) => b.state !== 'US') : ours.filter((b) => b.state === j);
              const dc = mine.filter((b) => domainsOf(b).includes('data-centers')).length;
              return (
                <tr key={j}>
                  <th scope="row">{label(j)}</th>
                  <td>
                    {mine.length} bills ({dc} on data centers)
                    <div className="sub-note">
                      {ids.map((id) => `${trackers.trackers[id].short}: ${mine.filter((b) => (b.trackers || []).some((t) => t.tracker === id)).length}`).join(' · ')} of them listed
                    </div>
                  </td>
                  {ids.map((id) => {
                    const counts = trackers.counts.filter((c) => c.tracker === id && c.jurisdiction === j);
                    return (
                      <td key={id}>
                        {counts.length === 0 ? (
                          <span className="missing">No published count found</span>
                        ) : (
                          counts.map((c) => (
                            <div key={`${c.measure}-${c.year}`} className="tracker-count">
                              {c.prefix ? `${c.prefix} ` : ''}<strong>{c.count.toLocaleString('en-US')}</strong> {c.measure}, {c.year}
                              <sup className="policy-ref"><a href={`#${refPrefix}-${ref(c.source)}`}>[{ref(c.source)}]</a></sup>
                              {c.status === 'single-source' && <span className="check-inline" title="Found in one report only">Partly verified</span>}
                            </div>
                          ))
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <SourceList index={{ list, numberOf: () => null }} refPrefix={refPrefix} />
      <details className="tracker-terms">
        <summary>Terms of use and how the trackers are used here</summary>
        <ul>
          {ids.map((id) => {
            const t = trackers.trackers[id];
            return (
              <li key={id}>
                <strong>{t.name}</strong>: {t.terms.summary}{' '}
                <a href={t.terms.url} target="_blank" rel="noopener noreferrer">Terms</a>
                {t.url && <> · <a href={t.url} target="_blank" rel="noopener noreferrer">Tracker</a></>}
              </li>
            );
          })}
        </ul>
      </details>
    </section>
  );
}

export default TrackerCoverage;
