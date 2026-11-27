# Methods appendix

Generated from the dashboard's data on 2026-11-27 (site version 2026-11-27.7, codebook 1.0-rc1) by `npm run appendix`. The Methodology page on the site is the readable version of the same definitions; this appendix adds the current counts, the reliability results (when available) and the limitations.

## 1. Scope and sample

8 races (7 in the United States, 1 abroad), 22 candidates, 48 candidate records, 74 bills and announced proposals, 12 party-line positions and 7 election results.

| Race | Place | Election | Candidates | Records |
|---|---|---|---|---|
| Governor | CA | 2026-11-03 | 2 | 5 |
| Governor | CT | 2026-11-03 | 2 | 7 |
| U.S. House (CT-4) | CT | 2026-11-03 | 2 | 5 |
| President | FR | 2027-04-18 / runoff 2027-05-02 | 8 | 10 |
| Governor | MI | 2026-11-03 | 2 | 6 |
| U.S. Senate | MI | 2026-11-03 | 2 | 5 |
| Governor | TX | 2026-11-03 | 2 | 5 |
| U.S. Senate | TX | 2026-11-03 | 2 | 5 |

### Senate race selection

The sample is drawn from all 35 Senate contests of 2026 by the criteria below, applied in order to facts gathered before the list was drawn. It has 15 races: every competitive race, plus races where AI or data centers were a campaign issue, kept between 10 and 20 races, each profiling both parties' nominees. Michigan and Texas, the pilot races, are tracked; the five highest-ranked others are added next (AIPD-103). Before the election, 11 of the 15 seats were held by Republicans and 4 by Democrats.

| State | Seat | Rating | Result | Why it is in the sample |
|---|---|---|---|---|
| AK | Incumbent | Toss-up | Mary Peltola (D), flip | Rated Toss-up; no AI or data center exchange between the candidates found. |
| GA | Incumbent | Likely D | Jon Ossoff (D) | Rated Likely D; AI or data centers in the race: Debate: Ossoff tied the 2025 budget bill's tax breaks to data center developers; Collins said he favors local control (Roll Call, Oct 19, 2026). |
| IA | Open | Toss-up | Josh Turek (D), flip | Rated Toss-up; open seat (incumbent retired); no AI or data center exchange between the candidates found. |
| KS | Incumbent | Toss-up | Adam Hamilton (D), flip | Rated Toss-up; AI or data centers in the race: Incumbent Marshall 'rails against AI data centers' (Semafor interview, Jul 22, 2026): backs local moratoriums and opposes tax incentives. No Hamilton statement found. |
| ME | Incumbent | Toss-up | Troy Jackson (D), flip | Rated Toss-up; AI or data centers in the race: NPR's data center ad analysis quotes Jackson calling for 'real guardrails' so data centers don't raise others' power bills or hurt water quality. |
| MI | Open | Toss-up | Abdul El-Sayed (D) | Rated Toss-up; open seat (incumbent retired); AI or data centers in the race: El-Sayed's campaign held an anti-data-center rally near the OpenAI/Oracle Stargate site in Saline Township ('if the community here opposes this data center, then I do'). That was during the primary; in the general he backed 'terms of engagement' (NPR). |
| MN | Open | Lean D | Peggy Flanagan (D) | Rated Lean D; open seat (incumbent retired); no AI or data center exchange between the candidates found. |
| MS | Incumbent | Likely R | Scott Colom (D), flip | Rated Likely R; AI or data centers in the race: Colom called for a temporary statewide pause on new data centers and hit Hyde-Smith for not backing the Ratepayer Protection Act (Mississippi Today, Sept 24, 2026). |
| MT | Open | Solid R | Kurt Alme (R) | Rated Solid R; open seat (incumbent did not seek reelection, withdrawing at the Mar. 4, 2026 filing deadline); AI or data centers in the race: Candidates laid out data center/AI positions: Bankhead called for a moratorium on large data centers, Bodnar offered a 'Protect Montana' pledge, and Alme backs cost disclosure and the Ratepayer Protection Act. |
| NC | Open | Likely D | Roy Cooper (D), flip | Rated Likely D; open seat (incumbent retired); AI or data centers in the race: Whatley's campaign attacked Cooper for recruiting and subsidizing data centers as governor; Cooper backed local say and making data centers pay their own energy costs (Fox News). |
| NE | Incumbent | Lean R | Pete Ricketts (R) | Rated Lean R; AI or data centers in the race: Osborn ads attacked Ricketts' record of data center tax incentives as governor ($519M property-tax exemptions 2021-Jun 2026 per state estimate) and his AI investments; Ricketts called data centers 'a community decision'. |
| NH | Open | Lean D | Chris Pappas (D) | Rated Lean D; open seat (incumbent retired); AI or data centers in the race: NHPR candidate guide: both Pappas and Sununu said they support a state-level moratorium on data center construction; Pappas called NH 'not the right place for AI data centers'. |
| OH | Incumbent | Toss-up | Sherrod Brown (D), flip | Rated Toss-up; AI or data centers in the race: Brown ran multiple ads calling Husted 'the face of data centers in Ohio' over tax deals as lieutenant governor; a leaked GOP memo called data centers the 'anchor' around Husted's neck. |
| SC | Incumbent | Lean R | Annie Andrews (D), flip | Rated Lean R; AI or data centers in the race: Andrews called for a two-year statewide moratorium on new data centers and accused Darline Graham of benefiting from ~$5M in data-center-linked PAC spending. |
| TX | Open | Toss-up | James Talarico (D), flip | Rated Toss-up; open seat (incumbent lost the May 26, 2026 Republican primary runoff to Ken Paxton); AI or data centers in the race: Talarico ads accused Paxton of 'selling off Texas' to data center firms, tying data centers to cost of living and corruption (NPR/AdImpact analysis). |

