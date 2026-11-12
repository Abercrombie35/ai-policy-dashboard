// Checks every data file against the codebook and the labeling rules in the
// project proposal (section 5): each item has a label type, source, dates,
// confidence level and a version history; verified items cite a URL and a
// last-verified date. Run with: npm run validate
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../src/data/', import.meta.url).pathname;
const read = (f) => JSON.parse(readFileSync(join(root, f), 'utf8'));

const codebook = read('codebook.json');
const ids = (list) => new Set(list.map((x) => x.id));
const LABEL_TYPES = ids(codebook.labelTypes);
const CONFIDENCE = ids(codebook.confidenceLevels);
const KINDS = ids(codebook.itemKinds);
const BILL_STATUSES = ids(codebook.billStatuses);
const DIMENSIONS = Object.fromEntries(codebook.dimensions.map((d) => [d.id, d]));
const STATES = new Set(Object.keys(read('us-states-geo.json').states));
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const seenIds = new Set();
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

function checkDate(where, field, value, required = false) {
  if (value == null) {
    if (required) fail(where, `${field} is required`);
    return;
  }
  if (!DATE.test(value)) fail(where, `${field} must be YYYY-MM-DD, got "${value}"`);
}

function checkCoding(where, coding) {
  if (coding == null) return;
  for (const [key, value] of Object.entries(coding)) {
    if (['coder', 'reviewed', 'note'].includes(key)) continue;
    const dim = DIMENSIONS[key];
    if (!dim) {
      fail(where, `unknown coding dimension "${key}"`);
      continue;
    }
    const cats = ids(dim.categories);
    if (dim.multi) {
      if (!Array.isArray(value)) fail(where, `${key} must be a list`);
      else value.filter((v) => !cats.has(v)).forEach((v) => fail(where, `${key}: unknown category "${v}"`));
    } else if (value != null && !cats.has(value)) {
      fail(where, `${key}: unknown category "${value}"`);
    }
  }
  if (typeof coding.reviewed !== 'boolean') fail(where, 'coding.reviewed must be true or false');
}

// Rules shared by race items, context signals and bills.
function checkLabeledRecord(where, rec) {
  if (!rec.id) fail(where, 'missing id');
  else if (seenIds.has(rec.id)) fail(where, `duplicate id "${rec.id}"`);
  else seenIds.add(rec.id);
  if (!LABEL_TYPES.has(rec.labelType)) fail(where, `labelType "${rec.labelType}" is not in the codebook`);
  if (!CONFIDENCE.has(rec.confidence)) fail(where, `confidence "${rec.confidence}" is not in the codebook`);
  if (!rec.source || typeof rec.source !== 'object') fail(where, 'source object is required (title/url may be null for drafts)');
  checkDate(where, 'publishedDate', rec.publishedDate);
  checkDate(where, 'lastVerified', rec.lastVerified);
  if (rec.confidence !== 'unverified') {
    if (!rec.lastVerified) fail(where, 'verified records need lastVerified');
    if (!rec.source?.url) fail(where, 'verified records need source.url');
  } else if (rec.lastVerified) {
    fail(where, 'an unverified record cannot have lastVerified; set a confidence level');
  }
  if (!Number.isInteger(rec.version) || rec.version < 1) fail(where, 'version must be an integer >= 1');
  const history = rec.history || [];
  if (history.length === 0) fail(where, 'history must have at least one entry');
  else {
    const last = history[history.length - 1];
    if (last.version !== rec.version) fail(where, `latest history entry is v${last.version} but record is v${rec.version}; never overwrite silently`);
    history.forEach((h, i) => checkDate(`${where} history[${i}]`, 'date', h.date, true));
  }
  checkCoding(where, rec.coding);
}

// Races
const raceFiles = readdirSync(join(root, 'races')).filter((f) => f.endsWith('.json'));
const raceIds = new Set();
for (const file of raceFiles) {
  const race = read(join('races', file));
  const where = `races/${file}`;
  if (`${race.id}.json` !== file) fail(where, `file name must match race id "${race.id}"`);
  if (raceIds.has(race.id)) fail(where, 'duplicate race id');
  raceIds.add(race.id);
  if (!STATES.has(race.state)) fail(where, `unknown state "${race.state}"`);
  ['office', 'cycle', 'electionDate', 'candidates', 'items', 'contextSignals', 'result'].forEach((k) => {
    if (race[k] == null) fail(where, `missing ${k}`);
  });
  checkDate(where, 'electionDate', race.electionDate, true);
  const candidateIds = new Set();
  for (const c of race.candidates || []) {
    if (!c.id || !c.name || !c.party) fail(where, `candidate needs id, name and party: ${JSON.stringify(c)}`);
    if (candidateIds.has(c.id)) fail(where, `duplicate candidate id "${c.id}"`);
    candidateIds.add(c.id);
    if (!c.questionnaire?.status) fail(where, `candidate ${c.id} needs questionnaire.status`);
  }
  if (race.result?.status === 'recorded') {
    if (!candidateIds.has(race.result.winnerId)) fail(where, 'result.winnerId must be one of the candidates');
    if (!race.result.source?.url) fail(where, 'a recorded result needs source.url');
  }
  for (const [list, kindsAllowed] of [['items', null], ['contextSignals', new Set(['poll', 'market'])]]) {
    (race[list] || []).forEach((item, i) => {
      const w = `${where} ${list}[${i}] (${item.id})`;
      if (!candidateIds.has(item.candidateId)) fail(w, `candidateId "${item.candidateId}" is not in this race`);
      if (!KINDS.has(item.kind)) fail(w, `kind "${item.kind}" is not in the codebook`);
      if (kindsAllowed && !kindsAllowed.has(item.kind)) fail(w, `context signals must be poll or market, got "${item.kind}"`);
      if (!kindsAllowed && ['poll', 'market'].includes(item.kind)) fail(w, 'polls and markets belong in contextSignals');
      if (!item.text) fail(w, 'missing text');
      checkLabeledRecord(w, item);
    });
  }
}

// Legislation
const legislation = read('legislation.json');
legislation.bills.forEach((bill, i) => {
  const w = `legislation.json bills[${i}] (${bill.id})`;
  if (!STATES.has(bill.state)) fail(w, `unknown state "${bill.state}"`);
  if (!bill.billNumber || !bill.title || !bill.session) fail(w, 'needs billNumber, title and session');
  if (!BILL_STATUSES.has(bill.status)) fail(w, `status "${bill.status}" is not in the codebook`);
  checkDate(w, 'statusDate', bill.statusDate);
  (bill.sponsors || []).forEach((s) => {
    if (!s.name || !s.party) fail(w, 'each sponsor needs name and party');
  });
  checkLabeledRecord(w, bill);
});

// International
read('international.json').elections.forEach((e, i) => {
  const w = `international.json elections[${i}]`;
  if (!['candidate', 'party-manifesto'].includes(e.unit)) fail(w, 'unit must be candidate or party-manifesto');
  if (!e.country || !e.type) fail(w, 'needs country and type');
});

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Data OK: ${raceFiles.length} races, ${legislation.bills.length} bills, ${seenIds.size} labeled records.`);
