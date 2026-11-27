// Methods appendix (AIPD-504): generated from the same data and definitions as
// the Methodology page, so its counts are always current.
//   npm run appendix   ->   documents/methods-appendix.md
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../src/data/', import.meta.url).pathname;
const out = new URL('../documents/methods-appendix.md', import.meta.url).pathname;
const read = (f) => JSON.parse(readFileSync(join(root, f), 'utf8'));

const codebook = read('codebook.json');
const research = read('candidate-research.json').records;
const bills = read('legislation.json').bills;
const results = read('results.json').results;
const partyLines = read('party-lines.json').positions;
const verification = read('verification.json');
const polls = read('voter-priorities.json').polls;
const opinion = read('public-opinion.json');
const trackers = read('trackers.json');
const archives = existsSync(join(root, 'archives.json')) ? read('archives.json').pages || [] : [];
const races = readdirSync(join(root, 'races')).filter((f) => f.endsWith('.json')).map((f) => read(join('races', f)));
const selection = existsSync(join(root, 'senate-race-selection.json')) ? read('senate-race-selection.json') : null;
const version = (readFileSync(new URL('../src/version.js', import.meta.url), 'utf8').match(/'([^']+)'/) || [])[1];

const count = (arr, f) => arr.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {});
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : 'n/a');
const place = (r) => r.state || r.country;
const lines = [];
const p = (s = '') => lines.push(s);
const table = (head, rows) => {
  p(`| ${head.join(' | ')} |`);
  p(`|${head.map(() => '---').join('|')}|`);
  rows.forEach((r) => p(`| ${r.map((c) => String(c ?? '').replace(/\|/g, '/').replace(/\n/g, ' ')).join(' | ')} |`));
  p();
};

const checks = Object.entries(verification.checks);
const claimChecks = checks.filter(([, c]) => c.result !== 'not-checkable');
const ok = (c) => c.result === 'confirmed' || c.result === 'corrected';
const confirmed = claimChecks.filter(([, c]) => ok(c));
const high = confirmed.filter(([, c]) => c.level === 'high');
const byResult = count(checks.map(([, c]) => c), (c) => c.result);
const byMethod = count(checks.map(([, c]) => c), (c) => (c.method === 'chatgpt-primary-source' ? 'primary source (relayed)' : 'web search, other reports'));
const candidates = races.flatMap((r) => r.candidates.map((c) => ({ ...c, race: r })));
const reviewed = research.filter((r) => r.coding?.reviewed).length;

p('# Methods appendix');
p();
p(`Generated from the dashboard's data on ${new Date().toISOString().slice(0, 10)} (site version ${version}, codebook ${codebook.version}) by \`npm run appendix\`. The Methodology page on the site is the readable version of the same definitions; this appendix adds the current counts, the reliability results (when available) and the limitations.`);
p();

p('## 1. Scope and sample');
p();
p(`${races.length} races (${races.filter((r) => r.state).length} in the United States, ${races.filter((r) => r.country).length} abroad), ${candidates.length} candidates, ${research.length} candidate records, ${bills.length} bills and announced proposals, ${partyLines.length} party-line positions and ${results.length} election results.`);
p();
table(['Race', 'Place', 'Election', 'Candidates', 'Records'], races.map((r) => [r.office, place(r), r.electionDate + (r.runoffDate ? ` / runoff ${r.runoffDate}` : ''), r.candidates.length, research.filter((x) => x.raceId === r.id).length]));
if (selection) {
  p('### Senate race selection');
  p();
  p(selection.criteriaSummary || '');
  p();
  const chosen = selection.races.filter((r) => r.selected);
  table(['State', 'Seat', 'Rating', 'Result', 'Why it is in the sample'], chosen.map((r) => [r.state, r.openSeat ? 'Open' : 'Incumbent', r.rating?.rating, r.result ? `${r.result.winner} (${r.result.party?.[0]})${r.result.flipped ? ', flip' : ''}` : '', r.reason]));
} else {
  p('The Senate race list and its selection criteria (AIPD-102) will be added here once published.');
  p();
}

p('## 2. Records and labels');
p();
p('Every record has exactly one label type, a source, a publication date, a last-verified date, a confidence level and a version history. Records are never silently overwritten: each change raises the version and adds a dated note.');
p();
table(['Label type', 'Meaning', 'Records'], codebook.labelTypes.map((t) => [t.label, t.description, research.filter((r) => r.labelType === t.id).length]));
table(['Confidence', 'Meaning', 'Records'], codebook.confidenceLevels.map((c) => [c.label, c.description, research.filter((r) => r.confidence === c.id).length]));
p(`Two policy areas (${codebook.domains.map((d) => d.label).join('; ')}) and two tracks (${codebook.tracks.map((t) => t.label).join('; ')}) split every view; ${codebook.proposalCategories.length} policy categories group statements and proposals.`);
p();

