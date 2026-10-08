import { useMemo, useState } from 'react';
import StateView from './components/StateView';
import './styles.css';

const states = [
  { abbr: 'WA', name: 'Washington', col: 1, row: 1, region: 'West', party: 'Democratic' },
  { abbr: 'OR', name: 'Oregon', col: 2, row: 1, region: 'West', party: 'Democratic' },
  { abbr: 'CA', name: 'California', col: 3, row: 2, region: 'West', party: 'Democratic' },
  { abbr: 'NV', name: 'Nevada', col: 4, row: 2, region: 'West', party: 'Republican' },
  { abbr: 'ID', name: 'Idaho', col: 5, row: 1, region: 'West', party: 'Republican' },
  { abbr: 'MT', name: 'Montana', col: 6, row: 1, region: 'Mountain', party: 'Republican' },
  { abbr: 'WY', name: 'Wyoming', col: 6, row: 2, region: 'Mountain', party: 'Republican' },
  { abbr: 'UT', name: 'Utah', col: 5, row: 3, region: 'Mountain', party: 'Republican' },
  { abbr: 'AZ', name: 'Arizona', col: 4, row: 3, region: 'Mountain', party: 'Republican' },
  { abbr: 'CO', name: 'Colorado', col: 6, row: 3, region: 'Mountain', party: 'Democratic' },
  { abbr: 'NM', name: 'New Mexico', col: 5, row: 4, region: 'Mountain', party: 'Democratic' },
  { abbr: 'TX', name: 'Texas', col: 7, row: 4, region: 'South', party: 'Republican' },
  { abbr: 'OK', name: 'Oklahoma', col: 7, row: 3, region: 'South', party: 'Republican' },
  { abbr: 'KS', name: 'Kansas', col: 7, row: 2, region: 'Midwest', party: 'Republican' },
  { abbr: 'NE', name: 'Nebraska', col: 7, row: 1, region: 'Midwest', party: 'Republican' },
  { abbr: 'SD', name: 'South Dakota', col: 7, row: 2, region: 'Midwest', party: 'Republican' },
  { abbr: 'ND', name: 'North Dakota', col: 7, row: 1, region: 'Midwest', party: 'Republican' },
  { abbr: 'MN', name: 'Minnesota', col: 8, row: 1, region: 'Midwest', party: 'Democratic' },
  { abbr: 'IA', name: 'Iowa', col: 8, row: 2, region: 'Midwest', party: 'Republican' },
  { abbr: 'MO', name: 'Missouri', col: 8, row: 3, region: 'Midwest', party: 'Republican' },
  { abbr: 'WI', name: 'Wisconsin', col: 8, row: 1, region: 'Midwest', party: 'Democratic' },
  { abbr: 'IL', name: 'Illinois', col: 9, row: 2, region: 'Midwest', party: 'Democratic' },
  { abbr: 'MI', name: 'Michigan', col: 9, row: 1, region: 'Midwest', party: 'Democratic' },
  { abbr: 'IN', name: 'Indiana', col: 9, row: 3, region: 'Midwest', party: 'Republican' },
  { abbr: 'OH', name: 'Ohio', col: 9, row: 2, region: 'Midwest', party: 'Republican' },
  { abbr: 'KY', name: 'Kentucky', col: 9, row: 4, region: 'South', party: 'Republican' },
  { abbr: 'WV', name: 'West Virginia', col: 9, row: 5, region: 'South', party: 'Republican' },
  { abbr: 'VA', name: 'Virginia', col: 10, row: 5, region: 'South', party: 'Democratic' },
  { abbr: 'NC', name: 'North Carolina', col: 10, row: 4, region: 'South', party: 'Republican' },
  { abbr: 'SC', name: 'South Carolina', col: 10, row: 3, region: 'South', party: 'Republican' },
  { abbr: 'GA', name: 'Georgia', col: 10, row: 2, region: 'South', party: 'Democratic' },
  { abbr: 'FL', name: 'Florida', col: 11, row: 4, region: 'South', party: 'Republican' },
  { abbr: 'AL', name: 'Alabama', col: 10, row: 1, region: 'South', party: 'Republican' },
  { abbr: 'MS', name: 'Mississippi', col: 9, row: 6, region: 'South', party: 'Republican' },
  { abbr: 'TN', name: 'Tennessee', col: 8, row: 4, region: 'South', party: 'Republican' },
  { abbr: 'AR', name: 'Arkansas', col: 8, row: 5, region: 'South', party: 'Republican' },
  { abbr: 'LA', name: 'Louisiana', col: 8, row: 6, region: 'South', party: 'Republican' },
  { abbr: 'AK', name: 'Alaska', col: 1, row: 6, region: 'West', party: 'Republican' },
  { abbr: 'HI', name: 'Hawaii', col: 3, row: 7, region: 'West', party: 'Democratic' },
  { abbr: 'ME', name: 'Maine', col: 11, row: 1, region: 'Northeast', party: 'Democratic' },
  { abbr: 'VT', name: 'Vermont', col: 11, row: 2, region: 'Northeast', party: 'Democratic' },
  { abbr: 'NH', name: 'New Hampshire', col: 11, row: 3, region: 'Northeast', party: 'Democratic' },
  { abbr: 'MA', name: 'Massachusetts', col: 11, row: 4, region: 'Northeast', party: 'Democratic' },
  { abbr: 'CT', name: 'Connecticut', col: 11, row: 5, region: 'Northeast', party: 'Democratic' },
  { abbr: 'RI', name: 'Rhode Island', col: 11, row: 6, region: 'Northeast', party: 'Democratic' },
  { abbr: 'NJ', name: 'New Jersey', col: 10, row: 6, region: 'Northeast', party: 'Democratic' },
  { abbr: 'NY', name: 'New York', col: 10, row: 7, region: 'Northeast', party: 'Democratic' },
  { abbr: 'PA', name: 'Pennsylvania', col: 9, row: 4, region: 'Northeast', party: 'Democratic' },
  { abbr: 'MD', name: 'Maryland', col: 10, row: 5, region: 'South', party: 'Democratic' },
  { abbr: 'DE', name: 'Delaware', col: 10, row: 6, region: 'South', party: 'Democratic' },
  { abbr: 'DC', name: 'D.C.', col: 10, row: 7, region: 'South', party: 'Democratic' },
];

