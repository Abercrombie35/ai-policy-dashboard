import React from 'react';
import { senateSelection, raceById } from '../lib/data';

const STATUS = { tracked: 'Tracked', next: 'Next to add', later: 'To add later' };
const partyShort = (p) => (p ? p[0] : '');

function Src({ source }) {
  if (!source?.url) return null;
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" title={source.title}>
      source
    </a>
  );
}

// The 2026 Senate sample (AIPD-102): the published criteria, the races they
// select with the reason for each, and every other 2026 Senate contest.
function RaceSelection() {
  if (!senateSelection) return null;
  const { criteria, races, criteriaSummary, asOf, method, gaps = [] } = senateSelection;
  const chosen = races.filter((r) => r.selected);
  const others = races.filter((r) => !r.selected);
  const crit = Object.fromEntries(criteria.map((c) => [c.id, c]));
  return (
    <>
      <p>{criteriaSummary}</p>
      <ol className="selection-criteria">
        {criteria.map((c) => (
          <li key={c.id}><strong>{c.label}.</strong> {c.description}</li>
        ))}
      </ol>
      <div className="table-wrap" role="region" aria-label="Senate races in the sample" tabIndex={0}>
        <table className="data-table selection-table">
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Seat before the election</th>
              <th scope="col">Latest rating found</th>
              <th scope="col">Result</th>
              <th scope="col">Why it is in the sample</th>
              <th scope="col">Dashboard</th>
            </tr>
          </thead>
          <tbody>
            {chosen.map((r) => {
              const race = r.trackedRaceId ? raceById(r.trackedRaceId) : null;
              return (
                <tr key={`${r.state}-${r.seatType}`}>
                  <th scope="row">{r.stateName}{r.seatType === 'special' ? ' (special)' : ''}</th>
                  <td>
                    {r.incumbent ? `${r.incumbent.name} (${partyShort(r.incumbent.party)})${r.incumbent.note ? `, ${r.incumbent.note.charAt(0).toLowerCase()}${r.incumbent.note.slice(1)}` : ''}` : 'Vacant'}
                    {r.openSeat ? ', open seat' : ', incumbent running'}
                  </td>
                  <td>
                    {r.rating ? <>{r.rating.rating} <Src source={r.rating.source} /><span className="rating-asof">{r.rating.asOf}</span></> : 'Not found'}
                  </td>
                  <td>{r.result ? <>{r.result.winner} ({partyShort(r.result.party)}){r.result.flipped ? ', flip' : ''} <Src source={r.result.source} /></> : 'Not found'}</td>
                  <td>
                    {r.reason}{' '}
                    <span className="criteria-met">({r.criteriaMet.map((id) => crit[id]?.short || id).join('; ')})</span>
                  </td>
                  <td>
                    {race ? <a href={`#/state/${race.state}/${race.id}`}>Open the race</a> : STATUS[r.status] || r.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <details className="selection-others">
        <summary>The other {others.length} Senate contests of 2026, and why they are not in the sample</summary>
        <div className="table-wrap" role="region" aria-label="Senate races not in the sample" tabIndex={0}>
          <table className="data-table">
            <thead>
              <tr><th scope="col">State</th><th scope="col">Latest rating found</th><th scope="col">Result</th><th scope="col">Why not</th></tr>
            </thead>
            <tbody>
              {others.map((r) => (
                <tr key={`${r.state}-${r.seatType}`}>
                  <th scope="row">{r.stateName}{r.seatType === 'special' ? ' (special)' : ''}</th>
                  <td>{r.rating ? <>{r.rating.rating} <Src source={r.rating.source} /></> : 'Not found'}</td>
                  <td>{r.result ? `${r.result.winner} (${partyShort(r.result.party)})${r.result.flipped ? ', flip' : ''}` : 'Not found'}</td>
                  <td>{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="section-note">
        {method} Each rating, result and signal links to its source. The criteria were fixed before the list was drawn
        up (tools/select_senate_races.py applies them), and the list is not changed to suit results.
      </p>
      {gaps.length > 0 && (
        <details className="selection-gaps">
          <summary>Known gaps in these facts ({gaps.length})</summary>
          <ul>{gaps.map((g) => <li key={g}>{g}</li>)}</ul>
        </details>
      )}
    </>
  );
}

export default RaceSelection;
