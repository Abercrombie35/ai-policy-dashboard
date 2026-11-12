MAPPING THE AI POLICY DIVIDE
Candidate positions, state legislation, and party approaches to AI regulation

Yale SOM civic-information dashboard and research dataset.
Live site: https://ai-policy-dashboard.replit.app

1. WHAT THIS PROJECT DOES
=========================

The dashboard tracks what political actors say and do about artificial
intelligence: AI safety, regulation, labor disruption, privacy, national
security, and innovation. It is the data-collection and transparency instrument
for a research paper on how the two major U.S. parties approach AI regulation.

Every record carries one of six labels (direct quote, reported fact,
source-based summary, model-generated analysis, projection, editorial
judgment), plus a source, publication date, last-verified date, confidence
level, and version history. Records are never silently overwritten.

IMPORTANT: Nothing in the dataset has been verified yet. The Michigan records
came from the original prototype and are stored as "unverified drafts". They
are hidden from the public view by default. Anyone can reveal them with the
"Show unverified drafts" switch, and they are then clearly marked. Do not cite
them as facts.

2. FEATURE STATUS
=================

Built:
- Accurate map of all 50 states plus D.C., bundled with the app (no runtime
  download). States are colored by data coverage and can be used by keyboard.
- Multi-race support: each race is one file in src/data/races/. Four 2026
  races are tracked: the U.S. Senate and governor races in Michigan and Texas.
- Election results, with their own "Election result" label kept apart from
  the six statement labels (src/data/results.json). Each result is marked
  Unofficial or Certified and records its sources and when its figures were
  taken. All four current results are unofficial (see section 4).
- Candidate comparison with the same tabs and fields for every candidate:
  Overview, Statements, Positions, Alignment & endorsements, Projections.
- Labels, sources, dates, confidence, version, and codebook coding on every
  record. Questionnaire status is shown for each candidate. Non-response reads
  "No response received as of [date]".
- State AI legislation layer: bills with sponsors, party, status, and coding,
  shown per state and on a Legislation page.
- Party comparison: for each codebook dimension, the share of each party's
  coded records in each category. Campaign and legislation records can be
  filtered separately.
- International page listing the 2027 elections from the proposal, with
  France as the pilot.
- Methodology page: labels, confidence levels, codebook, neutrality rules,
  corrections process, and privacy statement.
- Downloadable dataset: full JSON, campaign-records CSV, bills CSV, and the
  codebook. Drafts are included only if the reader opts in.
- "npm run validate" checks every data file against the codebook and the
  labeling rules.

Not built yet / needs people:
- Verification. Every record is an unverified draft until someone checks it
  against a primary source (see section 4).
- AI policy records for Texas and for both governor races (none entered
  yet), the final 10-20 race list, and certified 2026 election results.
- Coding review. The draft coding was produced by an AI model and is marked
  "not reviewed". The codebook needs piloting on Michigan and Texas. One gap
  found so far: there is no issue area for copyright or creator compensation.
- Real legislation data. The one Texas bill (HB 149, TRAIGA) is an unverified
  example.
- International records (France pilot), manifesto coding, and live polling or
  prediction-market data through a backend proxy.
- The mock Kalshi odds, the made-up polling header, the numeric party-alignment
  scores (which had no disclosed method), and the placeholder photos were
  removed.

3. HOW TO USE THE WEBSITE
=========================

- Map: click a state, or tab to it and press Enter, to open its races and AI
  bills. Blue states have a tracked Senate race. The drop-down limits the map
  to states with races or with coded bills.
- Race page: switch between the tabs. Each card shows its label, confidence,
  source, publication date, last-verified date, version, and (under "Coding")
  how it was coded.
- "Show unverified drafts" (top right): reveals draft records everywhere,
  with a warning banner. The choice lasts for the browser tab.
