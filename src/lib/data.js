// Single entry point for the dashboard's data. Every view reads from here, so
// the "include unverified drafts" rule is applied the same way everywhere.
import codebook from '../data/codebook.json';
import legislation from '../data/legislation.json';
import international from '../data/international.json';
import geo from '../data/us-states-geo.json';

const raceModules = import.meta.glob('../data/races/*.json', { eager: true, import: 'default' });

export { codebook, geo };
export const elections = international.elections;
export const internationalNote = international.note;
export const legislationNote = legislation.note;

export const stateName = (abbr) => geo.states[abbr]?.name || abbr;

export const races = Object.values(raceModules).sort(
  (a, b) => stateName(a.state).localeCompare(stateName(b.state)) || a.office.localeCompare(b.office),
);
export const bills = legislation.bills;

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
export const labelTypes = byId(codebook.labelTypes);
export const confidenceLevels = byId(codebook.confidenceLevels);
export const itemKinds = byId(codebook.itemKinds);
export const billStatuses = byId(codebook.billStatuses);
export const dimensions = codebook.dimensions;
const dimensionById = byId(codebook.dimensions);

export function categoryLabel(dimensionId, categoryId) {
  const dim = dimensionById[dimensionId];
  return dim?.categories.find((c) => c.id === categoryId)?.label || categoryId;
}

export const isVerified = (record) => record.confidence !== 'unverified';
export const filterDrafts = (records, includeDrafts) => (includeDrafts ? records : records.filter(isVerified));

export const racesForState = (abbr) => races.filter((r) => r.state === abbr);
export const billsForState = (abbr) => bills.filter((b) => b.state === abbr);
export const raceById = (id) => races.find((r) => r.id === id);

// Party of the candidate (race items) or of the first sponsor (bills).
export function recordParty(record, race) {
  if (race) return race.candidates.find((c) => c.id === record.candidateId)?.party || 'Other';
  return record.sponsors?.[0]?.party || 'Other';
}

// Every coded record in the dataset, flattened with its context.
export function allCodedRecords(includeDrafts) {
  const out = [];
  for (const race of races) {
    for (const item of filterDrafts(race.items, includeDrafts)) {
      if (item.coding) out.push({ record: item, party: recordParty(item, race), source: 'campaign', race });
    }
  }
  for (const bill of filterDrafts(bills, includeDrafts)) {
    if (bill.coding) out.push({ record: bill, party: recordParty(bill), source: 'legislation' });
  }
  return out;
}

export function coverageForState(abbr) {
  return {
    races: racesForState(abbr).length,
    bills: billsForState(abbr).length,
  };
}

// The latest date anything in the dataset was edited, from version histories.
export const datasetUpdated = (() => {
  const dates = [];
  for (const race of races) {
    for (const rec of [...race.items, ...race.contextSignals]) dates.push(...rec.history.map((h) => h.date));
  }
  for (const bill of bills) dates.push(...bill.history.map((h) => h.date));
  return dates.sort().pop() || null;
})();

export function countRecords() {
  let total = 0;
  let verified = 0;
  for (const race of races) {
    for (const rec of [...race.items, ...race.contextSignals]) {
      total += 1;
      if (isVerified(rec)) verified += 1;
    }
  }
  for (const bill of bills) {
    total += 1;
    if (isVerified(bill)) verified += 1;
  }
  return { total, verified, drafts: total - verified };
}
