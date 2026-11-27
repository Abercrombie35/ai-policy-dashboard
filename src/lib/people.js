// People (AIPD-301): every candidate in a tracked race and every bill sponsor,
// with what they said and proposed, the bills they sponsored and how their
// race turned out. Derived from the race, record, bill and result files, so a
// person page can never disagree with the rest of the site.
import { races, bills, results, itemsForRace, placeOf, isInternational, officeType } from './data';

export const personSlug = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const TITLES = { 'U.S. Senate': 'Senator', Governor: 'Governor', 'U.S. House': 'Representative', President: 'President' };

function outcome(race, candidate) {
  const result = results.find((r) => r.raceId === race.id);
  if (!result || race.status === 'upcoming') return { kind: 'running', label: 'Candidate' };
  const won = result.winner?.candidateId === candidate.id || result.winner?.name === candidate.name;
  const status = result.resultStatus === 'certified' ? 'certified result' : 'unofficial result';
  return won ? { kind: 'won', label: `Won (${status})` } : { kind: 'lost', label: `Lost (${status})` };
}

function build() {
  const people = new Map();
  const get = (id, name, party) => {
    if (!people.has(id)) people.set(id, { id, name, party: party || null, races: [], bills: [] });
    const p = people.get(id);
    if (!p.party && party) p.party = party;
    return p;
  };
  for (const race of races) {
    for (const c of race.candidates || []) {
      const p = get(c.id, c.name, c.party);
      const o = outcome(race, c);
      const type = officeType(race.office) || race.office;
      p.races.push({
        race,
        candidate: c,
        outcome: o,
        // "Senator-elect (Michigan)" for winners; the race itself otherwise.
        title: o.kind === 'won' ? `${TITLES[type] || type}-elect, ${placeOf(race)}` : null,
      });
    }
  }
  for (const bill of bills) {
    for (const s of bill.sponsors || []) {
      const id = s.linkedCandidateId || personSlug(s.name);
      get(id, s.name, s.party).bills.push({ bill, role: s.role });
    }
  }
  return people;
}

const PEOPLE = build();
export const people = [...PEOPLE.values()].sort((a, b) => a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0]) || a.name.localeCompare(b.name));
export const personById = (id) => PEOPLE.get(id) || null;
export const personIdFor = (name, candidateId) => candidateId || personSlug(name);

// Statements, plans and actions recorded for a person, across their races.
export function recordsForPerson(person) {
  return person.races.flatMap(({ race, candidate }) => itemsForRace(race).filter((r) => r.candidateId === candidate.id));
}

export const isAbroad = (person) => person.races.some(({ race }) => isInternational(race));
