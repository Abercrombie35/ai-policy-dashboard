import React, { useMemo, useState } from 'react';
import USMap from './components/USMap';
import StateModal from './components/StateModal';
import './styles.css';

const stateMetadata = [
  { abbr: 'WA', name: 'Washington', party: 'Democratic' },
  { abbr: 'OR', name: 'Oregon', party: 'Democratic' },
  { abbr: 'CA', name: 'California', party: 'Democratic' },
  { abbr: 'NV', name: 'Nevada', party: 'Republican' },
  { abbr: 'ID', name: 'Idaho', party: 'Republican' },
  { abbr: 'MT', name: 'Montana', party: 'Republican' },
  { abbr: 'WY', name: 'Wyoming', party: 'Republican' },
  { abbr: 'UT', name: 'Utah', party: 'Republican' },
  { abbr: 'AZ', name: 'Arizona', party: 'Republican' },
  { abbr: 'CO', name: 'Colorado', party: 'Democratic' },
  { abbr: 'NM', name: 'New Mexico', party: 'Democratic' },
  { abbr: 'TX', name: 'Texas', party: 'Republican' },
  { abbr: 'OK', name: 'Oklahoma', party: 'Republican' },
  { abbr: 'KS', name: 'Kansas', party: 'Republican' },
  { abbr: 'NE', name: 'Nebraska', party: 'Republican' },
  { abbr: 'SD', name: 'South Dakota', party: 'Republican' },
  { abbr: 'ND', name: 'North Dakota', party: 'Republican' },
  { abbr: 'MN', name: 'Minnesota', party: 'Democratic' },
  { abbr: 'IA', name: 'Iowa', party: 'Republican' },
  { abbr: 'MO', name: 'Missouri', party: 'Republican' },
  { abbr: 'WI', name: 'Wisconsin', party: 'Democratic' },
  { abbr: 'IL', name: 'Illinois', party: 'Democratic' },
  { abbr: 'MI', name: 'Michigan', party: 'Democratic' },
  { abbr: 'IN', name: 'Indiana', party: 'Republican' },
  { abbr: 'OH', name: 'Ohio', party: 'Republican' },
  { abbr: 'KY', name: 'Kentucky', party: 'Republican' },
  { abbr: 'WV', name: 'West Virginia', party: 'Republican' },
  { abbr: 'VA', name: 'Virginia', party: 'Democratic' },
  { abbr: 'NC', name: 'North Carolina', party: 'Republican' },
  { abbr: 'SC', name: 'South Carolina', party: 'Republican' },
  { abbr: 'GA', name: 'Georgia', party: 'Democratic' },
  { abbr: 'FL', name: 'Florida', party: 'Republican' },
  { abbr: 'AL', name: 'Alabama', party: 'Republican' },
  { abbr: 'MS', name: 'Mississippi', party: 'Republican' },
  { abbr: 'TN', name: 'Tennessee', party: 'Republican' },
  { abbr: 'AR', name: 'Arkansas', party: 'Republican' },
  { abbr: 'LA', name: 'Louisiana', party: 'Republican' },
  { abbr: 'AK', name: 'Alaska', party: 'Republican' },
  { abbr: 'HI', name: 'Hawaii', party: 'Democratic' },
  { abbr: 'ME', name: 'Maine', party: 'Democratic' },
  { abbr: 'VT', name: 'Vermont', party: 'Democratic' },
  { abbr: 'NH', name: 'New Hampshire', party: 'Democratic' },
  { abbr: 'MA', name: 'Massachusetts', party: 'Democratic' },
  { abbr: 'CT', name: 'Connecticut', party: 'Democratic' },
  { abbr: 'RI', name: 'Rhode Island', party: 'Democratic' },
  { abbr: 'NJ', name: 'New Jersey', party: 'Democratic' },
  { abbr: 'NY', name: 'New York', party: 'Democratic' },
  { abbr: 'PA', name: 'Pennsylvania', party: 'Democratic' },
  { abbr: 'MD', name: 'Maryland', party: 'Democratic' },
  { abbr: 'DE', name: 'Delaware', party: 'Democratic' },
  { abbr: 'DC', name: 'D.C.', party: 'Democratic' },
];

const partyOptions = ['all', 'Democratic', 'Republican'];

function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [partyFilter, setPartyFilter] = useState('all');

  const stateMetadataMap = useMemo(() => {
    const map = {};
    stateMetadata.forEach((state) => {
      map[state.abbr] = state;
    });
    return map;
  }, []);

  const visibleStates = useMemo(() => {
    if (partyFilter === 'all') return stateMetadata;
    return stateMetadata.filter((state) => state.party === partyFilter);
  }, [partyFilter]);

  const visibleStateAbbrs = useMemo(() => visibleStates.map((state) => state.abbr), [visibleStates]);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Yale SOM AI Policy Dashboard</p>
          <h1>U.S. Senate AI Policy Map</h1>
        </div>
        <div className="topbar-actions">
          <button className="chip active">Live Overview</button>
          <button className="chip">Citations</button>
        </div>
      </header>

      <section className="summary-row">
        <div className="stat-box">
          <span className="label">Tracked states</span>
          <strong>50</strong>
        </div>
        <div className="stat-box">
          <span className="label">Data available</span>
          <strong>Michigan</strong>
        </div>
        <div className="stat-box">
          <span className="label">AI policy lens</span>
          <strong>Safety + Regulation</strong>
        </div>
      </section>

      <div className="content-grid">
        <aside className="map-panel">
          <div className="panel-head">
            <h2>United States</h2>
            <select value={partyFilter} onChange={(e) => setPartyFilter(e.target.value)}>
              {partyOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All parties' : option}
                </option>
              ))}
            </select>
          </div>

          <USMap
            selectedState={selectedState}
            visibleStates={visibleStateAbbrs}
            stateMetadata={stateMetadataMap}
            onStateClick={setSelectedState}
          />
        </aside>
      </div>

      {selectedState && (
        <StateModal
          stateAbbr={selectedState}
          stateName={stateMetadataMap[selectedState]?.name}
          onClose={() => setSelectedState(null)}
        />
      )}
    </div>
  );
}

export default App;
