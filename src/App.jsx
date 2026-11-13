import React, { useCallback, useState } from 'react';
import USMap from './components/USMap';
import StateModal from './components/StateModal';
import PartySummary from './pages/PartySummary';
import LegislationView from './pages/LegislationView';
import InternationalView from './pages/InternationalView';
import MethodsView from './pages/MethodsView';
import DataView from './pages/DataView';
import AnalysisPage from './pages/AnalysisPage';
import ProposalsPanel from './components/ProposalsPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { APP_VERSION } from './version';
import { races, bills, results, geo, countRecords, datasetUpdated, allCodedRecords, domainsOf, trackOf, proposals, domains } from './lib/data';
import { allCandidates, questionsInDomain, deviationCell } from './lib/analysis';
import { useDrafts } from './lib/drafts';
import { useHashRoute, navigate } from './lib/router';
import './styles.css';
import './styles/pages.css';

const NAV = [
  { id: 'map', label: 'Map', path: '/' },
  { id: 'analysis', label: 'Policy analysis', path: '/analysis' },
  { id: 'parties', label: 'Party comparison', path: '/parties' },
  { id: 'legislation', label: 'Legislation', path: '/legislation' },
  { id: 'international', label: 'International', path: '/international' },
  { id: 'methods', label: 'Methodology', path: '/methods' },
  { id: 'data', label: 'Download data', path: '/data' },
];

const MAP_FILTERS = [
  { id: 'all', label: 'All states' },
  { id: 'races', label: 'States with tracked races' },
  { id: 'legislation', label: 'States with coded AI bills' },
];

// Home-screen summary of the two policy areas: how much is said vs proposed,
// and how many candidates currently deviate from their party line.
function PolicyFronts() {
  const { includeDrafts } = useDrafts();
  const coded = allCodedRecords(includeDrafts).map((r) => r.record);
  const props = proposals(includeDrafts);
  return (
    <section className="fronts" aria-label="The two policy areas">
      {['data-centers', 'ai-general'].map((d) => {
        const inDomain = coded.filter((r) => domainsOf(r).includes(d));
        const said = inDomain.filter((r) => trackOf(r) === 'said').length;
        const proposed = props.filter((p) => p.domains.includes(d));
        const moratoriums = proposed.filter((p) => p.isMoratorium).length;
        const qs = questionsInDomain(d);
        const deviating = allCandidates().filter(({ race, candidate }) =>
          qs.some((q) => deviationCell(race, candidate, q.id, includeDrafts).status === 'deviates'),
        );
        return (
          <div key={d} className={`front ${d}`}>
            <h3>{domains[d].label}</h3>
            <div className="front-stats">
              <div className="front-stat"><strong>{said}</strong><span>records of what is said</span></div>
              <div className="front-stat">
                <strong>{proposed.length}</strong>
                <span>proposals and actions{d === 'data-centers' ? ` (${moratoriums} moratoriums or bans)` : ''}</span>
              </div>
              <div className="front-stat">
                <strong>{deviating.length} of {allCandidates().length}</strong>
                <span>candidates deviate from their party line</span>
              </div>
            </div>
            <p>
              {deviating.length > 0 ? `Deviating: ${deviating.map(({ candidate }) => candidate.name).join(', ')}. ` : ''}
              <a href="#/analysis">See where and when</a>.
            </p>
          </div>
        );
      })}
    </section>
  );
}

function MapPage({ selectedState, raceId }) {
  const [filter, setFilter] = useState('all');
  const close = useCallback(() => navigate('/'), []);
  const statesWithRaces = new Set(races.map((r) => r.state)).size;
  const senate = races.filter((r) => r.office === 'U.S. Senate').length;
  const governor = races.filter((r) => r.office === 'Governor').length;
  const { sourced, drafts } = countRecords();

  return (
    <>
      <section className="summary-row">
        <div className="stat-box">
          <span className="label">Tracked races</span>
          <strong>{races.length}</strong>
          <span className="stat-sub">
            {senate} Senate · {governor} governor in {statesWithRaces} state{statesWithRaces === 1 ? '' : 's'} ·{' '}
            {results.length} result{results.length === 1 ? '' : 's'} recorded
          </span>
        </div>
        <div className="stat-box">
          <span className="label">Sourced records</span>
          <strong>{sourced}</strong>
          <span className="stat-sub">Each cites its source; most are Low confidence until checked · {drafts} hidden draft{drafts === 1 ? '' : 's'}</span>
        </div>
        <div className="stat-box">
          <span className="label">AI bills tracked</span>
          <strong>{bills.length}</strong>
          <span className="stat-sub">Dataset last edited {datasetUpdated || 'never'}</span>
        </div>
      </section>

      <div className="map-panel">
        <div className="panel-head">
          <h2>United States</h2>
          <label className="visually-hidden" htmlFor="map-filter">Filter states</label>
          <select id="map-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            {MAP_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>
        <p className="panel-note">Select a state to see its tracked races and AI legislation.</p>
        <USMap selectedState={selectedState} filter={filter} onStateClick={(abbr) => navigate(`/state/${abbr}`)} />
      </div>

      <PolicyFronts />
      <ProposalsPanel title="Proposed bills and moratoriums" />

      {selectedState && <StateModal stateAbbr={selectedState} raceId={raceId} onClose={close} />}
    </>
  );
}

function App() {
  const { page, params } = useHashRoute();
  const { includeDrafts, setIncludeDrafts } = useDrafts();
  const activeNav = page === 'state' ? 'map' : page;
  const selectedState = page === 'state' && geo.states[params[0]?.toUpperCase()] ? params[0].toUpperCase() : null;

  let content;
  switch (page) {
    case 'analysis': content = <AnalysisPage />; break;
    case 'parties': content = <PartySummary />; break;
    case 'legislation': content = <LegislationView />; break;
    case 'international': content = <InternationalView />; break;
    case 'methods': content = <MethodsView />; break;
    case 'data': content = <DataView />; break;
    default: content = <MapPage selectedState={selectedState} raceId={params[1]} />;
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Yale SOM AI Policy Dashboard</p>
          <h1>Mapping the AI Policy Divide</h1>
          <p className="subtitle">Candidate positions, state legislation and party approaches to AI regulation</p>
        </div>
        <label className="drafts-toggle">
          <input type="checkbox" checked={includeDrafts} onChange={(e) => setIncludeDrafts(e.target.checked)} />
          <span>Show unverified drafts</span>
        </label>
      </header>

      <nav className="main-nav" aria-label="Sections">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.path}`} className={`chip ${activeNav === n.id ? 'active' : ''}`} aria-current={activeNav === n.id ? 'page' : undefined}>
            {n.label}
          </a>
        ))}
      </nav>

      {includeDrafts && (
        <div className="drafts-banner" role="status">
          You are viewing unverified drafts. They have not been checked against sources and must not be cited as facts.
        </div>
      )}

      <main>
        <ErrorBoundary resetKey={`${page}/${params.join('/')}`}>{content}</ErrorBoundary>
      </main>

      <footer className="site-footer">
        A research demonstration. Records are labeled by type and confidence. See the{' '}
        <a href="#/methods">methodology</a> for how they are sourced and corrected. Version {APP_VERSION}.
      </footer>
    </div>
  );
}

export default App;
