import React, { useCallback, useState } from 'react';
import USMap from './components/USMap';
import StateModal from './components/StateModal';
import PartySummary from './pages/PartySummary';
import LegislationView from './pages/LegislationView';
import InternationalView from './pages/InternationalView';
import MethodsView from './pages/MethodsView';
import DataView from './pages/DataView';
import { races, bills, results, geo, countRecords, datasetUpdated } from './lib/data';
import { useDrafts } from './lib/drafts';
import { useHashRoute, navigate } from './lib/router';
import './styles.css';
import './styles/pages.css';

const NAV = [
  { id: 'map', label: 'Map', path: '/' },
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

function MapPage({ selectedState, raceId }) {
  const [filter, setFilter] = useState('all');
  const close = useCallback(() => navigate('/'), []);
  const statesWithRaces = new Set(races.map((r) => r.state)).size;
  const senate = races.filter((r) => r.office === 'U.S. Senate').length;
  const governor = races.filter((r) => r.office === 'Governor').length;
  const { verified, drafts } = countRecords();

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
          <span className="label">Verified records</span>
          <strong>{verified}</strong>
          <span className="stat-sub">{drafts} unverified draft{drafts === 1 ? '' : 's'} awaiting checks</span>
        </div>
        <div className="stat-box">
          <span className="label">State AI bills coded</span>
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

      <main>{content}</main>

      <footer className="site-footer">
        A research demonstration. Records are labeled by type and confidence. See the{' '}
        <a href="#/methods">methodology</a> for how they are sourced and corrected.
      </footer>
    </div>
  );
}

export default App;
