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
const RESULT_LABEL = codebook.resultLabel.id;
const RESULT_STATUSES = ids(codebook.resultStatuses);
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

// Rules shared by race items, context signals, bills and election results.
function checkLabeledRecord(where, rec, allowedLabels = LABEL_TYPES) {
  if (!rec.id) fail(where, 'missing id');
  else if (seenIds.has(rec.id)) fail(where, `duplicate id "${rec.id}"`);
  else seenIds.add(rec.id);
  if (!allowedLabels.has(rec.labelType)) fail(where, `labelType "${rec.labelType}" is not allowed here`);
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
const raceCandidates = {};
for (const file of raceFiles) {
  const race = read(join('races', file));
  const where = `races/${file}`;
  if (`${race.id}.json` !== file) fail(where, `file name must match race id "${race.id}"`);
  if (raceIds.has(race.id)) fail(where, 'duplicate race id');
  raceIds.add(race.id);
  if (!STATES.has(race.state)) fail(where, `unknown state "${race.state}"`);
  ['office', 'cycle', 'electionDate', 'candidates', 'items', 'contextSignals'].forEach((k) => {
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
  raceCandidates[race.id] = candidateIds;
  // Results are separately labeled records in results.json. The old
  // per-race "result" field is only a placeholder.
  if (race.result && race.result.status !== 'not-recorded') {
    fail(where, 'record election results in results.json, not in the race file');
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

// Election results (separate label)
const results = read('results.json').results;
const resultRaces = new Set();
results.forEach((r, i) => {
  const w = `results.json results[${i}] (${r.id})`;
  checkLabeledRecord(w, r, new Set([RESULT_LABEL]));
  if (!raceIds.has(r.raceId)) fail(w, `raceId "${r.raceId}" has no race file`);
  if (resultRaces.has(r.raceId)) fail(w, 'only one result record per race; add a new version instead');
  resultRaces.add(r.raceId);
  if (!RESULT_STATUSES.has(r.resultStatus)) fail(w, `resultStatus "${r.resultStatus}" is not in the codebook`);
  const known = raceCandidates[r.raceId] || new Set();
  const names = new Set();
  let total = 0;
  (r.candidates || []).forEach((c) => {
    if (!c.name || !c.party) fail(w, 'each result candidate needs name and party');
    if (c.candidateId != null && !known.has(c.candidateId)) fail(w, `candidateId "${c.candidateId}" is not in the race`);
    if (c.votePct != null && (typeof c.votePct !== 'number' || c.votePct < 0 || c.votePct > 100)) fail(w, `votePct for ${c.name} must be 0-100`);
    if (c.votes != null && !Number.isInteger(c.votes)) fail(w, `votes for ${c.name} must be a whole number`);
    total += c.votePct || 0;
    names.add(c.name);
  });
  if (total > 100.5) fail(w, `vote shares add up to ${total.toFixed(1)}%`);
  if (!r.winner?.name || !names.has(r.winner.name)) fail(w, 'winner must be one of the listed result candidates');
  if (r.winner?.candidateId != null && !known.has(r.winner.candidateId)) fail(w, 'winner.candidateId is not in the race');
  if (!r.figuresAsOf) fail(w, 'figuresAsOf is required: say when and where the figures were taken');
  (r.additionalSources || []).forEach((s) => {
    if (!s.url) fail(w, 'each additional source needs a url');
  });
  if (r.resultStatus === 'certified' && r.confidence !== 'high') fail(w, 'a certified result should cite the official canvass with high confidence');
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
console.log(`Data OK: ${raceFiles.length} races, ${results.length} election results, ${legislation.bills.length} bills, ${seenIds.size} labeled records.`);
