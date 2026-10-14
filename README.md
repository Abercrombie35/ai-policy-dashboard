U.S. SENATE AI POLICY MAP

Project overview, website guide, and next steps

1. WHAT THIS PROJECT DOES
=========================

This website is a prototype dashboard for exploring how U.S. Senate candidates
approach artificial intelligence policy. It brings candidate information,
policy positions, quotes, and possible policy outcomes into one comparison.

The home page contains an interactive U.S. map with two-letter state labels.
Clicking a state opens a pop-up panel. Michigan currently has a detailed
Senate-race example comparing Abdul El-Sayed and Mike Rogers. Other states
display a "No data yet" message.

The Michigan comparison includes:
- Candidate biographies and AI policy stances.
- Sample polling numbers and trends.
- Quotes with source labels, dates, and context.
- AI policy positions.
- Party-alignment scores, deviations, and endorsements.
- Policy projections and proposed initiatives if elected.
- A demonstration prediction-market panel labeled "Prediction Markets (Kalshi)."

IMPORTANT: This is a demonstration, not a verified live election-data service.
Candidate information, quotes, polling, alignment scores, and projections are
stored in the project and have not been independently verified here. The
example data may contain inconsistent election years or dates. Do not use it
as authoritative reporting, a factual attribution of a quote, or a prediction
of election results.

2. HOW TO USE THE WEBSITE: WHERE TO CLICK
========================================

Step 1: Open the website.
The page title is "U.S. Senate AI Policy Map." Below it are summary cards and
a map in the "United States" panel. Scroll down if the map extends below your
screen.

Step 2: Optionally filter the map.
Click the drop-down labeled "All parties" near the map heading. Select
"Democratic" or "Republican" to filter the map using the project's stored
party labels. Select "All parties" again to restore the full view.
These colors and labels are static metadata, not verified live political data.

Step 3: Open Michigan.
Click Michigan's shape or its "MI" label on the map. A pop-up panel opens with
the heading "Michigan" and a list of Senate races.

Step 4: Open the race.
Click the "U.S. Senate" race card. It shows the example's year and candidate
previews. The candidate-comparison page opens inside the same pop-up.

Step 5: Compare the candidates.
Click the tabs above the comparison:
- "Overview": biographies, candidate images, parties, and AI policy stances.
- "Quotes & Statements": quotes and their stored source/date/context labels.
- "AI Policy Positions": each candidate's listed policy priorities.
- "Party Alignment": sample alignment scores, deviations, and endorsements.
- "Policy Projection": possible policy direction and key initiatives if elected.

On a wider screen, the candidates appear side by side. On narrower screens,
the panels stack vertically. Scroll inside the pop-up to see content below
the visible area.

Step 6: View the prediction-market demonstration.
Scroll below the comparison to "Prediction Markets (Kalshi)." It displays
sample race-outcome percentages and policy-milestone probabilities.
These values are hardcoded mock data, NOT live odds fetched from Kalshi,
despite the panel's current wording.

Click "View on Kalshi" to open Kalshi's main website in a new tab. This link
does not open a specific market corresponding to the displayed sample odds.

Step 7: Go back or close the pop-up.
- Click "Back to Michigan" to return from the race to Michigan's race list.
- Click "Back" on the state panel to close it and return to the map.
- You can also close the pop-up by clicking the shaded area outside it.

Step 8: Explore another state.
Click another state shape or abbreviation. States without detailed data show
"No data yet" and a coming-soon message. Use "Back" to return to the map.

Header controls:
"Live Overview" and "Citations" are currently visual header buttons with no
click actions. "Live Overview" does not mean the data is live. Use the map,
party filter, race cards, and comparison tabs for navigation.

No account or sign-in is required for the current website. Candidate images
currently use placeholder-image URLs and may not load; they are not verified
candidate photographs.

3. HOW THE PROJECT WORKS
========================

The website is built with React, JavaScript, and CSS. Vite runs the development
server and builds the production website.

The main flow is:
Home page -> state selection -> state pop-up -> race selection -> comparison.

React keeps the selected state, party filter, selected race, and active tab in
browser memory. These selections are not saved as a personal account or
bookmark; refreshing the page returns to the initial view.

