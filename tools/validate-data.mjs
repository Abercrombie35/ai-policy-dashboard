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
// Publication, status and evidence dates may be partial (year or year-month).
const PARTIAL_DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const QUESTIONS = Object.fromEntries(codebook.policyQuestions.map((q) => [q.id, ids(q.options)]));
const PARTIES = new Set(['Republican', 'Democratic']);
const EUROPE = new Set(Object.keys(read('europe-geo.json').countries));
// "US" marks federal bills.
const JURISDICTIONS = new Set([...Object.keys(read('us-states-geo.json').states), 'US']);
// Outside the U.S., records name a country on the Europe map, or "EU" for
// European Union law.
const COUNTRIES = new Set([...EUROPE, 'EU']);
const BLOCS = ids(codebook.blocs || []);
const QUESTION_SCOPE = Object.fromEntries(codebook.policyQuestions.map((q) => [q.id, q.scope || 'all']));

const errors = [];
const seenIds = new Set();
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

function checkDate(where, field, value, required = false, partial = false) {
  if (value == null) {
    if (required) fail(where, `${field} is required`);
    return;
  }
  if (partial ? !PARTIAL_DATE.test(value) : !DATE.test(value)) {
    fail(where, `${field} must be ${partial ? 'YYYY, YYYY-MM or ' : ''}YYYY-MM-DD, got "${value}"`);
  }
}

// Proposal categories and the two policy areas, mirroring src/lib/data.js:
// records with stances belong to the areas of those stances; otherwise the
// data center issue area means data centers, anything else general AI.
const CATEGORIES = Object.fromEntries(codebook.proposalCategories.map((c) => [c.id, c]));
const PROPOSED_SPECIFICITY = new Set(codebook.tracks.find((t) => t.id === 'proposed').specificity);
function domainsOf(rec) {
  const qs = Object.keys(rec.stances || {});
  if (qs.length) return new Set(codebook.domains.filter((d) => qs.some((q) => d.policyQuestions.includes(q))).map((d) => d.id));
  if (!rec.coding) return new Set();
  const dc = codebook.domains.find((d) => d.id === 'data-centers');
  return new Set([(rec.coding.issueAreas || []).some((a) => dc.issueAreas.includes(a)) ? 'data-centers' : 'ai-general']);
}
function checkCategories(where, rec, required) {
  const cats = rec.categories || [];
  if (required && cats.length === 0) fail(where, 'proposals need at least one category so they can be grouped');
  const areas = domainsOf(rec);
  cats.forEach((c) => {
    if (!CATEGORIES[c]) fail(where, `unknown category "${c}"`);
    else if (!areas.has(CATEGORIES[c].domain)) fail(where, `category "${c}" belongs to ${CATEGORIES[c].domain}, but this record is in ${[...areas].join(', ') || 'no policy area'}`);
  });
}

function checkStances(where, stances) {
  if (stances == null) return;
  for (const [q, option] of Object.entries(stances)) {
    if (!QUESTIONS[q]) fail(where, `unknown policy question "${q}"`);
    else if (!QUESTIONS[q].has(option)) fail(where, `${q}: unknown stance "${option}"`);
  }
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
  checkDate(where, 'publishedDate', rec.publishedDate, false, true);
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
  checkStances(where, rec.stances);
}

