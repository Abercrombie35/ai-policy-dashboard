# Product backlog: Mapping the AI Policy Divide

Built from the project proposal and the dashboard as deployed on Nov. 26, 2026 (version 2026-11-24.2).

**Story points** use the Fibonacci scale (1, 2, 3, 5, 8, 13) for relative size. **Priority** is MoSCoW against the paper's core (Tracks A and B, RQ1-RQ4, per proposal §12): Must, Should, Could. Track C stories are mostly Should or Could because the proposal treats France as a pilot.

**Definition of done** (every story): `npm run validate` and the build pass; every new claim cites a source and has a check result; the Senate race files are unchanged; README and Methodology updated; page tests pass; merged to main and deployed.

**Summary:** 18 stories done before Nov. 26; 45 in the backlog (269 points): Must-Must 6 (34 pts), Must 21 (142 pts), Should 12 (58 pts), Could 6 (35 pts). One story set to Won't (questionnaires).

**Must-Must** (added Nov. 26, 2026) sits above Must: voter-priority polling with bar charts, verification through a ChatGPT hand-off, and Track B sourcing from Gallup, Pew and the IAPP, NCSL and MultiState trackers.

## Done

| ID | Epic | Story | Delivered | Proposal |
|---|---|---|---|---|
| AIPD-01 | Platform and data foundation | **Accurate interactive U.S. map**. As a reader, I want a clickable, keyboard-accessible map of all 50 states and D.C. so that I can open any state's races and AI bills. | Bundled Census map (no runtime download); states coloured by coverage; filter for states with races or bills. | §7 prototype |
| AIPD-02 | Platform and data foundation | **Multi-race support with shareable pages**. As a reader, I want each race on its own page with a link I can share so that I can compare candidates race by race. | One file per race; race pages at #/state/XX/<race>; back and browser navigation tested (28/28). | §7 item 2 |
| AIPD-03 | Platform and data foundation | **Six-label record model with versioning**. As a researcher, I want every item labelled by type, source, dates, confidence and version so that any finding can be traced and corrections are never silent. | Six label types, source, published and last-verified dates, confidence, version history; validator enforces them on every build. | §5 Labeling |
| AIPD-04 | Platform and data foundation | **Draft codebook applied to every record**. As a researcher, I want statements and bills coded on common dimensions so that parties can be compared on the same terms. | Six dimensions from the proposal, plus said vs. proposed, data centers vs. everything else in AI, 22 categories and 6 policy questions (codebook 0.1-draft). | §5 Methodology |
| AIPD-05 | Platform and data foundation | **Unverified drafts hidden by default**. As a reader, I want unchecked prototype content hidden unless I ask for it so that I am not misled. | "Show unverified drafts" switch; drafts clearly marked when shown. | §8 |
| AIPD-06 | Platform and data foundation | **Automatic checks and deploys from GitHub**. As the maintainer, I want every change checked and published automatically so that the live site always matches tested code. | CI (data checks + build) on every push; GitHub Pages and Vercel deploy from main; version shown in the footer. | §7 |
| AIPD-07 | Track A: 2026 Senate candidates | **Michigan and Texas pilot races, plus CT and CA**. As a reader, I want the pilot races profiled with sourced AI statements so that I can see what candidates said and proposed. | 7 U.S. races (MI and TX Senate and governor, CT governor, CT-4 House, CA governor), 14 candidates, 38 sourced candidate records with stances. | §4 Track A |
| AIPD-08 | Track A: 2026 Senate candidates | **Election results with their own label**. As a researcher, I want results recorded separately from statements so that outcomes can be a variable without mixing record types. | 7 results, labelled Unofficial; certified results require the official canvass (enforced). | §4, §9 |
| AIPD-09 | Track A: 2026 Senate candidates | **Symmetric candidate comparison and questionnaire status**. As a reader, I want every candidate shown with the same fields so that no one is treated differently. | Same tabs and fields for every candidate; questionnaire status and "No response received as of [date]" wording supported. | §8 |
| AIPD-10 | Analysis and paper | **Party lines and deviation (where and when)**. As a researcher, I want each candidate compared with their party line so that I can see where and when they deviate (RQ2). | Party lines (Trump administration; Schumer and Jeffries) with dated evidence; deviation matrix split into said vs. proposed; timeline. | RQ2 |
| AIPD-11 | Analysis and paper | **Party comparison and category breakdowns**. As a researcher, I want party-level summaries so that I can compare the substance of positions (RQ1). | Party comparison page by codebook dimension; breakdowns by party and state for both policy areas. | RQ1, §7 item 4 |
| AIPD-12 | Track B: officeholders and state legislation | **State and federal AI legislation layer**. As a reader, I want AI and data center bills with sponsors, party and status so that I can see what legislators do, not just say. | 49 bills and laws (CA 15, federal 12, CT 7, MI 6, TX 4, France 3, EU 2), grouped by category, filterable; on state pages and the home page. | §4 Track B, §7 item 3 |
| AIPD-13 | Dashboard experience and context | **Clean policy boxes with numbered sources**. As a reader, I want each policy box to show the main point, who is behind it and the date, with sources listed by number so that pages stay readable. | Party-tinted boxes (blue D, red R, purple bipartisan); numbered sources under each category; confirming reports linked. | §7 |
| AIPD-14 | Track C: elections outside the U.S. (2027) | **Europe map and international elections list**. As a reader, I want Europe beside the U.S. so that the 2027 elections are part of the same view. | U.S. map (60%) and Europe map (40%); 5 elections listed with dates checked. | §4 Track C |
| AIPD-15 | Track C: elections outside the U.S. (2027) | **France 2027 race page**. As a reader, I want France's presidential candidates compared on AI and data centers so that the framework is shown to work abroad. | 8 candidates by bloc (Le Pen declared; Bardella as alternate), 10 records, French and EU laws, stance comparison without a party line, sourced context. | §4 Track C, RQ5 |
| AIPD-16 | Verification, coding and reliability | **Every claim checked against published reports**. As a reader, I want to know which claims other reports confirm so that I can judge how far to trust each one. | 178 claims searched in two rounds: 90 confirmed, 17 corrected, 36 partly confirmed, 18 not confirmed, 3 contradicted (drafts), 14 opinions; tiny disclaimers on the site. | §11 risk: bias |
| AIPD-17 | Analysis and paper | **Downloadable dataset**. As a researcher, I want to download the data so that I can reuse and check it. | Full JSON; CSVs of records, bills, deviation and results, with check results; codebook. | §7 item 6, §10 |
| AIPD-18 | Verification, coding and reliability | **Methodology page**. As a reader, I want to see how records are sourced, coded and corrected so that the method is open to scrutiny. | Labels, confidence, codebook, check results, neutrality, corrections and privacy sections. | §8, §10 item 4 (partial) |