The map is an SVG: clickable shapes and text labels drawn in the browser.
It is a simplified visual map, not an authoritative geographic boundary source.
Selecting a state opens a modal overlay instead of taking you to a separate URL.

Detailed Michigan content comes from src/data/michigan.json. Components render
that stored content into race cards and comparison panels. Party filtering
uses metadata in src/App.jsx.

The Kalshi demonstration constructs fixed sample odds in
src/components/KalshiMarket.jsx. There is no live market-data connection.

There is currently no backend API, database, user-account system, or runtime
AI model that researches candidates or generates the displayed analysis.
The information changes when the project's source data or code is updated.

Key files:
- src/App.jsx: home page, state metadata, party filter, and selected state.
- src/components/USMap.jsx: clickable SVG map.
- src/components/StateModal.jsx: state pop-up container.
- src/components/StateView.jsx: state data, race list, or no-data message.
- src/components/RaceView.jsx: race page and prediction-market section.
- src/components/CandidateComparison.jsx: candidate panels and comparison tabs.
- src/components/KalshiMarket.jsx: sample prediction-market panel.
- src/data/michigan.json: stored Michigan demonstration data.
- src/styles.css and src/styles/: page and component styling.

4. RUNNING, SYNCING, AND PUBLISHING
==================================

Requirements: Node.js 20 and npm.

From the project folder:
1. Run "npm ci" to install the dependencies recorded in package-lock.json.
2. Run "npm run dev" to start the development website.
3. Run "npm run build" to produce the static website in the dist folder.
4. Run "npm run preview" to preview that production build.

On Replit, click Run to start the configured project workflows. The app's
development server listens on port 5000 and appears in Preview.

The separate "GitHub auto-sync" workflow checks the configured upstream branch
immediately on startup, then every 15 minutes while that workflow is running.
It fetches GitHub updates and merges incoming commits when safe.
It skips merges when local edits are uncommitted or a merge/rebase is already
in progress. If an attempted merge conflicts, it aborts that attempt and logs
the issue for manual resolution. It never force-resets files or pushes to GitHub.
It is a workspace process, not a guarantee of unattended checks while stopped.

The sync command is "npm run sync:github." Its implementation is
scripts/github-auto-sync.js. Dependency changes pulled from GitHub may still
require reinstalling dependencies and restarting the development app.

For Replit task merges, scripts/post-merge.sh installs locked dependencies and
builds the app. Replit then reconciles the configured workflows.

Publishing is configured as a static website with "npm run build" as the build
command and "dist" as the output folder. Use Publish in Replit to make it live.
Later GitHub syncs update the workspace, not an already published website.
Republish when you want workspace changes to appear on the live site.

The current app needs no API keys, database, or external-service credentials.

5. WHAT IS COMING
=================

This section separates work indicated by the current project from suggested
improvements. None of the items below has a confirmed delivery date.

Intended next additions indicated by the existing code:
- More states and Senate races. States without data already show a coming-soon
  message. Michigan is the only detailed example today.
- A real Kalshi connection. The code contains a placeholder for fetching
  market data; live integration is not yet implemented.

Suggested improvements, not confirmed commitments:
- Verify candidate identities, race years, quotes, polling, endorsements,
  and policy descriptions before presenting them as factual information.
- Add working citations with links to primary sources and clear update dates.
- Define and explain how party-alignment scores and policy projections are
  calculated, and distinguish analysis from facts.
- Replace placeholder portraits with appropriate candidate images.
- Improve map accuracy and readability, especially for smaller states.
- Add stronger keyboard navigation and accessibility for the map and modal.
- Add automated checks for state selection, filtering, race navigation,
  comparison tabs, and safe GitHub synchronization.

Until those improvements are delivered, treat the site as an interactive
product demonstration rather than a complete nationwide research tool.

---

Additional project summary and quick start

An interactive React app that visualizes U.S. AI policy and AI safety positions
across states and political affiliations. The dashboard is a front-end
prototype for comparing how different states and Senate candidates approach
AI regulation, safety, and governance.

Tech stack

- React
- Vite
- JavaScript / JSX
- CSS

Local development

```bash
npm ci
npm run dev
```

Production build

```bash
npm run build
```
