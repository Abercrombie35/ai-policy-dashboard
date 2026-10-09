import React, { useState } from 'react';
import '../styles/USMap.css';

const stateShapes = {
  WA: { path: 'M80,60 L100,50 L105,120 L85,130 Z', center: [92, 90] },
  OR: { path: 'M65,120 L100,110 L110,200 L70,210 Z', center: [82, 160] },
  CA: { path: 'M50,180 L100,170 L115,350 L55,365 Z', center: [75, 270] },
  NV: { path: 'M105,130 L150,125 L160,280 L110,285 Z', center: [130, 205] },
  ID: { path: 'M105,50 L160,40 L165,130 L110,140 Z', center: [135, 90] },
  MT: { path: 'M160,30 L220,20 L225,115 L165,125 Z', center: [190, 75] },
  WY: { path: 'M160,120 L220,110 L230,180 L165,190 Z', center: [193, 150] },
  UT: { path: 'M140,180 L175,170 L185,260 L145,270 Z', center: [160, 215] },
  CO: { path: 'M175,170 L230,160 L240,240 L185,250 Z', center: [205, 205] },
  AZ: { path: 'M140,270 L185,260 L195,370 L145,380 Z', center: [165, 315] },
  NM: { path: 'M185,250 L230,240 L245,370 L200,380 Z', center: [212, 310] },
  HI: { path: 'M100,390 L120,388 L125,420 L105,422 Z', center: [112, 405] },
  AK: { path: 'M25,370 L60,360 L65,430 L30,440 Z', center: [42, 405] },
  ND: { path: 'M225,20 L300,10 L310,75 L230,85 Z', center: [267, 47] },
  SD: { path: 'M225,85 L300,75 L310,145 L230,155 Z', center: [267, 115] },
  NE: { path: 'M230,155 L300,145 L310,220 L240,230 Z', center: [272, 187] },
  KS: { path: 'M240,230 L310,220 L320,300 L250,310 Z', center: [282, 265] },
  OK: { path: 'M250,310 L320,300 L335,390 L265,400 Z', center: [292, 350] },
  TX: { path: 'M265,400 L360,385 L375,520 L280,535 Z', center: [317, 460] },
  MN: { path: 'M300,75 L360,65 L370,150 L310,160 Z', center: [335, 110] },
  IA: { path: 'M300,160 L360,150 L370,230 L310,240 Z', center: [335, 195] },
  MO: { path: 'M310,240 L370,230 L380,320 L320,330 Z', center: [345, 280] },
  AR: { path: 'M320,330 L380,320 L395,420 L335,430 Z', center: [357, 375] },
  LA: { path: 'M335,430 L395,420 L410,520 L350,530 Z', center: [372, 475] },
  MS: { path: 'M315,330 L360,320 L375,420 L330,430 Z', center: [345, 375] },
  WI: { path: 'M360,150 L410,140 L420,230 L370,240 Z', center: [387, 190] },
  IL: { path: 'M370,240 L420,230 L430,320 L380,330 Z', center: [400, 280] },
  MI: { path: 'M410,150 L460,140 L475,280 L425,290 Z', center: [440, 215] },
  IN: { path: 'M420,240 L460,230 L470,320 L430,330 Z', center: [445, 280] },
  OH: { path: 'M460,230 L510,220 L520,320 L470,330 Z', center: [487, 275] },
  KY: { path: 'M430,320 L500,310 L515,390 L445,400 Z', center: [472, 355] },
  TN: { path: 'M365,320 L430,310 L445,390 L380,400 Z', center: [405, 355] },
  AL: { path: 'M445,330 L490,320 L505,420 L460,430 Z', center: [472, 375] },
  GA: { path: 'M490,310 L540,300 L555,420 L510,430 Z', center: [517, 365] },
  FL: { path: 'M510,380 L560,370 L575,530 L525,540 Z', center: [542, 455] },
  SC: { path: 'M500,310 L545,300 L560,380 L515,390 Z', center: [530, 345] },
  NC: { path: 'M470,310 L520,300 L535,380 L480,390 Z', center: [502, 345] },
  VA: { path: 'M510,280 L560,270 L575,350 L525,360 Z', center: [542, 315] },
  WV: { path: 'M480,280 L520,270 L535,330 L495,340 Z', center: [507, 305] },
  MD: { path: 'M540,270 L575,260 L590,310 L555,320 Z', center: [562, 290] },
  DE: { path: 'M575,310 L600,305 L615,340 L590,345 Z', center: [597, 327] },
  NJ: { path: 'M560,300 L600,290 L620,360 L580,370 Z', center: [590, 330] },
  PA: { path: 'M500,270 L555,260 L570,320 L515,330 Z', center: [535, 295] },
  NY: { path: 'M540,220 L600,210 L620,300 L560,310 Z', center: [580, 260] },
  CT: { path: 'M600,290 L630,285 L640,330 L610,335 Z', center: [620, 310] },
  RI: { path: 'M630,300 L650,297 L660,325 L640,328 Z', center: [645, 312] },
  MA: { path: 'M615,240 L650,235 L665,295 L630,300 Z', center: [637, 267] },
  VT: { path: 'M600,180 L640,175 L650,240 L610,245 Z', center: [625, 210] },
  NH: { path: 'M640,170 L680,165 L695,240 L655,245 Z', center: [667, 205] },
  ME: { path: 'M680,150 L720,145 L735,240 L695,245 Z', center: [707, 195] },
  DC: { path: 'M555,325 L562,323 L565,335 L558,337 Z', center: [560, 330] },
};

function USMap({ selectedState, visibleStates, stateMetadata, onStateClick }) {
  const [hoveredState, setHoveredState] = useState(null);
  const isVisible = (abbr) => visibleStates.includes(abbr);
  const isSelected = (abbr) => selectedState === abbr;
  const isHovered = (abbr) => hoveredState === abbr;
  const getParty = (abbr) => stateMetadata[abbr]?.party || 'Unknown';
  const hasData = (abbr) => abbr === 'MI';

  return (
    <div className="us-map-container">
      <svg className="us-map-svg" viewBox="0 0 750 550" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="750" height="550" fill="rgba(10, 18, 28, 0.3)" />

        {Object.entries(stateShapes).map(([abbr, shape]) => {
          const visible = isVisible(abbr);
          const selected = isSelected(abbr);
          const hovered = isHovered(abbr);
          const party = getParty(abbr);
          const data = hasData(abbr);
          const [cx, cy] = shape.center;

          return (
            <g key={abbr}>
              <path
                d={shape.path}
                className={`state-path ${!visible ? 'hidden' : ''} ${party === 'Democratic' ? 'dem' : 'rep'} ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''} ${data ? 'has-data' : ''}`}
                onClick={() => onStateClick(abbr)}
                onMouseEnter={() => setHoveredState(abbr)}
                onMouseLeave={() => setHoveredState(null)}
                title={stateMetadata[abbr]?.name || abbr}
              />

              {visible && (
                <text
                  x={cx}
                  y={cy}
                  className={`state-label ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''} ${data ? 'has-data' : ''}`}
                  onClick={() => onStateClick(abbr)}
                  onMouseEnter={() => setHoveredState(abbr)}
                  onMouseLeave={() => setHoveredState(null)}
                  title={stateMetadata[abbr]?.name || abbr}
                >
                  {abbr}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default USMap;
