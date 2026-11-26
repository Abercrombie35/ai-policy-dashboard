// Single entry point for the dashboard's data. Every view reads from here, so
// the "include unverified drafts" rule is applied the same way everywhere.
import codebook from '../data/codebook.json';
import legislation from '../data/legislation.json';
import international from '../data/international.json';
import geo from '../data/us-states-geo.json';
import resultsData from '../data/results.json';
import researchData from '../data/candidate-research.json';
import partyLinesData from '../data/party-lines.json';
import itemCategoriesData from '../data/item-categories.json';
import europeGeoData from '../data/europe-geo.json';
import headlinesData from '../data/headlines.json';
import verificationData from '../data/verification.json';
import voterPrioritiesData from '../data/voter-priorities.json';
import publicOpinionData from '../data/public-opinion.json';
import trackersData from '../data/trackers.json';

const raceModules = import.meta.glob('../data/races/*.json', { eager: true, import: 'default' });

export { codebook, geo };
export const elections = international.elections;
export const internationalNextSteps = international.nextSteps;
export const europeGeo = europeGeoData;
export const countryName = (code) => europeGeoData.countries[code]?.name || code;
export const electionsForCountry = (code) => international.elections.filter((e) => e.countryCode === code);
export const internationalNote = international.note;
export const legislationNote = legislation.note;
export const partyLines = partyLinesData;

export const stateName = (abbr) => (abbr === 'US' ? 'Federal' : geo.states[abbr]?.name || abbr);

// Where a record or race belongs. U.S. records carry a state code ("US" for
// federal); records outside the U.S. carry a country code ("EU" for European
// Union law). Country keys get a prefix because some codes are also state
// codes (DE is Delaware and Germany).
export const isInternational = (rec) => rec?.country != null;
export const jurisdictionKey = (rec) => (isInternational(rec) ? `intl-${rec.country}` : rec.state);
export function jurisdictionLabel(key) {
  if (!key?.startsWith('intl-')) return stateName(key);
  const code = key.slice(5);
  return code === 'EU' ? 'European Union' : countryName(code);
}
export const placeOf = (rec) => jurisdictionLabel(jurisdictionKey(rec));

// Within a state: U.S. Senate, then U.S. House (e.g. "U.S. House (CT-4)"), then governor.
const OFFICE_ORDER = ['U.S. Senate', 'U.S. House', 'Governor'];
export const officeType = (office) => OFFICE_ORDER.find((o) => office.startsWith(o)) || office;
const officeRank = (office) => {
  const i = OFFICE_ORDER.indexOf(officeType(office));
  return i === -1 ? OFFICE_ORDER.length : i;
};
// U.S. races first, then races abroad.
export const races = Object.values(raceModules).sort(
  (a, b) =>
    Number(isInternational(a)) - Number(isInternational(b)) ||
    placeOf(a).localeCompare(placeOf(b)) ||
    officeRank(a.office) - officeRank(b.office) ||
    a.office.localeCompare(b.office),
);
export const bills = legislation.bills;
// The U.S. party analysis (party lines, party comparison, breakdowns by
// Democratic and Republican) covers U.S. races and bills only.
export const usRaces = races.filter((r) => !isInternational(r));
export const usBills = bills.filter((b) => !isInternational(b));
export const racesForCountry = (code) => races.filter((r) => r.country === code);

// Polls on voters' priorities (voter-priorities.json): which issues mattered
// most in each race's state or country, and any poll that asked about AI.
export const voterPriorities = voterPrioritiesData;
export const pollsForRace = (race) => voterPrioritiesData.polls.filter((p) => (p.races || []).includes(race.id));
export const pollsForPlace = ({ state, country }) =>
  voterPrioritiesData.polls.filter((p) => (state && p.state === state) || (country && p.country === country));
