import React, { useCallback, useState } from 'react';
import USMap from './components/USMap';
import StateModal from './components/StateModal';
import RaceModal from './components/RaceModal';
import EuropeMap from './components/EuropeMap';
import CountryModal from './components/CountryModal';
import PartySummary from './pages/PartySummary';
import LegislationView from './pages/LegislationView';
import InternationalView from './pages/InternationalView';
import MethodsView from './pages/MethodsView';
import DataView from './pages/DataView';
import AnalysisPage from './pages/AnalysisPage';
import ProposalsPanel from './components/ProposalsPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { APP_VERSION } from './version';
import { usRaces, usBills, results, geo, europeGeo, countRecords, datasetUpdated, allCodedRecords, domainsOf, trackOf, proposals, domains, raceById, officeType, racesForCountry, countryName, checkSummary } from './lib/data';
import { allCandidates, questionsInDomain, deviationCell } from './lib/analysis';
import { useDrafts } from './lib/drafts';
import { useHashRoute, navigate } from './lib/router';
import './styles.css';
import './styles/pages.css';
import './styles/research.css';
import './styles/research-surfaces.css';

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
                <span>proposals and actions{d === 'data-centers' ? ` (${moratoriums} moratoriums or bans)` : ''}, grouped by category below</span>
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

// The map, with any open state, country or race pop-up over it. A race
// (#/state/MI/<race-id>, #/country/FR/<race-id>) opens in its own large
// pop-up; the map stays mounted underneath so closing it keeps the reader's place.
function MapPage({ selectedState, selectedCountry, race = null }) {
  const [filter, setFilter] = useState('all');
  const close = useCallback(() => navigate('/'), []);
  const statesWithRaces = new Set(usRaces.map((r) => r.state)).size;
  const abroad = racesForCountry('FR');
  const OFFICE_LABELS = { 'U.S. Senate': 'Senate', 'U.S. House': 'House', Governor: 'governor' };
  const officeCounts = Object.entries(OFFICE_LABELS)
    .map(([type, label]) => [label, usRaces.filter((r) => officeType(r.office) === type).length])
    .filter(([, n]) => n > 0)
    .map(([label, n]) => `${n} ${label}`)
    .join(' · ');
  const { sourced, drafts } = countRecords();
  const checks = checkSummary();

  return (
    <div className="research-home">
      <section className="summary-row">
        <div className="stat-box">
          <span className="label">Tracked races</span>
          <strong>{usRaces.length + abroad.length}</strong>
          <span className="stat-sub">
            {officeCounts} in {statesWithRaces} state{statesWithRaces === 1 ? '' : 's'} ·{' '}
            {results.length} result{results.length === 1 ? '' : 's'} recorded
            {abroad.length > 0 && <> · {countryName('FR')}'s 2027 presidential election</>}
          </span>
        </div>
        <div className="stat-box">
          <span className="label">Sourced records</span>
          <strong>{sourced}</strong>
          <span className="stat-sub">
            Each cites its source.{checks.total > 0 && <> {checks.confirmed} of {checks.total} claims confirmed by other reports
            {checks.primary > 0 && <>, {checks.primary} at High confidence (primary source)</>};</>}{' '}
            the rest are marked · {drafts} hidden draft{drafts === 1 ? '' : 's'}
          </span>
        </div>
        <div className="stat-box">
          <span className="label">U.S. AI bills tracked</span>
          <strong>{usBills.length}</strong>
          <span className="stat-sub">Dataset last edited {datasetUpdated || 'never'}</span>
        </div>
      </section>

      <div className="map-panel maps-row">
        <div className="map-block us-block">
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
        <div className="map-block europe-block">
          <div className="panel-head">
            <h2>Europe</h2>
          </div>
          <p className="panel-note">
            France's 2027 presidential election is tracked: <a href="#/country/FR/fr-president-2027">open the race</a>. Select a
            country for its elections.
          </p>
          <EuropeMap selectedCountry={selectedCountry} onCountryClick={(code) => navigate(`/country/${code}`)} />
        </div>
      </div>

      <PolicyFronts />
      <ProposalsPanel title="Proposed bills and moratoriums" />

      {race ? (
        <RaceModal race={race} />
      ) : (
        <>
          {selectedState && <StateModal stateAbbr={selectedState} onClose={close} />}
          {selectedCountry && <CountryModal code={selectedCountry} onClose={close} />}
        </>
      )}
    </div>
  );
}

function App() {
  const { page, params } = useHashRoute();
  const { includeDrafts, setIncludeDrafts } = useDrafts();
  const activeNav = ['state', 'country'].includes(page) ? 'map' : page;
  const selectedState = page === 'state' && geo.states[params[0]?.toUpperCase()] ? params[0].toUpperCase() : null;
  const selectedCountry = page === 'country' && europeGeo.countries[params[0]?.toUpperCase()] ? params[0].toUpperCase() : null;

  let content;
  switch (page) {
    case 'analysis': content = <AnalysisPage />; break;
    case 'parties': content = <PartySummary />; break;
    case 'legislation': content = <LegislationView />; break;
    case 'international': content = <InternationalView />; break;
    case 'methods': content = <MethodsView />; break;
    case 'data': content = <DataView />; break;
    default: {
      // Race pages: #/state/MI/<race-id> in the U.S., #/country/FR/<race-id> abroad.
      const race = ['state', 'country'].includes(page) && params[1] ? raceById(params[1]) : null;
      const matches = race && (page === 'state' ? race.state === selectedState : race.country === selectedCountry);
      content = <MapPage selectedState={selectedState} selectedCountry={selectedCountry} race={matches ? race : null} />;
    }
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Computer Science and Global Affairs (CPSC 6110/GLBL 6115) at Yale</p>
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