## Backlog at a glance

| ID | Epic | Story | Pts | Priority | Status | Depends on |
|---|---|---|---|---|---|---|
| AIPD-111 | Track A: 2026 Senate candidates | Voter priorities: where AI ranks for voters in each race | 8 | **Must-Must** | Done (Nov. 26) | AIPD-211 |
| AIPD-112 | Dashboard experience and context | Bar charts: importance of AI against the top issues, per race | 5 | **Must-Must** | Done (Nov. 26) | AIPD-111 |
| AIPD-211 | Verification, coding and reliability | Hand-off list and ChatGPT prompt for claims Claude cannot verify | 3 | **Must-Must** | Done (Nov. 26) | - |
| AIPD-212 | Verification, coding and reliability | Import ChatGPT verification results | 5 | **Must-Must** | In progress (batches 01-10 of 14 imported; tool in tools/import_chatgpt.py) | AIPD-211 |
| AIPD-311 | Track B: officeholders and state legislation | Public opinion on AI by party from Gallup and Pew | 5 | **Must-Must** | Done (Nov. 26) | AIPD-211 |
| AIPD-312 | Track B: officeholders and state legislation | Legislation sourced from the IAPP, NCSL and MultiState trackers | 8 | **Must-Must** | Done (Nov. 26) | AIPD-302 |
| AIPD-101 | Track A: 2026 Senate candidates | Archive campaign pages before they go offline | 3 | **Must** | To do | - |
| AIPD-102 | Track A: 2026 Senate candidates | Final race list with published selection criteria | 3 | **Must** | To do | - |
| AIPD-103 | Track A: 2026 Senate candidates | Add the next five Senate races | 8 | **Must** | To do | AIPD-102, AIPD-101 |
| AIPD-106 | Track A: 2026 Senate candidates | Measure AI salience per candidate | 8 | **Must** | To do | AIPD-101 |
| AIPD-108 | Track A: 2026 Senate candidates | Certified election results | 2 | **Must** | To do | - |
| AIPD-109 | Track A: 2026 Senate candidates | Build out Florida | 8 | **Must** | To do | AIPD-111 |
| AIPD-201 | Verification, coding and reliability | Raise claims to High confidence from primary sources | 13 | **Must** | To do | AIPD-205 |
| AIPD-202 | Verification, coding and reliability | Human review of AI-drafted coding | 8 | **Must** | To do | - |
| AIPD-203 | Verification, coding and reliability | Inter-coder reliability test | 8 | **Must** | To do | AIPD-202 |
| AIPD-204 | Verification, coding and reliability | Codebook version 1.0 | 3 | **Must** | To do | AIPD-203 |
| AIPD-301 | Track B: officeholders and state legislation | Officeholder profiles | 13 | **Must** | To do | - |
| AIPD-302 | Track B: officeholders and state legislation | Check licences for legislative data sources | 2 | **Must** | Done (Nov. 26, with AIPD-312) | - |
| AIPD-303 | Track B: officeholders and state legislation | Automatic bill data from official or open sources | 13 | **Must** | To do | AIPD-302 |
| AIPD-306 | Track B: officeholders and state legislation | Rhetoric-versus-action measure | 8 | **Must** | To do | AIPD-301, AIPD-305 |
| AIPD-404 | Track C: elections outside the U.S. (2027) | Record France's two-round result | 3 | **Must** | To do | - |
| AIPD-501 | Analysis and paper | RQ1 party comparison for the paper | 5 | **Must** | To do | AIPD-106, AIPD-202 |
| AIPD-503 | Analysis and paper | Conditional regulatory scenarios | 8 | **Must** | To do | - |
| AIPD-504 | Analysis and paper | Methods appendix | 3 | **Must** | To do | AIPD-203 |
| AIPD-506 | Analysis and paper | Paper draft | 13 | **Must** | To do | AIPD-501, AIPD-306, AIPD-503 |
| AIPD-601 | Dashboard experience and context | Usability and comprehension testing | 5 | **Must** | To do | - |
| AIPD-606 | Dashboard experience and context | Race details in a pop-up covering 80% of the screen | 5 | **Must** | To do | - |
| AIPD-104 | Track A: 2026 Senate candidates | Decide what happens to the Michigan Senate prototype drafts | 2 | **Should** | To do | - |
| AIPD-107 | Track A: 2026 Senate candidates | Race-level variables for deviation patterns | 5 | **Should** | To do | AIPD-102 |
| AIPD-206 | Verification, coding and reliability | Corrections and right-of-reply process | 3 | **Should** | To do | - |
| AIPD-304 | Track B: officeholders and state legislation | AI legislation for all 50 states | 13 | **Should** | To do | AIPD-303 |
| AIPD-305 | Track B: officeholders and state legislation | Voting records on key AI bills | 8 | **Should** | To do | AIPD-301, AIPD-303 |
| AIPD-401 | Track C: elections outside the U.S. (2027) | Complete France candidate coverage | 5 | **Should** | To do | - |
| AIPD-402 | Track C: elections outside the U.S. (2027) | Original-language quotes and translations | 3 | **Should** | To do | - |
| AIPD-403 | Track C: elections outside the U.S. (2027) | EU AI Act implementation stance | 5 | **Should** | To do | - |
| AIPD-502 | Analysis and paper | RQ2 deviation patterns | 5 | **Should** | To do | AIPD-107 |
| AIPD-505 | Analysis and paper | Versioned dataset release | 3 | **Should** | To do | AIPD-204, AIPD-302 |
| AIPD-602 | Dashboard experience and context | Search for people, races and bills | 5 | **Should** | To do | AIPD-301 |
| AIPD-605 | Dashboard experience and context | One public address for the live site | 1 | **Should** | To do | - |
| AIPD-205 | Verification, coding and reliability | Let the cloud environment open source sites | 1 | **Could** | To do | - |
| AIPD-307 | Track B: officeholders and state legislation | Notable officials beyond candidates | 8 | **Could** | To do | AIPD-301 |
| AIPD-405 | Track C: elections outside the U.S. (2027) | Manifesto model for parliamentary elections | 8 | **Could** | To do | - |
| AIPD-406 | Track C: elections outside the U.S. (2027) | U.S. vs. European party comparison | 8 | **Could** | To do | AIPD-403, AIPD-405 |
| AIPD-603 | Dashboard experience and context | Polling and prediction markets as labelled context | 8 | **Could** | To do | - |
| AIPD-604 | Dashboard experience and context | Privacy-preserving usage analytics | 2 | **Could** | To do | - |
| AIPD-105 | Track A: 2026 Senate candidates | Candidate and officeholder questionnaire | 5 | **Won't** | Won't do | - |

