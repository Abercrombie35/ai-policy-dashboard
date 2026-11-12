import React from 'react';
import { geo, coverageForState } from '../lib/data';
import '../styles/USMap.css';

// Accurate state shapes bundled with the app (see tools/build-state-paths.mjs),
// so the map works offline and every state can be selected.
const SMALL_STATE_AREA = 900; // below this, only label states that have data

function describe(abbr, name) {
  const { races, bills } = coverageForState(abbr);
  const parts = [];
  if (races) parts.push(`${races} tracked race${races > 1 ? 's' : ''}`);
  if (bills) parts.push(`${bills} AI bill${bills > 1 ? 's' : ''}`);
  return `${name}: ${parts.length ? parts.join(', ') : 'no data yet'}`;
}

function USMap({ selectedState, filter, onStateClick }) {
  const entries = Object.entries(geo.states);

  const matches = (abbr) => {
    const { races, bills } = coverageForState(abbr);
    if (filter === 'races') return races > 0;
    if (filter === 'legislation') return bills > 0;
    return true;
  };

  return (
    <div className="us-map-container">
      <svg className="us-map-svg" viewBox={geo.viewBox} role="group" aria-label="Map of U.S. states">
        {entries.map(([abbr, s]) => {
          const { races, bills } = coverageForState(abbr);
          const coverage = races ? 'has-races' : bills ? 'has-bills' : 'no-data';
          const dimmed = !matches(abbr);
          const label = describe(abbr, s.name);
          const activate = () => onStateClick(abbr);
          return (
            <path
              key={abbr}
              d={s.d}
              className={`state-path ${coverage} ${selectedState === abbr ? 'selected' : ''} ${dimmed ? 'dimmed' : ''}`}
              role="button"
              tabIndex={dimmed ? -1 : 0}
              aria-label={label}
              onClick={activate}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  activate();
                }
              }}
            >
              <title>{label}</title>
            </path>
          );
        })}
        {entries.map(([abbr, s]) => {
          const { races, bills } = coverageForState(abbr);
          if (s.area < SMALL_STATE_AREA && !races && !bills) return null;
          return (
            <text
              key={abbr}
              x={s.label[0]}
              y={s.label[1]}
              className={`state-label ${races ? 'has-races' : ''} ${matches(abbr) ? '' : 'dimmed'}`}
              aria-hidden="true"
            >
              {abbr}
            </text>
          );
        })}
      </svg>
      <ul className="map-legend" aria-label="Map legend">
        <li><span className="swatch has-races" /> Tracked race (Senate or governor)</li>
        <li><span className="swatch has-bills" /> AI legislation coded, no race yet</li>
        <li><span className="swatch no-data" /> No data yet</li>
      </ul>
    </div>
  );
}

export default USMap;
