import React, { useEffect, useRef, useState } from 'react';
import '../styles/USMap.css';

// This component fetches an accurate SVG map of the US from Wikimedia Commons
// (public-domain file) and uses its path/polygon/rect elements when available.
// If the remote SVG can't be loaded or parsed, the component falls back to
// simplified shapes so the app remains usable.

function normalizeIdToAbbr(id) {
  if (!id) return null;
  const up = id.toUpperCase();
  if (/^[A-Z]{2}$/.test(up)) return up;
  const m = up.match(/([A-Z]{2})$/);
  if (m) return m[1];
  return null;
}

const fallbackShapes = {
  WA: { path: 'M80,60 L100,50 L105,120 L85,130 Z', center: [92, 90] },
  OR: { path: 'M65,120 L100,110 L110,200 L70,210 Z', center: [82, 160] },
  CA: { path: 'M50,180 L100,170 L115,350 L55,365 Z', center: [75, 270] },
  NV: { path: 'M105,130 L150,125 L160,280 L110,285 Z', center: [130, 205] },
  MI: { path: 'M410,150 L460,140 L475,280 L425,290 Z', center: [440, 215] },
};

function USMap({ selectedState, visibleStates, stateMetadata, onStateClick }) {
  const [hoveredState, setHoveredState] = useState(null);
  const [stateShapes, setStateShapes] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSvg() {
      try {
        // Use the Wikimedia Commons public-domain SVG of US states
        const url = 'https://upload.wikimedia.org/wikipedia/commons/5/5c/US_states_with_ids.svg';
        const res = await fetch(url);
        if (!res.ok) throw new Error('SVG not found');
        const text = await res.text();
        if (cancelled) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (!svgEl) throw new Error('No <svg> element found in SVG file');

        // Append a hidden SVG into the document so getBBox() works
        const hiddenSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        hiddenSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        hiddenSvg.style.position = 'absolute';
        hiddenSvg.style.left = '-9999px';
        hiddenSvg.style.width = '1px';
        hiddenSvg.style.height = '1px';
        hiddenSvg.style.overflow = 'visible';
        hiddenSvg.style.visibility = 'hidden';
        document.body.appendChild(hiddenSvg);

        hiddenSvg.innerHTML = svgEl.innerHTML;

        const pathEls = hiddenSvg.querySelectorAll('path, polygon, rect');
        const shapes = {};

        pathEls.forEach((el) => {
          const id = el.id || el.getAttribute('data-id') || el.getAttribute('data-name');
          const abbr = normalizeIdToAbbr(id);
          if (!abbr) return;

          let d = el.getAttribute('d');
          if (!d) {
            if (el.tagName.toLowerCase() === 'polygon') {
              const points = el.getAttribute('points');
              d = `M ${points} Z`;
            } else if (el.tagName.toLowerCase() === 'rect') {
              const x = parseFloat(el.getAttribute('x') || 0);
              const y = parseFloat(el.getAttribute('y') || 0);
              const w = parseFloat(el.getAttribute('width') || 0);
              const h = parseFloat(el.getAttribute('height') || 0);
              d = `M ${x},${y} L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} Z`;
            }
          }

          let cx = 0;
          let cy = 0;
          try {
            const bbox = el.getBBox();
            cx = bbox.x + bbox.width / 2;
            cy = bbox.y + bbox.height / 2;
          } catch (e) {
            cx = 0;
            cy = 0;
          }

          shapes[abbr] = { path: d || '', center: [cx, cy] };
        });

        document.body.removeChild(hiddenSvg);

        if (Object.keys(shapes).length > 0) {
          setStateShapes(shapes);
        } else {
          setStateShapes(fallbackShapes);
        }
      } catch (err) {
        // Fall back to simplified shapes if anything fails
        // eslint-disable-next-line no-console
        console.warn('USMap: failed to load remote SVG, using fallback shapes', err);
        setStateShapes(fallbackShapes);
      }
    }

    loadSvg();

    return () => {
      cancelled = true;
    };
  }, []);

  const isVisible = (abbr) => visibleStates.includes(abbr);
  const isSelected = (abbr) => selectedState === abbr;
  const isHovered = (abbr) => hoveredState === abbr;
  const getParty = (abbr) => stateMetadata[abbr]?.party || 'Unknown';
  const hasData = (abbr) => abbr === 'MI';

  const shapes = stateShapes || fallbackShapes;

  return (
    <div className="us-map-container">
      <svg className="us-map-svg" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="100%" height="100%" fill="rgba(10, 18, 28, 0.3)" />

        {Object.entries(shapes).map(([abbr, shape]) => {
          const visible = isVisible(abbr);
          const selected = isSelected(abbr);
          const hovered = isHovered(abbr);
          const party = getParty(abbr);
          const data = hasData(abbr);
          const [cx, cy] = shape.center || [0, 0];

          if (!shape.path) return null;

          return (
            <g key={abbr} className={`state-group ${!visible ? 'hidden' : ''}`}>
              <path
                d={shape.path}
                className={`state-path ${party === 'Democratic' ? 'dem' : 'rep'} ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''} ${data ? 'has-data' : ''}`}
                onClick={() => onStateClick(abbr)}
                onMouseEnter={() => setHoveredState(abbr)}
                onMouseLeave={() => setHoveredState(null)}
                title={stateMetadata[abbr]?.name || abbr}
              />

              {visible && cx !== 0 && cy !== 0 && (
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
