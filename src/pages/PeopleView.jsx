import React, { useMemo, useState } from 'react';
import ItemCard, { HiddenDraftsNotice } from '../components/ItemCard';
import BillCard from '../components/BillCard';
import { people, personById, recordsForPerson } from '../lib/people';
import { filterDrafts, placeOf, domains, domainsOf, trackOf } from '../lib/data';
import { useDrafts } from '../lib/drafts';

const partyClass = (p) => (p || '').toLowerCase().split(' ')[0];
const raceLink = (race) => (race.country ? `#/country/${race.country}/${race.id}` : `#/state/${race.state}/${race.id}`);

function PartyTag({ party }) {
  if (!party) return null;
  return <span className={`party-tag person-party ${partyClass(party)}`}>{party}</span>;
}

// One line per role: the race they ran in (and the outcome), bills sponsored.
function Roles({ person }) {
  return (
    <ul className="person-roles">
      {person.races.map(({ race, outcome, title }) => (
        <li key={race.id}>
          {title ? <strong>{title}. </strong> : null}
          {race.cycle} {race.office}, {placeOf(race)}: {outcome.label}. <a href={raceLink(race)}>Open the race</a>
        </li>
      ))}
      {person.bills.length > 0 && (
        <li>
          Sponsor of {person.bills.length} bill{person.bills.length > 1 ? 's' : ''} in this dataset (
          {[...new Set(person.bills.map(({ bill }) => placeOf(bill)))].join(', ')}).
        </li>
      )}
    </ul>
  );
}

export function PersonPage({ id }) {
  const { includeDrafts } = useDrafts();
  const person = personById(id);
  if (!person) {
    return (
      <div className="page people-page">
        <p>No one with this link is in the dataset. <a href="#/people">See everyone</a>.</p>
      </div>
    );
  }
  const all = recordsForPerson(person);
  const shown = filterDrafts(all, includeDrafts);
  const byDomain = Object.keys(domains).map((d) => [d, shown.filter((r) => domainsOf(r).includes(d))]);
  const said = shown.filter((r) => trackOf(r) === 'said').length;
  const proposed = shown.filter((r) => trackOf(r) === 'proposed').length;
  return (
    <div className="page people-page person-page">
      <p><a href="#/people">← Everyone</a></p>
      <header className="page-head">
        <h2>{person.name} <PartyTag party={person.party} /></h2>
        <Roles person={person} />
      </header>

      {person.races.length > 0 && (
        <section>
          <h3>What they said and proposed on AI</h3>
          <p className="section-note">
            {shown.length} sourced record{shown.length === 1 ? '' : 's'}: {said} of what was said, {proposed} of what was proposed.
            Each card shows its label, confidence, source and version.
          </p>
          <HiddenDraftsNotice count={all.length - shown.length} />
          {shown.length === 0 && <p className="empty-note">Nothing recorded yet. Sparse coverage is itself a finding about how much AI featured.</p>}
          {byDomain.map(([d, recs]) =>
            recs.length > 0 ? (
              <div key={d} className="person-domain">
                <h4>{domains[d].label}</h4>
                {recs.map((r) => <ItemCard key={r.id} item={r} />)}
              </div>
            ) : null,
          )}
        </section>
      )}

      {person.bills.length > 0 && (
        <section>
          <h3>Bills sponsored</h3>
          {filterDrafts(person.bills.map(({ bill }) => bill), includeDrafts).map((b) => <BillCard key={b.id} bill={b} showState />)}
        </section>
      )}
    </div>
  );
}

// Everyone in the dataset: candidates in tracked races, then bill sponsors.
function PeopleView() {
  const [q, setQ] = useState('');
  const match = (p) => !q || p.name.toLowerCase().includes(q.toLowerCase());
  const candidates = useMemo(() => people.filter((p) => p.races.length > 0), []);
  const sponsors = useMemo(() => people.filter((p) => p.races.length === 0), []);
  const elected = candidates.filter((p) => p.races.some((r) => r.title));
  return (
    <div className="page people-page">
      <header className="page-head">
        <h2>People</h2>
        <p>
          A page for every candidate in a tracked race and every bill sponsor: what they said and proposed on AI, the bills
          they sponsored and how their race turned out. {candidates.length} candidates (
          {elected.length} elected in 2026) and {sponsors.length} other bill sponsors.
        </p>
        <label className="people-search">
          <span>Find a person</span>{' '}
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name" />
        </label>
      </header>
      <section>
        <h3>Candidates</h3>
        <ul className="people-list">
          {candidates.filter(match).map((p) => (
            <li key={p.id}>
              <a href={`#/person/${p.id}`}>{p.name}</a> <PartyTag party={p.party} />
              <span className="people-meta"> {p.races.map(({ race, outcome, title }) => title || `${race.office}, ${placeOf(race)}: ${outcome.label}`).join('; ')}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Bill sponsors</h3>
        <ul className="people-list">
          {sponsors.filter(match).map((p) => (
            <li key={p.id}>
              <a href={`#/person/${p.id}`}>{p.name}</a> <PartyTag party={p.party} />
              <span className="people-meta"> {p.bills.length} bill{p.bills.length > 1 ? 's' : ''} ({[...new Set(p.bills.map(({ bill }) => placeOf(bill)))].join(', ')})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default PeopleView;
