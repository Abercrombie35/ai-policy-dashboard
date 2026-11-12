// Single entry point for the dashboard's data. Every view reads from here, so
// the "include unverified drafts" rule is applied the same way everywhere.
import codebook from '../data/codebook.json';
import legislation from '../data/legislation.json';
import international from '../data/international.json';
import geo from '../data/us-states-geo.json';
import resultsData from '../data/results.json';
import researchData from '../data/candidate-research.json';
import partyLinesData from '../data/party-lines.json';

const raceModules = import.meta.glob('../data/races/*.json', { eager: true, import: 'default' });

export { codebook, geo };
export const elections = international.elections;
export const internationalNote = international.note;
export const legislationNote = legislation.note;
export const partyLines = partyLinesData;

export const stateName = (abbr) => (abbr === 'US' ? 'Federal' : geo.states[abbr]?.name || abbr);

// Senate races are listed before governor races within a state.
const OFFICE_ORDER = ['U.S. Senate', 'Governor'];
const officeRank = (office) => (OFFICE_ORDER.includes(office) ? OFFICE_ORDER.indexOf(office) : OFFICE_ORDER.length);
export const races = Object.values(raceModules).sort(
  (a, b) =>
    stateName(a.state).localeCompare(stateName(b.state)) ||
    officeRank(a.office) - officeRank(b.office) ||
    a.office.localeCompare(b.office),
);
export const bills = legislation.bills;
export const researchRecords = researchData.records;

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
export const labelTypes = byId(codebook.labelTypes);
export const confidenceLevels = byId(codebook.confidenceLevels);
export const itemKinds = byId(codebook.itemKinds);
export const billStatuses = byId(codebook.billStatuses);
export const dimensions = codebook.dimensions;
export const resultLabel = codebook.resultLabel;
export const resultStatuses = byId(codebook.resultStatuses);
export const policyQuestions = codebook.policyQuestions;
export const questionById = byId(codebook.policyQuestions);
export const tracks = byId(codebook.tracks);
export const domains = byId(codebook.domains);
export const DOMAIN_IDS = codebook.domains.map((d) => d.id);
export const TRACK_IDS = codebook.tracks.map((t) => t.id);

// Label metadata for any record: the six statement labels, or the separate
// election-result label.
export const labelInfo = (id) => labelTypes[id] || (id === resultLabel.id ? resultLabel : null);
const dimensionById = byId(codebook.dimensions);

export function categoryLabel(dimensionId, categoryId) {
  const dim = dimensionById[dimensionId];
  return dim?.categories.find((c) => c.id === categoryId)?.label || categoryId;
}

export const stanceLabel = (questionId, optionId) =>
  questionById[questionId]?.options.find((o) => o.id === optionId)?.label || optionId;

export const isVerified = (record) => record.confidence !== 'unverified';
export const filterDrafts = (records, includeDrafts) => (includeDrafts ? records : records.filter(isVerified));

// "Said" (rhetoric, stated principles) vs "proposed" (concrete proposals and
// official actions), derived from the codebook's specificity coding.
export function trackOf(record) {
  const specificity = record.coding?.specificity;
  if (!specificity) return null;
  return codebook.tracks.find((t) => t.specificity.includes(specificity))?.id || null;
}

// Which of the two policy areas a record belongs to. Records with stances
// belong to the areas of those stances (a few span both, such as a data
// center plan that also sets child-safety liability). Otherwise anything
// coded with the data center issue area is data center policy, and all other
// coded records are general AI policy, so the two areas stay distinct.
export function domainsOf(record) {
  const questions = Object.keys(record.stances || {});
  if (questions.length) {
    return codebook.domains.filter((d) => questions.some((q) => d.policyQuestions.includes(q))).map((d) => d.id);
  }
  if (!record.coding) return [];
  const areas = record.coding.issueAreas || [];
  const dc = codebook.domains.find((d) => d.id === 'data-centers');
  return [areas.some((a) => dc.issueAreas.includes(a)) ? 'data-centers' : 'ai-general'];
}

export const domainOfQuestion = (questionId) => codebook.domains.find((d) => d.policyQuestions.includes(questionId))?.id;