const partyOptions = ['all', 'Democratic', 'Republican'];

function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [partyFilter, setPartyFilter] = useState('all');

  const visibleStates = useMemo(() => {
    if (partyFilter === 'all') return states;
    return states.filter((state) => state.party === partyFilter);
  }, [partyFilter]);

  if (selectedState) {
    return (
      <StateView
        stateAbbr={selectedState}
        onBack={() => setSelectedState(null)}
      />
    );
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Yale SOM AI Policy Dashboard</p>
          <h1>State-by-State AI Policy Map</h1>
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
          <span className="label">Candidates profiled</span>
          <strong>120+</strong>
        </div>
        <div className="stat-box">
          <span className="label">AI policy lens</span>
          <strong>Safety + law</strong>
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

          <div className="state-grid" role="img" aria-label="Map of the United States state view">
            {visibleStates.map((state) => (
              <button
                key={state.abbr}
                className={`state-button ${state.abbr === selectedState ? 'selected' : ''} ${state.party === 'Democratic' ? 'd' : 'r'}`}
                style={{ gridColumn: state.col, gridRow: state.row }}
                onClick={() => setSelectedState(state.abbr)}
              >
                {state.abbr}
              </button>
            ))}
          </div>
        </aside>

        <main className="detail-panel">
          <div className="detail-header">
            <div>
              <p className="eyebrow">Quick start</p>
              <h2>Click a state to explore</h2>
            </div>
          </div>

          <div className="section-block">
            <h3>Welcome to the AI Policy Dashboard</h3>
            <p>
              This dashboard aggregates political positions on AI safety and regulation across U.S. Senate races.
              Currently tracking: <strong>Michigan Senate Race</strong> (Abdul El-Sayed vs. Mike Rogers).
            </p>
            <p>
              For each race, you'll find:
            </p>
            <ul>
              <li>Candidate quotes and public statements on AI</li>
              <li>Comparison of AI policy positions</li>
              <li>Party alignment scores</li>
              <li>Policy projections if elected</li>
              <li>Prediction market odds from Kalshi</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