## 2. Records and labels

Every record has exactly one label type, a source, a publication date, a last-verified date, a confidence level and a version history. Records are never silently overwritten: each change raises the version and adds a dated note.

| Label type | Meaning | Records |
|---|---|---|
| Direct quote | The speaker's exact words, from a cited source. | 0 |
| Reported fact | A factual claim reported by a cited source. | 0 |
| Source-based summary | A summary written by the project from cited sources. | 48 |
| Model-generated analysis | Analysis produced with an AI model; not a statement by the candidate. | 0 |
| Projection | A conditional, forward-looking estimate. Not a prediction or a fact. | 0 |
| Editorial judgment | A judgment by the project team, with criteria disclosed in the methodology. | 0 |

| Confidence | Meaning | Records |
|---|---|---|
| High | Checked against a primary source; wording and date confirmed. | 17 |
| Medium | Checked against a reliable secondary source. | 21 |
| Low | Checked, but the source is weak or the context is incomplete. | 10 |
| Unverified draft | Not yet checked against any source. Hidden from the public view by default. | 0 |

Two policy areas (Data centers; Everything else in AI) and two tracks (What is said; What is proposed) split every view; 22 policy categories group statements and proposals.

## 3. Coding scheme

Codebook 1.0-rc1. Release candidate for version 1.0 (Nov. 27, 2026): the scheme as used across Michigan, Texas, Connecticut, California and France. It is frozen as 1.0 after human review of the AI-drafted coding (AIPD-202) and the inter-coder reliability test (AIPD-203). Changes since the pilot draft are listed in documents/codebook/CHANGELOG.md.

| Dimension | Categories |
|---|---|
| Regulatory orientation | Precautionary; Balanced; Innovation-first; Unclear |
| Level of government | Federal; State; International; Preemption stance |
| Policy instruments | Disclosure; Audits; Liability; Licensing; Bans; Funding; Procurement rules; Voluntary standards |
| Issue areas | Safety; Labor; Privacy; Child safety; Deepfakes and elections; Discrimination; National security and China; Energy and data centers; Innovation and competitiveness |
| Specificity | General rhetoric; Stated principle; Concrete proposal; Legislative action |
| Evidence type | Direct quote; Reported; Voting record; Bill; Questionnaire response |

Coding status: 48 of 48 candidate records carry AI-drafted coding not yet reviewed by a person (AIPD-202).

## 4. Verification

Each claim was searched on the web and compared with what reliable sources (official legislature and government sites, established news outlets, law-firm and policy analyses) report, in two rounds on 2026-11-24: a first pass over every claim, then a second pass over every claim not yet searched or only partly confirmed. The source pages themselves could not be opened from the build environment, so checks rest on search results and their summaries: confirmed claims are raised to Medium confidence, never High, which needs the primary source to be read. Claims are then checked against their primary source by the project owner using ChatGPT with web browsing, batch by batch, and relayed here with the source, a verbatim quote and the date: verified from a primary source with a confirmed date is High confidence; verified without a confirmed date, or only from news reports, is Medium.

