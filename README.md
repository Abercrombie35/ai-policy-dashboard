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

IMPORTANT: On 2026-11-24 every claim was checked against other published
reports by web search (see "Checking claims" in section 4). Confirmed claims
are Medium confidence and list the reports that confirm them; claims that
could not be confirmed, or were not yet checked, keep Low confidence and a
small "Not independently verified" or "Partly verified" note. Nothing is High
confidence: the source pages themselves could not be opened from the build
environment. The Michigan Senate records from the original prototype are
"unverified drafts", hidden by default (the "Show unverified drafts" switch
reveals them). Do not cite them as facts.

2. FEATURE STATUS
=================

The two policy areas this project studies are DATA CENTERS and EVERYTHING ELSE
IN AI. Within each, what candidates SAY (statements, stated principles) is kept
apart from what they PROPOSE (bills, moratoriums, plans, official actions).

Built:
- Policy analysis page (#/analysis): party lines, a deviation matrix (each
  candidate against their party line, split into said vs. proposed), a "where
  deviation exists" summary and a "when" timeline, separately for data centers
  and for everything else in AI. Party lines: Republican = the Trump
  administration; Democratic = the incoming congressional leaders (Schumer,
  presumptive Senate majority leader; Jeffries, presumptive Speaker).
- Proposed bills and moratoriums, each with its source and a "To verify"
  marker, split into the two policy areas: on the home screen and at the
  bottom of every state and race page.
- Home screen summary of the two policy areas: records of what is said,
  proposals, and how many candidates deviate from their party line.
- Race pages: "Data centers" and "Everything else in AI" tabs, each showing
  what each candidate said and what they proposed, plus a deviation section.
  A race opens in a pop-up over the map covering 80% of the screen (the full
  screen on phones), with its own link (#/state/MI/<race-id>). Close it with
  the close button, Escape, a click outside or the browser back button; focus
  stays inside while it is open and returns to the race's card afterwards. The
  pop-up is the only scroll area and has no background blur, which is what
  caused the blank screen reported on Nov. 16.
- Accurate map of all 50 states plus D.C., bundled with the app (no runtime
  download). States are colored by data coverage and can be used by keyboard.
- Multi-race support: each race is one file in src/data/races/. Seven 2026
  races are tracked: the U.S. Senate and governor races in Michigan and Texas;
  in Connecticut the governor race (Lamont vs. Fazio) and the U.S. House race
  in the 4th District (Himes vs. Goldstein); and the California governor race
  (Becerra vs. Hilton). Connecticut and California had no U.S. Senate race in
  2026. California's data center and AI bills (SB 53, SB 243, the September
  2026 data center package and more) are on the Legislation page.
- Home page: the U.S. map (60%) sits beside a Europe map (40%). France is
  highlighted; other countries with 2027 elections listed in the proposal are
  marked. Selecting a country opens its tracked race and elections.