## Backlog stories

### Must-Must (added Nov. 26, 2026)

#### AIPD-111: Voter priorities: where AI ranks for voters in each race
*Must-Must · 8 points · Done (Nov. 26) · Proposal: RQ1 (salience), §7 (polling as context) · Depends on: AIPD-211*

As a researcher, I want published polls showing how voters in each tracked race ranked AI (and data centers) among the issues deciding their vote, so that voter salience can be set beside how much candidates talk about AI.

Acceptance criteria:
- [x] For each of the 8 races (7 U.S. and France), published polls found that ask voters their most important issues: state polls, exit polls (e.g. AP VoteCast), and French pollsters for France
- [x] Per poll: pollster, field dates, sample and population, margin of error, exact question wording, the share for the top 3-5 issues and for AI or data centers where asked, source link
- [x] Stored in a separate file (the Senate race files stay unchanged), with its own poll label: poll results are context, not facts about candidates
- [x] Where no published poll asked about AI, the race says "No published poll asked voters about AI as of [date]"; nothing is estimated or imputed
- [x] Every poll figure checked (verification.json); sources blocked here go through the ChatGPT hand-off (AIPD-211)

Note: Questionnaires skipped (AIPD-105); this replaces them as the voter-side evidence. Delivered Nov. 26: 5 issue polls (MI, TX, CT, CA, France) and 8 polls asking about AI or data centers. None of the issue polls published AI as an answer choice, so the charts say so; every state had a 2026 data center poll (59-79% opposed or wanted limits).