Primary-source checks: the build environment cannot open most source sites, so the project owner checks claims against the primary source with ChatGPT (web browsing) and relays the results, which are imported claim by claim with recorded decisions (documents/chatgpt-verification). Relays so far: 01 (12 claims, 2026-11-26); 02 (12 claims, 2026-11-27); 03 (12 claims, 2026-11-27); 04 (12 claims, 2026-11-27); 05 (12 claims, 2026-11-27); 06 (12 claims, 2026-11-27); 07 (12 claims, 2026-11-27); 08 (12 claims, 2026-11-27); 09 (12 claims, 2026-11-27); 10 (12 claims, 2026-11-27).

| Check result | Claims |
|---|---|
| confirmed | 119 |
| corrected | 43 |
| not-confirmed | 23 |
| partly-confirmed | 22 |
| not-checkable | 14 |
| contradicted | 3 |

| Method of the latest check | Claims |
|---|---|
| primary source (relayed) | 120 |
| web search, other reports | 104 |

Of 210 checkable claims, 162 (77%) are confirmed or corrected, and 55 (26%) are at High confidence (wording and date checked against the primary source).

## 5. Election results and certification

Results carry their own label and are stored apart from statements. Each records when and where its figures were taken and where the official canvass stands.

| Result | Status | Certification | Figures as of |
|---|---|---|---|
| result-mi-senate-2026 | unofficial | certified (2026-11-23) | Unofficial results as of 2:30 p.m., Nov. 4, 2026 (The Detroit News); Fox's later count rounds to the same shares. |
| result-tx-senate-2026 | unofficial | pending | Unofficial returns from the Texas Secretary of State (last updated Nov. 4, 2026), including write-ins. |
| result-mi-governor-2026 | unofficial | certified (2026-11-23) | Decision Desk HQ count (race called Nov. 3, 10:45 p.m.). |
| result-tx-governor-2026 | unofficial | pending (expected January 2027) | Unofficial returns from the Texas Secretary of State (last updated Nov. 4, 2026), including write-ins. |
| result-ct-governor-2026 | unofficial | canvass-complete (2026-11-25) | Unofficial shares as listed by MultiState (Nov. 16, 2026). |
| result-ct-house-04-2026 | unofficial | canvass-complete (2026-11-25) | Unofficial results as listed by Decision Desk HQ. |
| result-ca-governor-2026 | unofficial | pending (expected 2026-12-11) | Unofficial results from the California Secretary of State's results file, Nov. 26, 2026. |

## 6. Party lines and deviation

12 party-line positions built from 26 pieces of evidence. Party lines are an editorial judgment from the evidence listed; their confidence is Medium only when every piece of evidence is confirmed.

| Confidence | Positions |
|---|---|
| medium | 11 |
| low | 1 |

## 7. Voter priorities, public opinion and trackers

13 published polls on voters' issue priorities or AI (shown as context, not predictions); 8 Gallup and Pew findings by party; legislation found through IAPP US State AI Governance Legislation Tracker, NCSL Artificial Intelligence Legislation Database, MultiState AI legislation tracker and confirmed on official records where possible.

## 8. Archived sources

1 of 45 pages cited by candidate records has an archived copy (AIPD-101); 0 campaign pages are archived.

## 9. Reliability

Pending (AIPD-202, AIPD-203). Planned design: a person reviews every AI-drafted code; then two coders independently code a sample of at least 20% of records, and Krippendorff's alpha is reported for each coding dimension, with codebook rules revised where agreement is low. Results will be reported here, and the codebook frozen as version 1.0.

## 10. Limitations

- Sample size: 8 races and 22 candidates; findings describe these races, not all 2026 contests.
- Search-based checks: 104 claims were last checked by comparing other published reports on the web, not the primary source; these are at most Medium confidence.
- Relayed primary-source checks: primary sources were opened by the project owner through ChatGPT, not directly by the build environment; each relay and decision is kept in documents/chatgpt-verification so it can be audited.
- Coding: 48 of 48 records have AI-drafted coding not yet reviewed by a person, and inter-coder reliability has not yet been measured.
- Election results: 7 of 7 results still show unofficial figures until certified figures are entered.
- Sparse coverage: candidates who said little about AI have few records; that sparseness is recorded rather than filled in, and is itself a finding about salience.
- Party lines: built from leaders' statements and actions (the Trump administration; incoming Democratic congressional leaders), so they simplify parties with internal disagreement.
- Trackers: a bill counts as covered by a tracker when it is named on the tracker's site or in its reports; the trackers' databases themselves could not be queried.
- France: the 2027 race is in progress; positions and the candidate field may change before April 2027.