p('## 3. Coding scheme');
p();
p(`Codebook ${codebook.version}. ${codebook.status}`);
p();
table(['Dimension', 'Categories'], codebook.dimensions.map((d) => [d.label, (d.categories || []).map((c) => c.label).join('; ')]));
p(`Coding status: ${research.length - reviewed} of ${research.length} candidate records carry AI-drafted coding not yet reviewed by a person (AIPD-202).`);
p();

p('## 4. Verification');
p();
p(`${verification.method}`);
p();
p(`Primary-source checks: the build environment cannot open most source sites, so the project owner checks claims against the primary source with ChatGPT (web browsing) and relays the results, which are imported claim by claim with recorded decisions (documents/chatgpt-verification). Relays so far: ${(verification.relays || []).map((r) => `${r.batch} (${r.claims} claims, ${r.date})`).join('; ')}.`);
p();
table(['Check result', 'Claims'], Object.entries(byResult).sort((a, b) => b[1] - a[1]));
table(['Method of the latest check', 'Claims'], Object.entries(byMethod));
p(`Of ${claimChecks.length} checkable claims, ${confirmed.length} (${pct(confirmed.length, claimChecks.length)}) are confirmed or corrected, and ${high.length} (${pct(high.length, claimChecks.length)}) are at High confidence (wording and date checked against the primary source).`);
p();

p('## 5. Election results and certification');
p();
p('Results carry their own label and are stored apart from statements. Each records when and where its figures were taken and where the official canvass stands.');
p();
table(['Result', 'Status', 'Certification', 'Figures as of'], results.map((r) => [r.id, r.resultStatus, `${r.certification?.status}${r.certification?.date ? ` (${r.certification.date})` : r.certification?.expected ? ` (expected ${r.certification.expected})` : ''}`, r.figuresAsOf]));

p('## 6. Party lines and deviation');
p();
p(`${partyLines.length} party-line positions built from ${partyLines.reduce((n, x) => n + x.evidence.length, 0)} pieces of evidence. Party lines are an editorial judgment from the evidence listed; their confidence is Medium only when every piece of evidence is confirmed.`);
p();
table(['Confidence', 'Positions'], Object.entries(count(partyLines, (x) => x.confidence)));

p('## 7. Voter priorities, public opinion and trackers');
p();
p(`${polls.length} published polls on voters' issue priorities or AI (shown as context, not predictions); ${(opinion.findings || []).length} Gallup and Pew findings by party; legislation found through ${Object.values(trackers.trackers || {}).map((t) => t.name).join(', ')} and confirmed on official records where possible.`);
p();

p('## 8. Archived sources');
p();
const cited = new Set(research.map((r) => r.source?.url).filter(Boolean));
const archivedCited = [...cited].filter((u) => archives.some((a) => a.url === u) || u.startsWith('https://web.archive.org/web/')).length;
p(`${archivedCited} of ${cited.size} pages cited by candidate records ${archivedCited === 1 ? 'has' : 'have'} an archived copy (AIPD-101); ${archives.filter((a) => a.kind === 'campaign-page').length} campaign pages are archived.`);
p();

p('## 9. Reliability');
p();
p('Pending (AIPD-202, AIPD-203). Planned design: a person reviews every AI-drafted code; then two coders independently code a sample of at least 20% of records, and Krippendorff\'s alpha is reported for each coding dimension, with codebook rules revised where agreement is low. Results will be reported here, and the codebook frozen as version 1.0.');
p();

p('## 10. Limitations');
p();
[
  `Sample size: ${races.length} races and ${candidates.length} candidates; findings describe these races, not all 2026 contests.`,
  `Search-based checks: ${byMethod['web search, other reports'] || 0} claims were last checked by comparing other published reports on the web, not the primary source; these are at most Medium confidence.`,
  'Relayed primary-source checks: primary sources were opened by the project owner through ChatGPT, not directly by the build environment; each relay and decision is kept in documents/chatgpt-verification so it can be audited.',
  `Coding: ${research.length - reviewed} of ${research.length} records have AI-drafted coding not yet reviewed by a person, and inter-coder reliability has not yet been measured.`,
  `Election results: ${results.filter((r) => r.resultStatus !== 'certified').length} of ${results.length} results still show unofficial figures until certified figures are entered.`,
  'Sparse coverage: candidates who said little about AI have few records; that sparseness is recorded rather than filled in, and is itself a finding about salience.',
  'Party lines: built from leaders\' statements and actions (the Trump administration; incoming Democratic congressional leaders), so they simplify parties with internal disagreement.',
  'Trackers: a bill counts as covered by a tracker when it is named on the tracker\'s site or in its reports; the trackers\' databases themselves could not be queried.',
  'France: the 2027 race is in progress; positions and the candidate field may change before April 2027.',
].forEach((l) => p(`- ${l}`));
p();

writeFileSync(out, lines.join('\n'));
console.log(`Wrote ${out} (${lines.length} lines)`);