// Races
const raceFiles = readdirSync(join(root, 'races')).filter((f) => f.endsWith('.json'));
const raceIds = new Set();
const raceCandidates = {};
const raceCountry = {};
for (const file of raceFiles) {
  const race = read(join('races', file));
  const where = `races/${file}`;
  if (`${race.id}.json` !== file) fail(where, `file name must match race id "${race.id}"`);
  if (raceIds.has(race.id)) fail(where, 'duplicate race id');
  raceIds.add(race.id);
  // A race is in a U.S. state or, outside the U.S., in a country.
  if (race.country != null) {
    if (race.state != null) fail(where, 'give a state or a country, not both');
    if (!EUROPE.has(race.country)) fail(where, `country "${race.country}" is not on the Europe map`);
    checkDate(where, 'runoffDate', race.runoffDate);
    if (race.status !== 'upcoming' && race.status !== 'held') fail(where, 'international races need status "upcoming" or "held"');
    (race.contextNotes || []).forEach((n, i) => {
      if (!n.text || !n.source?.url) fail(`${where} contextNotes[${i}]`, 'needs text and a source URL');
      checkDate(`${where} contextNotes[${i}]`, 'publishedDate', n.publishedDate, false, true);
    });
  } else if (!STATES.has(race.state)) fail(where, `unknown state "${race.state}"`);
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
    // Outside the U.S., candidates are placed on a left-right bloc for comparison.
    if (race.country != null && !BLOCS.has(c.bloc)) fail(where, `candidate ${c.id} needs a bloc from the codebook`);
    if (c.bloc != null && !BLOCS.has(c.bloc)) fail(where, `candidate ${c.id}: unknown bloc "${c.bloc}"`);
    checkDate(where, `candidate ${c.id} withdrawn`, c.withdrawn);
  }
  raceCandidates[race.id] = candidateIds;
  raceCountry[race.id] = race.country || null;
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
  if (bill.country != null) {
    if (bill.state != null) fail(w, 'give a state or a country, not both');
    if (!COUNTRIES.has(bill.country)) fail(w, `unknown country "${bill.country}" (use a code on the Europe map, or EU)`);
  } else if (!JURISDICTIONS.has(bill.state)) fail(w, `unknown jurisdiction "${bill.state}" (use a state code or US)`);
  if (!bill.billNumber || !bill.title || !bill.session) fail(w, 'needs billNumber, title and session');
  if (!BILL_STATUSES.has(bill.status)) fail(w, `status "${bill.status}" is not in the codebook`);
  checkDate(w, 'statusDate', bill.statusDate, false, true);
  if (!bill.coding?.specificity) fail(w, 'bills need coding.specificity so they can be sorted into said / proposed');
  (bill.sponsors || []).forEach((s) => {
    if (!s.name || !s.party) fail(w, 'each sponsor needs name and party');
    if (s.bloc != null && !BLOCS.has(s.bloc)) fail(w, `unknown bloc "${s.bloc}"`);
  });
  checkLabeledRecord(w, bill);
  checkCategories(w, bill, true);
});

// Candidate research records (kept apart from the race files)
const raceItemsById = {};
read('candidate-research.json').records.forEach((rec, i) => {
  const w = `candidate-research.json records[${i}] (${rec.id})`;
  if (!raceIds.has(rec.raceId)) fail(w, `raceId "${rec.raceId}" has no race file`);
  else if (!raceCandidates[rec.raceId].has(rec.candidateId)) fail(w, `candidateId "${rec.candidateId}" is not in ${rec.raceId}`);
  if (!KINDS.has(rec.kind) || ['poll', 'market'].includes(rec.kind)) fail(w, `kind "${rec.kind}" is not allowed here`);
  if (!rec.text) fail(w, 'missing text');
  if (!rec.coding?.specificity) fail(w, 'research records need coding.specificity so they can be sorted into said / proposed');
  if (!rec.publishedDate && !rec.dateNote) fail(w, 'give publishedDate or a dateNote explaining when');
  // U.S.-only questions (such as federal preemption) do not apply abroad.
  for (const q of Object.keys(rec.stances || {})) {
    if (raceCountry[rec.raceId] && QUESTION_SCOPE[q] === 'us') fail(w, `policy question "${q}" applies only to U.S. races`);
  }
  if (!rec.publishedDate && !rec.sortDate) fail(w, 'undated records need an approximate sortDate for the timeline');
  checkDate(w, 'sortDate', rec.sortDate, false, true);
  checkLabeledRecord(w, rec);
  // Every researched record is categorized, statements as well as proposals.
  checkCategories(w, rec, true);
  raceItemsById[rec.id] = rec;
});

