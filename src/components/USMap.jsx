import React from 'react';
import '../styles/USMap.css';

function USMap({ selectedState, visibleStates, stateMetadata, onStateClick }) {
  // SVG map with state path data
  // Using simplified state outlines for clickable regions
  const stateShapes = {
    WA: {
      path: 'M50,80 L80,60 L90,100 L70,120 Z',
      center: [70, 90],
    },
    OR: {
      path: 'M45,120 L75,100 L80,160 L50,170 Z',
      center: [60, 140],
    },
    CA: {
      path: 'M40,160 L75,140 L85,280 L45,300 Z',
      center: [60, 220],
    },
    NV: {
      path: 'M80,140 L120,130 L125,240 L85,250 Z',
      center: [105, 190],
    },
    ID: {
      path: 'M85,60 L130,50 L135,130 L90,140 Z',
      center: [110, 95],
    },
    MT: {
      path: 'M130,40 L180,35 L185,110 L135,120 Z',
      center: [155, 75],
    },
    WY: {
      path: 'M130,110 L185,100 L190,160 L135,170 Z',
      center: [160, 135],
    },
    UT: {
      path: 'M120,160 L150,150 L155,210 L125,220 Z',
      center: [137, 185],
    },
    CO: {
      path: 'M150,160 L190,155 L195,210 L155,215 Z',
      center: [170, 185],
    },
    AZ: {
      path: 'M120,220 L155,210 L160,300 L125,310 Z',
      center: [140, 260],
    },
    NM: {
      path: 'M155,210 L190,205 L195,300 L160,305 Z',
      center: [172, 255],
    },
    ND: {
      path: 'M180,30 L240,25 L245,80 L185,85 Z',
      center: [210, 55],
    },
    SD: {
      path: 'M180,80 L245,75 L250,130 L185,135 Z',
      center: [215, 105],
    },
    NE: {
      path: 'M190,130 L250,125 L255,180 L195,185 Z',
      center: [222, 155],
    },
    KS: {
      path: 'M190,180 L250,175 L255,230 L195,235 Z',
      center: [222, 205],
    },
    OK: {
      path: 'M190,230 L255,225 L260,300 L195,305 Z',
      center: [222, 265],
    },
    TX: {
      path: 'M195,300 L280,290 L290,420 L200,430 Z',
      center: [240, 360],
    },
    MN: {
      path: 'M245,25 L290,20 L295,100 L250,105 Z',
      center: [268, 62],
    },
    IA: {
      path: 'M245,100 L290,95 L295,150 L250,155 Z',
      center: [268, 125],
    },
    MO: {
      path: 'M250,150 L300,145 L305,210 L255,215 Z',
      center: [277, 180],
    },
    AR: {
      path: 'M255,210 L305,205 L310,280 L260,285 Z',
      center: [282, 245],
    },
    LA: {
      path: 'M260,280 L310,275 L315,350 L265,355 Z',
      center: [287, 315],
    },
    WI: {
      path: 'M290,80 L330,75 L335,140 L295,145 Z',
      center: [312, 110],
    },
    IL: {
      path: 'M300,140 L335,135 L340,200 L305,205 Z',
      center: [317, 170],
    },
    MI: {
      path: 'M330,100 L365,95 L370,160 L335,165 Z',
      center: [350, 130],
    },
    IN: {
      path: 'M340,160 L370,155 L375,210 L345,215 Z',
      center: [357, 185],
    },
    OH: {
      path: 'M370,145 L410,140 L415,200 L375,205 Z',
      center: [392, 172],
    },
    KY: {
      path: 'M375,200 L420,195 L425,260 L380,265 Z',
      center: [400, 230],
    },
    TN: {
      path: 'M300,210 L375,205 L380,265 L305,270 Z',
      center: [340, 237],
    },
    MS: {
      path: 'M265,285 L310,280 L315,350 L270,355 Z',
      center: [287, 317],
    },
    AL: {
      path: 'M310,280 L345,275 L350,350 L315,355 Z',
      center: [327, 315],
    },
    GA: {
      path: 'M345,275 L390,270 L395,340 L350,345 Z',
      center: [367, 307],
    },
    FL: {
      path: 'M390,270 L420,265 L425,400 L395,405 Z',
      center: [407, 335],
    },
    SC: {
      path: 'M380,265 L420,260 L425,320 L385,325 Z',
      center: [402, 292],
    },
    NC: {
      path: 'M380,200 L425,195 L430,265 L385,270 Z',
      center: [405, 232],
    },
    VA: {
      path: 'M415,190 L450,185 L455,250 L420,255 Z',
      center: [432, 220],
    },
    WV: {
      path: 'M410,180 L445,175 L450,220 L415,225 Z',
      center: [427, 200],
    },
    MD: {
      path: 'M445,175 L470,170 L475,210 L450,215 Z',
      center: [460, 192],
    },
    DE: {
      path: 'M468,210 L485,208 L490,240 L470,242 Z',
      center: [478, 225],
    },
    NJ: {
      path: 'M470,205 L495,200 L500,250 L475,255 Z',
      center: [487, 227],
    },
    PA: {
      path: 'M420,180 L465,175 L470,220 L425,225 Z',
      center: [445, 202],
    },
    NY: {
      path: 'M450,140 L500,135 L505,210 L455,215 Z',
      center: [477, 175],
    },
    CT: {
      path: 'M495,200 L515,198 L520,230 L500,232 Z',
      center: [507, 215],
    },
    MA: {
      path: 'M510,170 L535,165 L540,200 L515,205 Z',
      center: [525, 185],
    },
    RI: {
      path: 'M535,195 L550,193 L555,215 L540,217 Z',
      center: [545, 205],
    },
    VT: {
      path: 'M510,135 L535,130 L540,170 L515,175 Z',
      center: [525, 152],
    },
    NH: {
      path: 'M535,130 L560,125 L565,170 L540,175 Z',
      center: [550, 150],
    },
    ME: {
      path: 'M560,100 L590,95 L595,170 L565,175 Z',
      center: [575, 135],
    },
    AK: {
      path: 'M20,340 L45,335 L50,380 L25,385 Z',
      center: [35, 360],
    },
    HI: {
      path: 'M80,380 L95,378 L100,400 L85,402 Z',
      center: [90, 390],
    },
    DC: {
      path: 'M450,255 L455,253 L458,260 L453,262 Z',
      center: [454, 257],
    },
  };

  const isVisible = (abbr) => visibleStates.includes(abbr);
  const isSelected = (abbr) => selectedState === abbr;
  const getParty = (abbr) => stateMetadata[abbr]?.party || 'Unknown';

  return (
    <div className="us-map-container">
      <svg
        className="us-map-svg"
        viewBox="0 0 600 450"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="600" height="450" fill="rgba(10, 18, 28, 0.3)" />

        {/* State shapes and labels */}
        {Object.entries(stateShapes).map(([abbr, shape]) => {
          const visible = isVisible(abbr);
          const selected = isSelected(abbr);
          const party = getParty(abbr);
          const [cx, cy] = shape.center;

          return (
            <g key={abbr}>
              {/* State path */}
              <path
                d={shape.path}
                className={`state-path ${
                  !visible ? 'hidden' : ''
                } ${party === 'Democratic' ? 'dem' : 'rep'} ${
                  selected ? 'selected' : ''
                }`}
                onClick={() => onStateClick(abbr)}
                title={stateMetadata[abbr]?.name || abbr}
              />

              {/* State label */}
              {visible && (
                <text
                  x={cx}
                  y={cy}
                  className={`state-label ${selected ? 'selected' : ''}`}
                  onClick={() => onStateClick(abbr)}
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