- Party comparison, Legislation, International, Methodology, and Download data
  are in the navigation row. Every view has its own URL (for example,
  #/state/MI/mi-senate-2026), so links can be shared.

4. ADDING AND VERIFYING DATA
============================

All data lives in src/data/:
- codebook.json: dimensions, categories, label types, confidence levels.
- races/<race-id>.json: one file per race (candidates, items, context
  signals, result). The file name must match the race id.
- results.json: election results (separate "Election result" label).
- legislation.json: state AI bills.
- international.json: elections outside the U.S.
- us-states-geo.json: map shapes (generated; see tools/build-state-paths.mjs).

To verify a record:
1. Find the primary source and check the wording, speaker, and date.
2. Set "source": { "title": ..., "url": ... }, "lastVerified": "YYYY-MM-DD",
   and "confidence": "high" | "medium" | "low".
3. Increase "version" by 1 and add a history entry with the date and a note
   saying what changed.
4. If you reviewed the coding, set "coding.reviewed": true and "coder" to
   your initials.
5. Run "npm run validate". It rejects verified records that have no URL or
   no last-verified date, unknown codebook categories, and version numbers
   that don't match the history.

To add a race, copy src/data/races/tx-governor-2026.json, rename it to the
new race id, and fill it in. It appears on the map automatically.

Election results go in src/data/results.json, one record per race, never in
the race file. (The Senate race files still have an older "result"
placeholder; it is not used.) The current results are unofficial: the winners
were checked across several news reports, and the vote shares are unofficial
figures quoted from the cited outlets. When a state certifies its canvass:
1. Replace the figures with the official canvass (add vote counts in
   "votes").
2. Set "resultStatus": "certified", "confidence": "high", the official
   canvass as "source", and a new "lastVerified" date.
3. Increase "version" and add a history entry. "npm run validate" checks that
   the winner is one of the listed candidates, that shares don't add up to
   more than 100%, and that certified results have high confidence.

5. HOW THE PROJECT WORKS
========================

React + Vite, no backend. The app uses hash routes (src/lib/router.js). All
data is read through src/lib/data.js, which also applies the draft filter, so
every view treats unverified records the same way.

Key files:
- src/App.jsx: header, navigation, drafts switch, map page.
- src/components/USMap.jsx: the clickable map.
- src/components/StateModal.jsx, StateView.jsx: the state pop-up (races and
  bills).
- src/components/RaceView.jsx, CandidateComparison.jsx: race page and tabs.
- src/components/ItemCard.jsx: the labeled record card used everywhere.
- src/components/BillCard.jsx: a bill record.
- src/components/ElectionResult.jsx: the election-result panel and badges.
- src/pages/: Party comparison, Legislation, International, Methodology,
  Download data.
- src/lib/drafts.jsx: the drafts switch. Set SHOW_DRAFTS_BY_DEFAULT to change
  the default.
- tools/validate-data.mjs: the data checks.
- tools/build-state-paths.mjs: regenerates the map shapes from us-atlas (U.S.
  Census Bureau boundaries).

6. RUNNING, SYNCING, AND PUBLISHING
===================================

Requirements: Node.js 20 and npm.

  npm install        (or "npm ci" where package-lock.json is present)
  npm run dev        development server
  npm run validate   check the data files
  npm run build      production build into dist/
  npm run preview    preview the production build

On GitHub, every push and pull request runs the data checks and a build
(.github/workflows/ci.yml).

On Replit, click Run to start the configured workflows. The "GitHub
auto-sync" workflow ("npm run sync:github", scripts/github-auto-sync.js)
fetches the configured upstream branch at startup and every 15 minutes, and
merges when it is safe. It never pushes to GitHub. Publishing is a static
site: build command "npm run build", output folder "dist". After a sync,
publish again to update the live site.

7. WHAT IS COMING (from the project proposal)
=============================================

Oct-Nov 3, 2026: finish Michigan and Texas; archive statements for the
remaining races; finalize the race list and draft codebook.
Nov 2026-Jan 2027: verify and code Senate data; reliability testing; record
election outcomes.
Jan-Mar 2027: launch the state legislation layer as sessions begin; link
officeholders to bills; draft the party-comparison analysis.
Mar-May 2027: France presidential case study.
May-Jun 2027: write the paper; usability testing of the dashboard.
Later 2027: optional extension to parliamentary elections (Poland, Italy).
