import React from 'react';
import { categorizedRecords, categoriesInDomain, primaryCategory, stateName, domains } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/Analysis.css';

const SAID_SIDES = ['Democratic', 'Republican'];
const PROPOSED_SIDES = ['Democratic', 'Republican', 'Bipartisan', 'Other'];
const sideOf = (party) => (['Democratic', 'Republican', 'Bipartisan'].includes(party) ? party : 'Other');
const cell = (n) => n || '–';

// Each record counts once, under its first category in this policy area.
function rowsFor(records, domainId) {
  return categoriesInDomain(domainId)
    .map((cat) => ({ cat, list: records.filter((r) => primaryCategory(r.record, domainId) === cat.id) }))
    .filter((r) => r.list.length > 0);
}

// What is said and what is proposed in one policy area, category by category:
// by party, and (without a state) by jurisdiction.
function CategoryBreakdown({ domainId, state, showByState = !state }) {
  const { includeDrafts } = useDrafts();
  const records = categorizedRecords(includeDrafts).filter(
    (r) => r.domains.includes(domainId) && (!state || r.jurisdiction === state),
  );
  const rows = rowsFor(records, domainId);
  if (rows.length === 0) {
    return <p className="empty-note">Nothing recorded in {domains[domainId].label.toLowerCase()}{state ? ` for ${stateName(state)}` : ''} yet.</p>;
  }
  const jurisdictions = [...new Set(records.map((r) => r.jurisdiction))].sort((a, b) =>
    a === 'US' ? 1 : b === 'US' ? -1 : stateName(a).localeCompare(stateName(b)),
  );

  return (
    <div className="category-breakdown">
      <div className="table-wrap">
        <table className="data-table where-table">
          <caption className="visually-hidden">{domains[domainId].label}: records by category, track and party</caption>
          <thead>
            <tr>
              <th scope="col" rowSpan={2}>Category</th>
              <th scope="colgroup" colSpan={SAID_SIDES.length} className="group-head said">What is said</th>
              <th scope="colgroup" colSpan={PROPOSED_SIDES.length} className="group-head proposed">What is proposed</th>
              <th scope="col" rowSpan={2}>Total</th>
            </tr>
            <tr>
              {SAID_SIDES.map((s) => <th scope="col" key={`s-${s}`}>{s}</th>)}
              {PROPOSED_SIDES.map((s) => <th scope="col" key={`p-${s}`}>{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ cat, list }) => {
              const said = list.filter((r) => r.track === 'said');
              const proposed = list.filter((r) => r.track === 'proposed');
              return (
                <tr key={cat.id}>
                  <th scope="row" title={cat.description}>{cat.label}</th>
                  {SAID_SIDES.map((s) => <td key={`s-${s}`} className="num">{cell(said.filter((r) => sideOf(r.party) === s).length)}</td>)}
                  {PROPOSED_SIDES.map((s) => <td key={`p-${s}`} className="num">{cell(proposed.filter((r) => sideOf(r.party) === s).length)}</td>)}
                  <td className="num strong">{list.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showByState && (
        <div className="table-wrap">
          <table className="data-table where-table">
            <caption className="visually-hidden">{domains[domainId].label}: records by category and jurisdiction</caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                {jurisdictions.map((j) => <th scope="col" key={j}>{stateName(j)}<div className="sub-head">said · proposed</div></th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ cat, list }) => (
                <tr key={cat.id}>
                  <th scope="row" title={cat.description}>{cat.label}</th>
                  {jurisdictions.map((j) => {
                    const inJ = list.filter((r) => r.jurisdiction === j);
                    const s = inJ.filter((r) => r.track === 'said').length;
                    const p = inJ.filter((r) => r.track === 'proposed').length;
                    return <td key={j} className="num">{inJ.length ? `${s} · ${p}` : '–'}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="fine-print">
        Counts of candidate statements, candidate proposals and official actions, and bills. Each record counts once, under
        its first category in this area. Bills count as proposed, by their sponsors' parties (both parties = bipartisan;
        other or unrecorded sponsors = other). Categories were assigned by an AI model and have not been reviewed.
      </p>
    </div>
  );
}

export default CategoryBreakdown;