// Gallup and Pew findings on AI by party (public-opinion.json).
export const publicOpinion = publicOpinionData;
// The IAPP, NCSL and MultiState legislation trackers (trackers.json): their
// terms of use and the counts they publish, for comparison with this dataset.
export const trackers = trackersData;
export const trackerName = (id) => trackersData.trackers[id]?.short || id;
// Laws that apply in a country: its own, plus EU law for EU member states.
export const billsForCountry = (code) =>
  bills.filter((b) => b.country === code || (b.country === 'EU' && europeGeoData.countries[code]?.eu));
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
export const proposalCategories = codebook.proposalCategories;
// Outside the U.S., candidates are compared by political bloc (left to far
// right) instead of against a U.S. party line.
export const blocs = byId(codebook.blocs || []);
export const BLOC_IDS = (codebook.blocs || []).map((b) => b.id);
export const categoryById = byId(codebook.proposalCategories);
export const categoriesInDomain = (domainId) => codebook.proposalCategories.filter((c) => c.domain === domainId);
// A record's categories: its own, or (for items stored in the race files,
// which are never edited) the separate lookup in item-categories.json.
export const categoriesOf = (record) => record.categories || itemCategoriesData.assignments[record.id] || [];

// The first of a record's categories that belongs to the given policy area;
// used to place each record under one heading.
export const primaryCategory = (record, domainId) =>
  categoriesOf(record).find((c) => categoryById[c]?.domain === domainId) || null;
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

// The central point of a record in a few words, for the large text on policy
// boxes: a written headline, a bill's title, or the record's own text.
export const headlineOf = (record) => headlinesData.headlines[record.id] || record.title || record.text;

export const isVerified = (record) => record.confidence !== 'unverified';

// Checks of each claim against other published reports (verification.json).
// Keys are record ids; party-line evidence uses "<position id>#<index>".
export const verification = verificationData;
export const CHECK_RESULTS = {
  confirmed: { label: 'Confirmed', short: null, description: 'Confirmed by other published reports.' },
  corrected: { label: 'Corrected', short: 'Corrected after checking', description: 'A detail was wrong and has been corrected from other published reports.' },
  'partly-confirmed': { label: 'Partly confirmed', short: 'Partly verified', description: 'The main point is confirmed by other reports; some details are not.' },
  'not-confirmed': { label: 'Not confirmed', short: 'Not independently verified', description: 'No other published report confirming this was found. Treat with caution.' },
  contradicted: { label: 'Contradicted', short: 'Contradicted by other reports', description: 'Other published reports contradict this. It is an early draft that is kept unchanged; see the note for what they say.' },
  'not-checked': { label: 'Not yet checked', short: 'Not independently verified', description: 'Not yet checked against other published reports (the search limit for this round of checks was reached).' },
  'not-checkable': { label: 'Not a checkable fact', short: 'Opinion or projection, not verifiable', description: 'An opinion, judgment or projection rather than a fact, so it cannot be verified.' },
};
export const checkOf = (id) => verificationData.checks[id] || null;
// Counts of factual claims checked and confirmed (or corrected), for the home page.
export function checkSummary() {
  const all = Object.values(verificationData.checks).filter((c) => c.result !== 'not-checkable');
  const ok = (c) => c.result === 'confirmed' || c.result === 'corrected';
  return {
    total: all.length,
    confirmed: all.filter(ok).length,
    // High confidence: wording and date checked against the primary source.
    primary: all.filter((c) => ok(c) && c.level === 'high').length,
  };
}
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
export const itemsForRace = (race) => [...(race.items || []), ...researchRecords.filter((r) => r.raceId === race.id)];

// Election results live in results.json, separate from the race files.
export const results = resultsData.results;
export function resultForRace(raceId, includeDrafts) {
  const result = results.find((r) => r.raceId === raceId);
  if (!result) return null;
  return includeDrafts || isVerified(result) ? result : null;
}
export const hasHiddenResult = (raceId, includeDrafts) =>
  !includeDrafts && results.some((r) => r.raceId === raceId && !isVerified(r));

// The bloc behind a record abroad: the candidate's, or the bill sponsors' if
// they share one. Used to tint policy boxes.
export function blocOf(record, candidate) {
  if (candidate) return candidate.bloc || null;
  const set = new Set((record.sponsors || []).map((s) => s.bloc).filter(Boolean));
  return set.size === 1 ? [...set][0] : null;
}