export const racesForState = (abbr) => races.filter((r) => r.state === abbr);
export const billsForState = (abbr) => bills.filter((b) => b.state === abbr);
export const raceById = (id) => races.find((r) => r.id === id);

// A race's records: the race file's own items plus researched records, which
// are stored separately so the race files are never edited.
export const itemsForRace = (race) => [...race.items, ...researchRecords.filter((r) => r.raceId === race.id)];

// Election results live in results.json, separate from the race files.
export const results = resultsData.results;
export function resultForRace(raceId, includeDrafts) {
  const result = results.find((r) => r.raceId === raceId);
  if (!result) return null;
  return includeDrafts || isVerified(result) ? result : null;
}
export const hasHiddenResult = (raceId, includeDrafts) =>
  !includeDrafts && results.some((r) => r.raceId === raceId && !isVerified(r));

// Party of the candidate (race items) or of the first sponsor (bills).
export function recordParty(record, race) {
  if (race) return race.candidates.find((c) => c.id === record.candidateId)?.party || 'Other';
  return record.sponsors?.[0]?.party || 'Other';
}

// Every coded record in the dataset, flattened with its context.
export function allCodedRecords(includeDrafts) {
  const out = [];
  for (const race of races) {
    for (const item of filterDrafts(itemsForRace(race), includeDrafts)) {
      if (item.coding) out.push({ record: item, party: recordParty(item, race), source: 'campaign', race });
    }
  }
  for (const bill of filterDrafts(bills, includeDrafts)) {
    if (bill.coding) out.push({ record: bill, party: recordParty(bill), source: 'legislation' });
  }
  return out;
}

// Proposed policies: bills (including proposed moratoriums) and candidates'
// concrete proposals and official actions, each with its source.
export function proposals(includeDrafts, { state } = {}) {
  const out = [];
  for (const bill of filterDrafts(bills, includeDrafts)) {
    if (state && bill.state !== state && bill.state !== 'US') continue;
    out.push({
      id: bill.id,
      type: 'bill',
      record: bill,
      jurisdiction: bill.state,
      title: `${bill.billNumber}: ${bill.title}`,
      who: bill.sponsors.map((s) => `${s.name} (${s.party[0]})`).join(', ') || bill.sponsorsNote || 'Sponsors to verify',
      date: bill.statusDate,
      domains: domainsOf(bill),
      isMoratorium: (bill.tags || []).some((t) => t === 'moratorium' || t === 'ban'),
    });
  }
  for (const race of races) {
    if (state && race.state !== state) continue;
    for (const rec of filterDrafts(itemsForRace(race), includeDrafts)) {
      if (trackOf(rec) !== 'proposed') continue;
      const candidate = race.candidates.find((c) => c.id === rec.candidateId);
      out.push({
        id: rec.id,
        type: 'candidate',
        record: rec,
        race,
        jurisdiction: race.state,
        title: rec.text,
        who: `${candidate?.name} (${candidate?.party[0]}), ${race.office} candidate`,
        date: rec.publishedDate,
        domains: domainsOf(rec),
        isMoratorium: rec.stances?.['data-centers'] === 'pause',
      });
    }
  }
  return out.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
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
    for (const rec of [...itemsForRace(race), ...race.contextSignals]) dates.push(...rec.history.map((h) => h.date));
  }
  for (const rec of [...bills, ...results, ...partyLinesData.positions]) dates.push(...rec.history.map((h) => h.date));
  return dates.sort().pop() || null;
})();

// Counts by confidence. "Sourced" means the record cites a source and has been
// checked at least once; "drafts" are unverified prototype records.
export function countRecords() {
  const all = [...bills, ...partyLinesData.positions];
  for (const race of races) all.push(...itemsForRace(race), ...race.contextSignals);
  const byConfidence = {};
  for (const rec of all) byConfidence[rec.confidence] = (byConfidence[rec.confidence] || 0) + 1;
  const drafts = byConfidence.unverified || 0;
  return { total: all.length, sourced: all.length - drafts, drafts, byConfidence };
}