// Categories for coded items stored in the race files (kept in a separate
// lookup so the race files are never edited). Every coded statement, position,
// action or stance summary must be categorized.
const itemCategories = read('item-categories.json').assignments;
const raceItemIndex = {};
for (const file of raceFiles) {
  for (const item of read(join('races', file)).items || []) raceItemIndex[item.id] = item;
}
for (const [id, cats] of Object.entries(itemCategories)) {
  const w = `item-categories.json ${id}`;
  const item = raceItemIndex[id];
  if (!item) fail(w, 'no race item has this id');
  else if (!item.coding) fail(w, 'item has no coding, so it has no policy area to categorize');
  else checkCategories(w, { ...item, categories: cats }, true);
}
for (const item of Object.values(raceItemIndex)) {
  if (item.coding && ['statement', 'position', 'action', 'stance'].includes(item.kind) && !itemCategories[item.id] && !item.categories) {
    fail(`race item ${item.id}`, 'coded item has no categories (add them to item-categories.json)');
  }
}

// Headlines shown on policy boxes: one per researched record, no strays.
const headlines = read('headlines.json').headlines;
for (const id of Object.keys(headlines)) {
  if (!raceItemsById[id]) fail(`headlines.json ${id}`, 'no researched record has this id');
}
for (const id of Object.keys(raceItemsById)) {
  if (!headlines[id]) fail(`candidate-research.json ${id}`, 'needs a headline in headlines.json');
}