#### AIPD-112: Bar charts: importance of AI against the top issues, per race
*Must-Must · 5 points · Done (Nov. 26) · Proposal: RQ1, §7 · Depends on: AIPD-111*

As a reader, I want a bar chart on each race showing how voters ranked AI against the top 3-5 issues so that I can see at a glance how much AI mattered to their decision.

Acceptance criteria:
- [x] A horizontal bar chart on every race page (compact version in the state and country pop-ups): the top 3-5 issues plus AI or data centers, sorted by share, AI highlighted
- [x] Each chart shows the poll, field dates, sample size, margin of error and question wording, and the label "Poll result: context, not a prediction"
- [x] Values printed on the bars, a table alternative for screen readers, readable on a phone; colours are not the party colours
- [x] If AI was not among the options, the chart shows the issues and says so
- [x] A summary chart on the Policy analysis page compares where AI ranked in each race

Note: Delivered Nov. 26: charts on every race page, the state and France pop-ups, and a race-by-race summary on the Policy analysis page; palette checked with the data-viz validator.

#### AIPD-211: Hand-off list and ChatGPT prompt for claims Claude cannot verify
*Must-Must · 3 points · Done (Nov. 26) · Proposal: §5, §10 item 4*

As the project owner, I want every claim Claude cannot check against its primary source listed with a ready-to-paste ChatGPT prompt so that I can verify them there and feed the results back.

Acceptance criteria:
- [x] Claude first tries to open each primary source; if blocked, the claim goes on the list
- [x] verify-list.csv with every claim, its batch and what is still unconfirmed, most urgent first
- [x] Ready-to-paste batches (prompt plus 12 claims each) demanding primary sources, opened pages only and verbatim quotes
- [x] A fixed JSON reply format Claude can read back

Note: Done Nov. 26, 2026: 138 claims in 12 batches. Every source site tested (Congress, the four legislatures, NCSL, IAPP, MultiState, Gallup, Pew, AP, NBC, EU and French official sites) was blocked from the cloud environment.

#### AIPD-212: Import ChatGPT verification results
*Must-Must · 5 points · In progress (batches 01-10 of 14 imported; tool in tools/import_chatgpt.py) · Proposal: §5, §8, §10 item 4 · Depends on: AIPD-211*

As the project owner, I want to paste ChatGPT's answers here and have them applied consistently so that verified claims rise to High confidence and wrong ones are corrected.

Acceptance criteria:
- [ ] The reply is checked: valid JSON, known ids, a URL for every verified or contradicted claim
- [ ] Verified from an official, campaign, transcript or election-office source with a verbatim quote and date: High confidence; from news only: Medium
- [ ] Contradicted: the record is corrected with a new version and note; partly verified or not found: stays Low with the tiny note
- [ ] The method is recorded on every change ("checked against the primary source with ChatGPT web browsing, relayed by the project owner on [date]") and summarised on the Methodology page
- [ ] Validator, build, page tests pass; merged and deployed

Note: Starts when you paste the first batch of results.

#### AIPD-311: Public opinion on AI by party from Gallup and Pew
*Must-Must · 5 points · Done (Nov. 26) · Proposal: RQ1, RQ2, §4 Track B · Depends on: AIPD-211*

As a researcher, I want publicly available Gallup and Pew findings on Americans' views of AI and data centers, by party, so that each party's line can be compared with what its voters think.

Acceptance criteria:
- [x] Only publicly released toplines and crosstabs; each organisation's terms of use checked and recorded
- [x] Figures by party (Democrats, Republicans, independents) on AI concern, support for regulation, trust, and data centers where asked
- [x] Per figure: report title, field dates, sample, margin of error, question wording, link
- [x] Shown as bar charts on the Party comparison page beside the party lines; every figure checked

Note: Delivered Nov. 26: 8 findings (6 Pew, 2 Gallup) charted by party on the Party comparison page, cited with publication dates and links as both terms allow. Figures came via web search; batch 13 of the ChatGPT hand-off confirms them against the releases.

#### AIPD-312: Legislation sourced from the IAPP, NCSL and MultiState trackers
*Must-Must · 8 points · Done (Nov. 26) · Proposal: §4 Track B · Depends on: AIPD-302*

As a researcher, I want AI bills drawn from the IAPP, NCSL and MultiState trackers, each confirmed on the official legislature site, so that the legislation layer is complete and cross-checked.

