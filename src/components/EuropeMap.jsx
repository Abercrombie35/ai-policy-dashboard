import React from 'react';
import { europeGeo, electionsForCountry, internationalNextSteps } from '../lib/data';
import '../styles/USMap.css';

// Europe map for the international track. France is the next pilot; other
// countries with 2027 elections listed in the proposal are marked as planned.
const PILOT = internationalNextSteps?.countryCode || 'FR';

function statusOf(code, country) {
  if (code === PILOT) return 'pilot';
  if (electionsForCountry(code).length) return 'planned';
  return country.eu ? 'eu' : 'other';
}

const STATUS_TEXT = {
  pilot: 'next to build (pilot)',
  planned: '2027 election listed',
  eu: 'EU member, no data yet',
  other: 'no data yet',
};

function EuropeMap({ selectedCountry, onCountryClick }) {
  const entries = Object.entries(europeGeo.countries);
  return (
    <div className="us-map-container europe-map-container">
      <svg className="us-map-svg" viewBox={europeGeo.viewBox} role="group" aria-label="Map of Europe">
        {europeGeo.background.map((d, i) => <path key={i} d={d} className="land-background" aria-hidden="true" />)}
        {entries.map(([code, c]) => {
          const status = statusOf(code, c);
          const label = `${c.name}: ${STATUS_TEXT[status]}`;
          const activate = () => onCountryClick(code);
          return (
            <path
              key={code}
              d={c.d}
              className={`state-path country-${status} ${selectedCountry === code ? 'selected' : ''}`}
              role="button"
              tabIndex={0}
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
        {entries
          .filter(([code, c]) => ['pilot', 'planned'].includes(statusOf(code, c)))
          .map(([code, c]) => (
            <text key={code} x={c.label[0]} y={c.label[1]} className={`state-label ${code === PILOT ? 'has-races' : ''}`} aria-hidden="true">
              {code}
            </text>
          ))}
      </svg>
      <ul className="map-legend" aria-label="Europe map legend">
        <li><span className="swatch country-pilot" /> Next to build: France</li>
        <li><span className="swatch country-planned" /> 2027 election listed</li>
        <li><span className="swatch country-eu" /> EU member</li>
        <li><span className="swatch no-data" /> Other</li>
      </ul>
    </div>
  );
}

export default EuropeMap;