// Party of the candidate (race items) or of the first sponsor (bills).
export function recordParty(record, race) {
  if (race) return race.candidates.find((c) => c.id === record.candidateId)?.party || 'Other';
  return record.sponsors?.[0]?.party || 'Other';
}

// Every coded record in the dataset, flattened with its context.
export function allCodedRecords(includeDrafts) {
  const out = [];
  for (const race of usRaces) {
    for (const item of filterDrafts(itemsForRace(race), includeDrafts)) {
      if (item.coding) out.push({ record: item, party: recordParty(item, race), source: 'campaign', race });
    }
  }
  for (const bill of filterDrafts(usBills, includeDrafts)) {
    if (bill.coding) out.push({ record: bill, party: recordParty(bill), source: 'legislation' });
  }
  return out;
}

// Which side a bill comes from: one party, both (bipartisan), or unrecorded.
export function billParty(bill) {
  const parties = new Set((bill.sponsors || []).map((s) => s.party));
  if (parties.size === 0) return 'Sponsor not recorded';
  if (parties.has('Democratic') && parties.has('Republican')) return 'Bipartisan';
  return parties.size === 1 ? [...parties][0] : 'Other';
}

// Proposed policies: bills (including proposed moratoriums) and candidates'
// concrete proposals and official actions, each with its source. By default
// U.S. only; with a state, that state plus federal; with a country, that
// country plus EU law where it applies.
export function proposals(includeDrafts, { state, country } = {}) {
  const out = [];
  const billList = country ? billsForCountry(country) : usBills;
  const raceList = country ? racesForCountry(country) : usRaces;
  for (const bill of filterDrafts(billList, includeDrafts)) {
    if (state && bill.state !== state && bill.state !== 'US') continue;
    out.push({
      id: bill.id,
      type: 'bill',
      record: bill,
      jurisdiction: jurisdictionKey(bill),
      title: `${bill.billNumber}: ${bill.title}`,
      who: bill.sponsors.map((s) => `${s.name} (${s.party[0]})`).join(', ') || bill.sponsorsNote || 'Sponsors to verify',
      date: bill.statusDate,
      domains: domainsOf(bill),
      party: billParty(bill),
      bloc: blocOf(bill),
      isMoratorium: categoriesOf(bill).includes('dc-moratorium'),
    });
  }
  for (const race of raceList) {
    if (state && race.state !== state) continue;
    for (const rec of filterDrafts(itemsForRace(race), includeDrafts)) {
      if (trackOf(rec) !== 'proposed') continue;
      const candidate = race.candidates.find((c) => c.id === rec.candidateId);
      out.push({
        id: rec.id,
        type: 'candidate',
        record: rec,
        race,
        candidate,
        jurisdiction: jurisdictionKey(race),
        title: rec.text,
        who: `${candidate?.name} (${candidate?.party[0]}), ${race.office} candidate`,
        date: rec.publishedDate,
        domains: domainsOf(rec),
        party: candidate?.party || 'Other',
        bloc: candidate?.bloc || null,
        isMoratorium: categoriesOf(rec).includes('dc-moratorium'),
      });
    }
  }
  return out.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

// Every categorized record (candidate statements, proposals and actions, and
// bills) with its party, jurisdiction, track and policy areas, for the
// category breakdowns.
export function categorizedRecords(includeDrafts) {
  const out = [];
  for (const race of usRaces) {
    for (const rec of filterDrafts(itemsForRace(race), includeDrafts)) {
      if (!rec.coding || categoriesOf(rec).length === 0) continue;
      out.push({ record: rec, party: recordParty(rec, race), jurisdiction: race.state, track: trackOf(rec), domains: domainsOf(rec), kind: 'candidate' });
    }
  }
  for (const bill of filterDrafts(usBills, includeDrafts)) {
    out.push({ record: bill, party: billParty(bill), jurisdiction: bill.state, track: 'proposed', domains: domainsOf(bill), kind: 'bill' });
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