Acceptance criteria:
- [x] Terms of use checked and recorded first (NCSL's database is powered by LexisNexis State Net): bill facts used with attribution and links; tracker summaries not copied
- [x] For Michigan, Texas, Connecticut, California and federal: every AI and data center bill each tracker lists, with missing bills added
- [x] Each added bill cites the official legislature page as its primary source
- [x] Each bill shows which trackers list it; a coverage table per state compares our count with each tracker and flags disagreements
- [x] Every added bill checked; validator passes

Note: Delivered Nov. 26: terms of use checked; 25 bills added (MI 6, TX 6, CT 4, CA 5, federal 4), most confirmed on the legislature record; coverage by tracker shown on every bill and a comparison table with the trackers' published counts on the Legislation page. "Covered by" means named on the tracker's site or in its reports: the databases could not be opened. Batch 14 of the ChatGPT hand-off covers the new bills.

### Epic: Track A: 2026 Senate candidates

#### AIPD-101: Archive campaign pages before they go offline
*Must · 3 points · To do · Proposal: §4 Track A (archive and timestamp)*

As a researcher, I want every candidate's campaign pages and cited statements archived with a timestamp so that sources survive after campaigns take their sites down.

Acceptance criteria:
- [ ] Each candidate record has an archive link (Wayback Machine or Perma.cc) and capture date
- [ ] All 22 candidates' issue pages archived
- [ ] The validator warns when a record has no archive link

Note: Time-sensitive: campaign sites start disappearing after Nov. 3.

#### AIPD-102: Final race list with published selection criteria
*Must · 3 points · To do · Proposal: §4 Track A*

As a faculty reviewer, I want the 10-20 Senate races chosen by stated criteria so that the sample is defensible and not cherry-picked.

Acceptance criteria:
- [ ] Criteria (competitiveness rating, open seat vs. incumbent, party balance, AI and data center activity) published on the Methodology page
- [ ] A race list of 10-20 Senate races with the reason for each
- [ ] The proposal's "Final race list [TO BE VERIFIED]" is resolved

#### AIPD-103: Add the next five Senate races
*Must · 8 points · To do · Proposal: §4 Track A, §12 · Depends on: AIPD-102, AIPD-101*

As a reader, I want more 2026 Senate races profiled so that the dataset can answer RQ1-RQ4.

Acceptance criteria:
- [ ] 5 new race files with candidates and results
- [ ] Each candidate's AI and data center statements sourced, coded, headlined and categorised
- [ ] Every claim checked; pages pass the navigation tests

Note: Repeat until 10-20 races (2-3 sprints).

#### AIPD-104: Decide what happens to the Michigan Senate prototype drafts
*Should · 2 points · To do · Proposal: §4 (Michigan to full standard)*

As the project owner, I want a decision on the 42 prototype drafts (unsourced; quotes not found; 3 contradicted) so that the pilot race reaches "full standard".

Acceptance criteria:
- [ ] Decision recorded: keep hidden, mark superseded, or replace
- [ ] If superseded: marked through a separate file so the race file stays unchanged
- [ ] Sourced records replace them as the Michigan Senate evidence

Note: Needs your decision: you asked for the two Senate race files to stay unchanged.

#### AIPD-105: Candidate and officeholder questionnaire
*Won't · 5 points · Won't do · Proposal: §8 (campaign questionnaires)*

As a reader, I want every candidate or officeholder asked the same questions by a fixed deadline so that positions are compared fairly and silence is visible.

Acceptance criteria:
- [ ] One questionnaire (same questions for all), approved by advisors
- [ ] Sent log with dates and a fixed deadline
- [ ] Responses stored with the evidence type "questionnaire response"
- [ ] Non-response shown as "No response received as of [date]"

Note: Skipped by your decision on Nov. 26, 2026; voter-priority polling (AIPD-111, AIPD-112) is used instead.

#### AIPD-106: Measure AI salience per candidate
*Must · 8 points · To do · Proposal: RQ1 · Depends on: AIPD-101*

As a researcher, I want to measure how often and how prominently each candidate discusses AI so that RQ1's salience question can be answered.

Acceptance criteria:
- [ ] A written definition (e.g. share of press releases, debates and ads that mention AI, normalised per candidate)
- [ ] A salience figure per candidate with its sources
- [ ] Shown on race and party pages; method on the Methodology page

Note: Sparse coverage is itself a finding (§11).

#### AIPD-107: Race-level variables for deviation patterns
*Should · 5 points · To do · Proposal: RQ2 · Depends on: AIPD-102*

As a researcher, I want competitiveness, incumbency and each state's AI and data center profile recorded per race so that I can test what explains deviation (RQ2).

Acceptance criteria:
- [ ] A sourced variables file: race rating, open seat or incumbent, result margin, data center capacity, tech employment
- [ ] Included in downloads

#### AIPD-109: Build out Florida
*Must · 8 points · To do · Proposal: §4 Track A (states with significant AI activity) · Depends on: AIPD-111*

As a reader, I want Florida's 2026 races and AI legislation in the same format as Michigan, Texas, Connecticut and California so that a large state with heavy data center and AI activity is covered.

Acceptance criteria:
- [ ] Both 2026 statewide races added: governor (open seat) and the U.S. Senate special election, with candidates and results from official sources
- [ ] Each candidate's AI and data center statements and plans sourced, coded, headlined and categorised (said vs. proposed; data centers vs. everything else in AI)
- [ ] Florida AI and data center bills and the governor's AI proposals added, with sponsors, status and categories
- [ ] Deviation from the party lines shown for both races; Florida appears on the map, pop-up and Policy analysis page
- [ ] Voter-priority polls and charts for both races (with AIPD-111 and AIPD-112); every claim checked; page tests pass

Note: Florida's Senate seat is a 2026 special election, so it fits Track A directly.

#### AIPD-108: Certified election results
*Must · 2 points · To do · Proposal: §9 (record outcomes)*

As a researcher, I want certified results once states certify so that outcomes rest on official counts.

Acceptance criteria:
- [ ] Each result updated from the official canvass when published (Michigan, Texas, Connecticut; California by Dec. 11)
- [ ] Status Certified, High confidence, official source, new version

Note: No 2026 race had a reported certification as of Nov. 24.

### Epic: Verification, coding and reliability

#### AIPD-201: Raise claims to High confidence from primary sources
*Must · 13 points · To do · Proposal: §5, §10 item 4 · Depends on: AIPD-205*

As a reader, I want key claims checked against their primary source so that I can cite them.

Acceptance criteria:
- [ ] A person opens each source and confirms wording, speaker and date
- [ ] Start with the 36 partly confirmed and 18 not confirmed claims
- [ ] Confidence set to High with the primary source; history note added

Note: Now done mainly through AIPD-211 and AIPD-212 (ChatGPT hand-off), since the cloud environment blocks the source sites.

#### AIPD-202: Human review of AI-drafted coding
*Must · 8 points · To do · Proposal: §5 (codebook piloted on MI and TX)*

As a researcher, I want a person to review every AI-drafted code so that the dataset is not model output.

Acceptance criteria:
- [ ] Every record's coding reviewed; reviewed flag set with coder initials
- [ ] Disagreements logged and resolved

Note: None of the 158 records has reviewed coding yet.

#### AIPD-203: Inter-coder reliability test
*Must · 8 points · To do · Proposal: §9 (reliability testing), §11 · Depends on: AIPD-202*

As a faculty reviewer, I want reliability statistics so that the coding can be trusted and bias claims answered.

Acceptance criteria:
- [ ] Two coders independently code a sample of at least 20%
- [ ] Krippendorff's alpha per dimension computed and published
- [ ] Codebook rules revised where agreement is low

#### AIPD-204: Codebook version 1.0
*Must · 3 points · To do · Proposal: §5, §6 item 1 · Depends on: AIPD-203*

As a researcher, I want a frozen, documented codebook so that the paper and dataset use one stable scheme.

Acceptance criteria:
- [ ] Changes from the pilot recorded in a changelog (e.g. copyright, digital sovereignty)
- [ ] Version 1.0 published with the dataset

#### AIPD-205: Let the cloud environment open source sites
*Could · 1 points · To do · Proposal: -*

As the maintainer, I want the cloud environment allowed to open news, legislature and government sites so that checks can read sources rather than search summaries.

Acceptance criteria:
- [ ] Network access widened (or the main hosts allowlisted) in the environment settings
- [ ] A test fetch of congress.gov, a state legislature site and a news site succeeds

Note: A settings change on your side; it speeds up AIPD-201.

#### AIPD-206: Corrections and right-of-reply process
*Should · 3 points · To do · Proposal: §8 (corrections)*

As a candidate or campaign, I want a clear way to request a correction or reply so that errors are fixed openly.

Acceptance criteria:
- [ ] A GitHub issue template or form for corrections and replies
- [ ] A stated response time
- [ ] A public corrections log listing each change and date

### Epic: Track B: officeholders and state legislation

#### AIPD-301: Officeholder profiles
*Must · 13 points · To do · Proposal: §1 Stage 2, §4 Track B*

As a reader, I want a page per politician (candidates, winners, sitting officials) with their statements, bills and votes so that the site is a one-stop shop.

Acceptance criteria:
- [ ] Person data model linking candidate records, bill sponsorships and votes
- [ ] A person page (#/person/<id>) for every candidate and sponsor already in the data
- [ ] Senators-elect and governors-elect from the tracked races included

Note: Can be split: data model (8) + linking existing records (5).

#### AIPD-302: Check licences for legislative data sources
*Must · 2 points · Done (Nov. 26, with AIPD-312) · Proposal: §4 Track B [TO VERIFY licensing]*

As the project owner, I want each data source's terms checked so that the dataset can be published legally.

Acceptance criteria:
- [x] Terms recorded for NCSL (LexisNexis State Net), IAPP, MultiState, LegiScan and Open States
- [x] Decision on primary sources; third-party trackers used for validation only

#### AIPD-303: Automatic bill data from official or open sources
*Must · 13 points · To do · Proposal: §4 Track B, §9 (Jan-Mar 2027) · Depends on: AIPD-302*

As a researcher, I want bill status and sponsors pulled from official or open legislative data so that the layer stays current through the 2027 sessions.

Acceptance criteria:
- [ ] Import script for the chosen source (e.g. Open States or LegiScan API)
- [ ] A scheduled GitHub Action opens a pull request with status changes
- [ ] Imported bills pass the validator; changes are versioned

Note: 2027 sessions open in January (Texas on Jan. 12).

#### AIPD-304: AI legislation for all 50 states
*Should · 13 points · To do · Proposal: §4 Track B · Depends on: AIPD-303*

As a reader, I want every state on the map to show its AI legislative activity so that I can compare states, not only those with tracked races.

Acceptance criteria:
- [ ] AI and data center bills (2025-2027) for all states, categorised
- [ ] Map shading by legislative activity
- [ ] Counts cross-checked against IAPP and NCSL trackers

#### AIPD-305: Voting records on key AI bills
*Should · 8 points · To do · Proposal: §5 (evidence type), RQ3 · Depends on: AIPD-301, AIPD-303*

As a researcher, I want officeholders' votes on key AI bills so that actions can be compared with words.

Acceptance criteria:
- [ ] Roll-call votes stored per bill and person (evidence type "voting record")
- [ ] Shown on bill and person pages

#### AIPD-306: Rhetoric-versus-action measure
*Must · 8 points · To do · Proposal: RQ3, §6 item 3 · Depends on: AIPD-301, AIPD-305*

As a researcher, I want each politician's statements compared with their bills and votes so that RQ3 is answered with a stated method.

Acceptance criteria:
- [ ] A published method for matching stances to bills and votes
- [ ] A table per politician and per state on the Policy analysis page
- [ ] Included in downloads

Note: Core contribution of the paper.

#### AIPD-307: Notable officials beyond candidates
*Could · 8 points · To do · Proposal: §1 Stage 2 · Depends on: AIPD-301*

As a reader, I want key officials (party leaders, governors, former presidents, city leaders) profiled so that the site covers who shapes AI policy.

Acceptance criteria:
- [ ] Selection list with criteria
- [ ] Profiles with sourced statements and actions

### Epic: Track C: elections outside the U.S. (2027)

#### AIPD-401: Complete France candidate coverage
*Should · 5 points · To do · Proposal: §4 Track C, §9 (Mar-May 2027)*

As a reader, I want sourced AI and data center positions for every French candidate so that the comparison is balanced.

Acceptance criteria:
- [ ] At least two sourced records per candidate, or "no statements found as of [date]"
- [ ] Le Pen, Attal and Tondelier covered (now thin or empty)
- [ ] Every claim checked

#### AIPD-402: Original-language quotes and translations
*Should · 3 points · To do · Proposal: §8 (international cases)*

As a researcher, I want French statements stored in the original with a noted translation so that coding is faithful to what was said.

Acceptance criteria:
- [ ] Fields for original text, language and translation note
- [ ] Original shown on hover; validator requires it for French records

#### AIPD-403: EU AI Act implementation stance
*Should · 5 points · To do · Proposal: §4 Track C (EU AI Act)*

As a researcher, I want French positions coded on how to implement and enforce the EU AI Act so that the comparison reflects that EU members do not decide whether to regulate.

Acceptance criteria:
- [ ] A policy question for EU AI Act implementation (scope: EU)
- [ ] Each French candidate coded; shown in "where the candidates stand"

#### AIPD-404: Record France's two-round result
*Must · 3 points · To do · Proposal: §9 (Mar-May 2027)*

As a reader, I want both rounds of France's election recorded so that the outcome is part of the analysis.

Acceptance criteria:
- [ ] Result model supports a first round and a runoff
- [ ] Results recorded after April 18 and May 2, 2027

Note: Due in April-May 2027.

#### AIPD-405: Manifesto model for parliamentary elections
*Could · 8 points · To do · Proposal: §4 Track C, §7 item 5, §9 (later 2027)*

As a researcher, I want party manifestos as the unit of analysis so that parliamentary elections can be compared.

Acceptance criteria:
- [ ] Data model and validator for parties and manifesto sections
- [ ] Party profile page
- [ ] One pilot country coded (Poland or Italy)

#### AIPD-406: U.S. vs. European party comparison
*Could · 8 points · To do · Proposal: RQ5 · Depends on: AIPD-403, AIPD-405*

As a researcher, I want U.S. parties compared with French and other European parties on shared dimensions so that RQ5 is answered.

Acceptance criteria:
- [ ] Comparable dimensions defined (EU AI Act context explicit)
- [ ] A comparison page and CSV

### Epic: Analysis and paper

#### AIPD-501: RQ1 party comparison for the paper
*Must · 5 points · To do · Proposal: RQ1, §6 item 2 · Depends on: AIPD-106, AIPD-202*

As the author, I want the salience and substance comparison by party, with tables and tests, so that RQ1 has results.

Acceptance criteria:
- [ ] Salience and position by party, with uncertainty
- [ ] Convergence on specific harms vs. divergence on instruments and level of government reported
- [ ] Figures exportable for the paper

#### AIPD-502: RQ2 deviation patterns
*Should · 5 points · To do · Proposal: RQ2 · Depends on: AIPD-107*

As the author, I want deviation tested against race variables so that RQ2's "identifiable patterns" question is answered.

Acceptance criteria:
- [ ] Deviation compared across competitiveness, incumbency and state profile
- [ ] Results with stated limits (small sample)

#### AIPD-503: Conditional regulatory scenarios
*Must · 8 points · To do · Proposal: RQ4, §6 item 4, §11*

As a reader, I want possible directions for state and federal AI rules, each with its assumptions, so that projections are not read as predictions.

Acceptance criteria:
- [ ] Scenarios that state their assumptions (chamber control, preemption outcome, court decisions)
- [ ] Each linked to coded evidence, labelled "Projection" with a confidence level
- [ ] A scenarios page

#### AIPD-504: Methods appendix
*Must · 3 points · To do · Proposal: §10 item 4 · Depends on: AIPD-203*

As a faculty reviewer, I want a methods appendix covering sources, verification, reliability and limitations so that the work can be assessed.

Acceptance criteria:
- [ ] A document generated from the Methodology page plus reliability results
- [ ] Limitations section (search-based checks, sample size)

#### AIPD-505: Versioned dataset release
*Should · 3 points · To do · Proposal: §6 item 1, §10 item 2 · Depends on: AIPD-204, AIPD-302*

As an outside researcher, I want a citable, versioned release of the data and codebook so that I can reuse it.

Acceptance criteria:
- [ ] Tagged release with a licence and changelog
- [ ] Archived with a DOI (e.g. Zenodo)

#### AIPD-506: Paper draft
*Must · 13 points · To do · Proposal: §10 item 3, §9 (May-Jun 2027) · Depends on: AIPD-501, AIPD-306, AIPD-503*

As the author, I want a full draft of the paper so that the findings reach readers.

Acceptance criteria:
- [ ] Draft covering RQ1-RQ4 (RQ5 as an extension)
- [ ] Every figure traceable to dashboard records

Note: Research work rather than development.

### Epic: Dashboard experience and context

#### AIPD-601: Usability and comprehension testing
*Must · 5 points · To do · Proposal: §9 (May-Jun 2027), §8 (privacy)*

As the project owner, I want readers tested on key tasks so that the dashboard is understood as intended.

Acceptance criteria:
- [ ] 5-8 participants complete set tasks (find a race, read a label, find a source)
- [ ] Findings turned into backlog items
- [ ] Any formal survey goes through consent and IRB review

#### AIPD-602: Search for people, races and bills
*Should · 5 points · To do · Proposal: §1 (one-stop shop) · Depends on: AIPD-301*

As a reader, I want to search by name or bill number so that I can find anything quickly.

Acceptance criteria:
- [ ] A search box covering candidates, officeholders, bills and races
- [ ] Works by keyboard; results link to the right page

#### AIPD-603: Polling and prediction markets as labelled context
*Could · 8 points · To do · Proposal: §7*

As a reader, I want polls and market odds shown as forecasts so that I get context without mistaking it for fact.

Acceptance criteria:
- [ ] A backend proxy for market data (e.g. Kalshi), with terms checked
- [ ] Labelled "Forecast, not fact" and kept apart from records

#### AIPD-604: Privacy-preserving usage analytics
*Could · 2 points · To do · Proposal: §8 (privacy)*

As the project owner, I want anonymous page counts so that I know which views are used.

Acceptance criteria:
- [ ] Cookieless analytics only
- [ ] Privacy statement updated (it now says no analytics)

#### AIPD-606: Race details in a pop-up covering 80% of the screen
*Must · 5 points · To do · Proposal: §7 (interactive map, state modal)*

As a reader, I want each Senate or governor race to open in a large pop-up over the map (80% of the screen) so that I can read a race without losing my place.

Acceptance criteria:
- [ ] Opening a race shows it in a pop-up 80% of the screen wide and high, over the map; on phones it fills the screen
- [ ] Close button, Escape key and clicking outside close it; focus stays inside while open and returns to where it was
- [ ] Each race keeps its own link (#/state/XX/<race>), and the browser back button closes the pop-up
- [ ] One scroll area inside the pop-up and no background blur, to avoid the blank screen reported on Nov. 16
- [ ] Page tests pass for every race on desktop and phone, with drafts on and off, including WebKit (Safari engine)

Note: Races moved from a pop-up to full pages on Nov. 16 after the blank-screen report; this brings the pop-up back with those fixes built in.

#### AIPD-605: One public address for the live site
*Should · 1 points · To do · Proposal: §7*

As a reader, I want one live site that always matches the tested code so that I never see an outdated copy.

Acceptance criteria:
- [ ] The proposal and README point to the GitHub-deployed site (Vercel or Pages)
- [ ] The Replit copy either syncs automatically or is retired

Note: The Replit copy has fallen behind before.

## Time-sensitive items

- **AIPD-111** (voter-priority polls): post-election exit polls and AP VoteCast are easiest to source now, while coverage is fresh.
- **AIPD-101** (archive campaign pages): campaign sites go offline after the election.
- **AIPD-108** (certified results): states certify through December; California by Dec. 11.
- **AIPD-302 / AIPD-303** (bill data): 2027 sessions open in January; Texas on Jan. 12.
- **AIPD-404** (France result): April 18 and May 2, 2027.
- Spain's snap election (Nov. 29, 2026) falls before any manifesto model exists (AIPD-405), so it is not in scope.