// Party lines
const partyLines = read('party-lines.json');
const seenLines = new Set();
partyLines.positions.forEach((pos, i) => {
  const w = `party-lines.json positions[${i}] (${pos.id})`;
  if (!PARTIES.has(pos.party)) fail(w, `party must be Republican or Democratic, got "${pos.party}"`);
  if (!QUESTIONS[pos.questionId]) fail(w, `unknown policy question "${pos.questionId}"`);
  else if (pos.stance != null && !QUESTIONS[pos.questionId].has(pos.stance)) fail(w, `unknown stance "${pos.stance}"`);
  const key = `${pos.party}:${pos.questionId}`;
  if (seenLines.has(key)) fail(w, `duplicate party line for ${key}`);
  seenLines.add(key);
  if (!pos.summary) fail(w, 'missing summary');
  if (!pos.evidence?.length) fail(w, 'a party line needs at least one piece of evidence');
  (pos.evidence || []).forEach((e, j) => {
    checkDate(`${w} evidence[${j}]`, 'date', e.date, false, true);
    if (!['said', 'proposed'].includes(e.track)) fail(`${w} evidence[${j}]`, 'track must be said or proposed');
    if (!e.source?.url) fail(`${w} evidence[${j}]`, 'evidence needs source.url');
  });
  checkLabeledRecord(w, pos);
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

// Voter priorities: published polls on which issues mattered most to voters
// in each tracked race's state or country, and polls that asked about AI.
const voterPolls = read('voter-priorities.json').polls;
const POLL_TYPES = new Set(['single', 'up-to-three', 'importance-rating']);
const pctOk = (v) => typeof v === 'number' && v >= 0 && v <= 100;
voterPolls.forEach((p, i) => {
  const w = `voter-priorities.json polls[${i}] (${p.id})`;
  checkLabeledRecord(w, p, new Set(['reported-fact']));
  if (p.state != null && p.country != null) fail(w, 'give a state or a country, not both');
  if (p.state != null && !STATES.has(p.state)) fail(w, `unknown state "${p.state}"`);
  if (p.country != null && !EUROPE.has(p.country)) fail(w, `country "${p.country}" is not on the Europe map`);
  if (p.state == null && p.country == null) fail(w, 'needs a state or a country');
  if (!p.pollster || !p.question) fail(w, 'needs pollster and question wording');
  checkDate(w, 'fieldStart', p.fieldStart, false, true);
  checkDate(w, 'fieldEnd', p.fieldEnd, false, true);
  if (!p.source?.url) fail(w, 'needs a source URL');
  (p.races || []).forEach((r) => {
    if (!raceIds.has(r)) fail(w, `race "${r}" has no race file`);
  });
  if (!(p.races || []).length) fail(w, 'list the races this poll is shown on');
  if (p.kind === 'issue-priorities') {
    if (!POLL_TYPES.has(p.questionType)) fail(w, `questionType must be one of ${[...POLL_TYPES].join(', ')}`);
    if (!Array.isArray(p.issues) || p.issues.length < 3) fail(w, 'an issue poll needs at least three issues');
    (p.issues || []).forEach((x) => {
      if (!x.issue || !pctOk(x.pct)) fail(w, `each issue needs a name and a share from 0 to 100: ${JSON.stringify(x)}`);
    });
    if ((p.issues || []).filter((x) => x.ai).length > 1) fail(w, 'mark at most one issue as the AI or data center option');
    if (![true, false, null].includes(p.aiOffered)) fail(w, 'aiOffered must be true, false or null (unknown)');
    if ((p.issues || []).some((x) => x.ai) && p.aiOffered !== true) fail(w, 'aiOffered must be true when an issue is marked as AI');
    const sum = (p.issues || []).reduce((a, x) => a + (x.pct || 0), 0);
    if (p.questionType === 'single' && sum > 100.5) fail(w, `single-choice shares add up to ${sum.toFixed(1)}%`);
  } else if (p.kind === 'ai-question') {
    if (!Array.isArray(p.figures) || p.figures.length === 0) fail(w, 'an AI question needs at least one figure');
    (p.figures || []).forEach((f) => {
      if (!f.label || !pctOk(f.pct)) fail(w, `each figure needs a label and a share from 0 to 100: ${JSON.stringify(f)}`);
    });
  } else fail(w, 'kind must be issue-priorities or ai-question');
});

// Gallup and Pew findings by party.
const opinion = read('public-opinion.json');
const ORGS = new Set(['Gallup', 'Pew']);
opinion.findings.forEach((f, i) => {
  const w = `public-opinion.json findings[${i}] (${f.id})`;
  checkLabeledRecord(w, f, new Set(['reported-fact']));
  if (!ORGS.has(f.org)) fail(w, 'org must be Gallup or Pew');
  if (!f.measure || !f.question) fail(w, 'needs a measure label and question wording');
  checkDate(w, 'fieldStart', f.fieldStart, false, true);
  checkDate(w, 'fieldEnd', f.fieldEnd, false, true);
  if (!f.source?.url) fail(w, 'needs a source URL');
  if (f.overall != null && !pctOk(f.overall)) fail(w, 'overall must be 0-100');
  const parties = Object.entries(f.byParty || {});
  if (!parties.some(([k, v]) => ['Democratic', 'Republican'].includes(k) && v != null)) fail(w, 'needs figures by party');
  parties.forEach(([k, v]) => {
    if (!['Democratic', 'Republican', 'Independent'].includes(k)) fail(w, `unknown party "${k}"`);
    if (v != null && !pctOk(v)) fail(w, `${k} must be 0-100`);
  });
});
if (opinion.findings.length && !Object.keys(opinion.terms || {}).length) fail('public-opinion.json', 'record each organisation\'s terms of use');

// The IAPP, NCSL and MultiState trackers: terms of use, published counts, and
// which trackers list each bill.
const trackerData = read('trackers.json');
const TRACKERS = new Set(Object.keys(trackerData.trackers || {}));
for (const [id, t] of Object.entries(trackerData.trackers || {})) {
  const w = `trackers.json trackers.${id}`;
  if (!t.name || !t.short) fail(w, 'needs name and short name');
  if (!t.terms?.summary || !t.terms?.url) fail(w, 'record the terms of use (summary and link) before using a tracker');
}
(trackerData.counts || []).forEach((c, i) => {
  const w = `trackers.json counts[${i}]`;
  if (!TRACKERS.has(c.tracker)) fail(w, `unknown tracker "${c.tracker}"`);
  // "ALL" is a national total across the states.
  if (c.jurisdiction !== 'ALL' && !JURISDICTIONS.has(c.jurisdiction)) fail(w, `unknown jurisdiction "${c.jurisdiction}"`);
  if (c.prefix != null && !['more than', 'at least', 'about'].includes(c.prefix)) fail(w, `unknown prefix "${c.prefix}"`);
  if (!Number.isInteger(c.count) || c.count < 0) fail(w, 'count must be a whole number');
  if (!c.measure || !c.year) fail(w, 'needs measure and year');
  if (!c.source?.url) fail(w, 'needs a source URL');
});
legislation.bills.forEach((b) => {
  (b.trackers || []).forEach((t) => {
    if (!TRACKERS.has(t.tracker)) fail(`legislation.json ${b.id}`, `unknown tracker "${t.tracker}"`);
  });
});

// International
read('international.json').elections.forEach((e, i) => {
  const w = `international.json elections[${i}]`;
  if (!['candidate', 'party-manifesto'].includes(e.unit)) fail(w, 'unit must be candidate or party-manifesto');
  if (!EUROPE.has(e.countryCode)) fail(w, `countryCode "${e.countryCode}" is not on the Europe map`);
  if (!e.country || !e.type) fail(w, 'needs country and type');
});

// Checks against other published reports (verification.json). Every
// researched record, bill, result and piece of party-line evidence carries a
// check; confirmed claims are Medium confidence (never High: the source pages
// were not read), and claims that could not be confirmed stay Low.
const verification = read('verification.json');
const CHECK_RESULTS = new Set(['confirmed', 'corrected', 'partly-confirmed', 'contradicted', 'not-confirmed', 'not-checked', 'not-checkable']);
// Records that can be edited are corrected rather than left contradicted.
const RACE_FILE_ONLY = new Set(['contradicted']);
const checkable = new Map();
for (const rec of Object.values(raceItemsById)) checkable.set(rec.id, rec);
for (const b of legislation.bills) checkable.set(b.id, b);
for (const r of results) checkable.set(r.id, r);
for (const p of voterPolls) checkable.set(p.id, p);
for (const f of opinion.findings) checkable.set(f.id, f);
const extraIds = new Set();
for (const pos of partyLines.positions) (pos.evidence || []).forEach((_, j) => extraIds.add(`${pos.id}#${j}`));
for (const item of Object.values(raceItemIndex)) extraIds.add(item.id);
for (const file of raceFiles) {
  const race = read(join('races', file));
  (race.contextNotes || []).forEach((_, j) => extraIds.add(`${race.id}#context${j}`));
  if (race.country) extraIds.add(`${race.id}#candidates`);
}
read('international.json').elections.forEach((e) => extraIds.add(`international#${e.id}`));
checkDate('verification.json', 'checkedOn', verification.checkedOn, true);
for (const [id, c] of Object.entries(verification.checks || {})) {
  const w = `verification.json ${id}`;
  if (!checkable.has(id) && !extraIds.has(id)) fail(w, 'no record has this id');
  if (!CHECK_RESULTS.has(c.result)) fail(w, `unknown result "${c.result}"`);
  if (!c.note) fail(w, 'needs a note saying what was checked and found');
  checkDate(w, 'checkedOn', c.checkedOn, true);
  if (['confirmed', 'corrected', 'partly-confirmed'].includes(c.result) && !(c.sources || []).some((s) => s.url)) {
    fail(w, 'a confirmed, corrected or partly confirmed claim needs the reports that confirm it');
  }
  (c.sources || []).forEach((s) => {
    if (!s.url || !s.title) fail(w, 'each source needs a title and url');
  });
  const rec = checkable.get(id);
  if (rec && RACE_FILE_ONLY.has(c.result)) fail(w, 'correct the record instead of leaving it contradicted');
  if (rec) {
    const confirmed = c.result === 'confirmed' || c.result === 'corrected';
    if (confirmed && !['medium', 'high'].includes(rec.confidence)) fail(w, 'a confirmed claim should be Medium (or High) confidence');
    if (!confirmed && ['medium', 'high'].includes(rec.confidence) && rec.labelType !== 'election-result') {
      fail(w, `a claim that is ${c.result} should not be ${rec.confidence} confidence`);
    }
    if (c.result !== 'not-checked' && rec.lastVerified && rec.lastVerified < c.checkedOn) fail(w, 'lastVerified on the record is older than the check');
  }
}
for (const id of [...checkable.keys(), ...[...extraIds].filter((x) => x.includes('#') && !x.startsWith('international#'))]) {
  if (!verification.checks?.[id]) fail(`verification.json`, `no check recorded for ${id}`);
}

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Data OK: ${raceFiles.length} races, ${results.length} election results, ${legislation.bills.length} bills, ${seenIds.size} labeled records.`);