- France, 2027 presidential election (#/country/FR/fr-president-2027): seven
  likely candidates placed on a left / centre / right / far-right bloc;
  their AI and data center statements and plans in the same two policy areas
  and categories as the U.S. races; "where the candidates stand" on the policy
  questions (there is no U.S.-style party line, so candidates are compared
  with each other); French bills and plans plus the EU AI Act and Digital
  Omnibus; election dates and context, sourced. Boxes abroad are tinted by
  bloc (pink left, amber centre, teal right, brown far right), not by the U.S.
  party colours.
- Voter priorities (src/data/voter-priorities.json): on each race page, a bar
  chart of the issues that mattered most to voters in that state or country,
  with AI or data centers highlighted when they were an option, plus polls that
  asked about AI directly; a cross-race summary on the Policy analysis page.
- Public opinion by party (src/data/public-opinion.json): Gallup and Pew
  findings on AI, by party, charted on the Party comparison page.
- Claim checks (src/data/verification.json): one result per claim (confirmed,
  corrected, partly confirmed, not confirmed, not yet checked, or not a
  checkable fact), with the confirming reports. Shown as a tiny note on boxes
  and cards, "confirmed by" links under the numbered sources, a summary on the
  Methodology page, and columns in the downloads.
- Policy boxes: every bill, proposal and statement box shows the central point
  in large type (src/data/headlines.json holds short headlines for candidate
  records), who is behind it, a blue tint for Democrats and red for
  Republicans (purple for bipartisan), and the date in small type. Sources
  are numbered and listed under each category.
- Categories: every bill and every coded candidate record (statements as
  well as proposals and actions) has a category (for data centers: moratoriums and bans, electricity
  costs and grid, tax breaks, siting and local control, water and
  environment, disclosure and studies, security, permitting; for everything
  else in AI: broad AI laws, children and chatbots, deepfakes, chips and
  China, federal vs. state authority, consumer protection, workers,
  innovation, plus finer ones: investment and jobs; frontier AI safety;
  privacy and surveillance; copyright and creators; national security).
  Race tabs show one row per category with the candidates side by side; the
  state pop-up and the Policy analysis page break each area down by
  category, said vs. proposed, party and state (Michigan, Texas,
  Connecticut, federal). Categories for items in the race files live in
  src/data/item-categories.json so those files are not edited.
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
- Verification. The prototype Michigan records are unverified drafts. The
  records added on 2026-11-12 (candidate stances, party lines, bills and
  moratoriums) cite sources but came from web search summaries, so they are
  marked Low confidence and "To verify" until someone checks each one.
- Review of the AI-model stance coding and party-line judgments.
- AI policy records for Texas and for both governor races (none entered
  yet), the final 10-20 race list, and certified 2026 election results.
- Coding review. The draft coding was produced by an AI model and is marked
  "not reviewed". The codebook needs piloting on Michigan and Texas. One gap
  found so far: there is no issue area for copyright or creator compensation.
- Real legislation data. The one Texas bill (HB 149, TRAIGA) is an unverified
  example.
- Raising claims to High confidence: every claim has been searched (two
  rounds on 2026-11-24), but nothing is High until someone reads the primary
  source. The 36 partly confirmed and 18 not confirmed claims are the place
  to start (filter verification.json by "result").
- Manifesto coding for parliamentary elections abroad, and live polling or
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
- candidate-research.json: sourced candidate records with stances on the
  policy questions (kept apart from the race files, which are not edited).
- party-lines.json: the Republican and Democratic party lines, one per policy
  question, each with dated, sourced evidence.
- legislation.json: state and federal AI bills, plus French and EU laws
  ("country": "FR" or "EU" instead of "state").
- voter-priorities.json: published polls on voters' top issues per race
  ("kind": "issue-priorities", with "aiOffered" true, false or null when only
  the top issues were published) and polls that asked about AI ("ai-question").
- public-opinion.json: Gallup and Pew findings by party, with each
  organisation's terms of use.
- trackers.json: the IAPP, NCSL and MultiState trackers: their terms of use
  and the counts they publish; bills carry "trackers" naming which cover them.
- verification.json: the result of checking each claim against other
  published reports, with those reports (kept apart from the records so the
  race files are never edited).
- international.json: elections outside the U.S. A race abroad is a race file
  with "country" instead of "state", candidates with a "bloc", and sourced
  "contextNotes".
- us-states-geo.json: map shapes (generated; see tools/build-state-paths.mjs).

Checking claims (verification.json):
- Each claim (candidate record, bill, result, piece of party-line evidence,
  race context note, election date) has a check with a result, a one-line
  note, the reports that confirm it, and anything not confirmed. The
  validator requires a check for every claim.
- Confirmed or corrected: the record is Medium confidence, with a new version
  and history note. Partly confirmed, not confirmed or not yet checked: Low
  confidence, and the site shows a small note. "Not yet checked" means the
  web search limit for that round ran out (none are left after the second
  round of 2026-11-24).
- To raise a claim to High: open the primary source, confirm wording and
  date, then set "confidence": "high" and follow the steps below.
- Primary-source checks relayed from ChatGPT (web browsing): the prompts are
  in documents/chatgpt-verification (batch-NN.txt) and the replies in
  documents/chatgpt-verification/results. Imported checks carry "method":
  "chatgpt-primary-source", the batch, the source, a verbatim quote and the
  level given (High with a primary source and confirmed date; otherwise
  Medium or Low).

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

To verify a bill, moratorium, candidate record or party line marked "To verify":
open its source, check the facts (bill number, sponsors, status, wording,
date), then set "confidence" to "medium" or "high", update "lastVerified",
increase "version" and add a history entry. Where a record has "stances", also
check that the stance fits the codebook's policy-question definitions, and set
"coding.reviewed": true.

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
- src/components/RaceModal.jsx: the 80% race pop-up over the map.
- src/data/scenarios.json, src/pages/ScenariosView.jsx: conditional regulatory scenarios (#/scenarios), each a
  labelled projection with assumptions, evidence ids and what would change it (AIPD-503).
- src/lib/people.js, src/pages/PeopleView.jsx: People (#/people) and a page per person (#/person/<id>) for every
  candidate and bill sponsor, derived from the race, record, bill and result files (AIPD-301).
- src/data/senate-race-selection.json, src/components/RaceSelection.jsx: the 2026 Senate sample (AIPD-102), drawn
  by `tools/select_senate_races.py` from the sourced facts in documents/senate-selection/races-2026.json and shown
  on the Methodology page with its criteria.
- src/data/archives.json, documents/archive/: archived copies of cited pages and campaign issue pages (AIPD-101).
  `documents/archive/archive_pages.py` captures them in the Wayback Machine (run on your own computer);
  `tools/import_archives.py` imports the results and rebuilds the list of pages to archive.
- src/components/ItemCard.jsx: the labeled record card used everywhere.
- src/components/BillCard.jsx: a bill record.
- src/components/ElectionResult.jsx: the election-result panel and badges, with a table per round for two-round
  elections (France: `rounds` in results.json, first round with the two who advance, then the runoff).
- src/lib/analysis.js, src/components/Analysis.jsx, src/pages/AnalysisPage.jsx:
  party-line deviation analysis.
- src/components/ProposalsPanel.jsx: proposed bills and moratoriums.
- src/pages/: Party comparison, Legislation, International, Methodology,
  Download data.
- src/lib/drafts.jsx: the drafts switch. Set SHOW_DRAFTS_BY_DEFAULT to change
  the default.
- tools/validate-data.mjs: the data checks.
- tools/build-state-paths.mjs: regenerates the map shapes from us-atlas (U.S.
  Census Bureau boundaries).
- tools/build-europe-paths.mjs: regenerates the Europe map from world-atlas
  (Natural Earth boundaries).

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

Vercel: the repository is connected to Vercel, which deploys every push to
main (and a preview for every pull request). vercel.json pins the settings:
install with npm, run "npm run validate" then "npm run build", publish the
dist folder. A failing data check stops the deploy.

GitHub Pages (second copy of the live site): every merge to main is checked and
published automatically by .github/workflows/deploy-pages.yml to
https://abercrombie35.github.io/ai-policy-dashboard/ . This copy is always
exactly the code on GitHub main. The footer shows the version
(src/version.js); bump it when merging changes. If the first deploy fails
because Pages is off, turn it on once: repository Settings > Pages > Build
and deployment > Source: GitHub Actions, then re-run the workflow.

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
