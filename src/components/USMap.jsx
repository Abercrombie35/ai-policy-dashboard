import React, { useEffect, useRef, useState } from 'react';
import '../styles/USMap.css';

// This component attempts to load an external, accurate SVG map of the US
// from src/assets/us-states.svg. If that SVG is present and its state paths
// contain recognizable IDs (e.g. "MI", "US-MI", "state-MI"), those path
// shapes will be used. If the SVG cannot be loaded or parsed, the component
// falls back to the original simplified box shapes so the app keeps working.

function normalizeIdToAbbr(id) {
  if (!id) return null;
  // common id patterns: "MI", "US-MI", "state-MI", "mi"
  const up = id.toUpperCase();
  // If it's exactly two letters, use it
  if (/^[A-Z]{2}$/.test(up)) return up;
  // If it ends with -XX or _XX, take last two letters
  const m = up.match(/([A-Z]{2})$/);
  if (m) return m[1];
  return null;
}

const fallbackShapes = {
  // simplified fallback shapes (same as before) so that the app still works
  WA: { path: 'M80,60 L100,50 L105,120 L85,130 Z', center: [92, 90] },
  OR: { path: 'M65,120 L100,110 L110,200 L70,210 Z', center: [82, 160] },
  CA: { path: 'M50,180 L100,170 L115,350 L55,365 Z', center: [75, 270] },
  // ... keep a small subset so fallback remains usable
};

function USMap({ selectedState, visibleStates, stateMetadata, onStateClick }) {
  const [hoveredState, setHoveredState] = useState(null);
  const [stateShapes, setStateShapes] = useState(null);
  const offscreenSvgRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSvg() {
      try {
        // Resolve the SVG path relative to this module. Using import.meta.url
        // ensures Vite serves the file from the correct location.
        const url = new URL('../assets/us-states.svg', import.meta.url).href;
        const res = await fetch(url);
        if (!res.ok) throw new Error('SVG not found');
        const text = await res.text();

        if (cancelled) return;

        // Parse the SVG into an offscreen container so we can measure paths
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (!svgEl) throw new Error('No <svg> element found in SVG file');

        // Create an in-document hidden svg so we can call getBBox() on paths
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
          // Convert polygon/rect to a path if needed
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

          // Try to compute a center using getBBox if available
          let cx = 0;
          let cy = 0;
          try {
            const bbox = el.getBBox();
            cx = bbox.x + bbox.width / 2;
            cy = bbox.y + bbox.height / 2;
          } catch (e) {
            // If getBBox fails, leave center as 0,0 and skip
            cx = 0;
            cy = 0;
          }

          shapes[abbr] = { path: d || '', center: [cx, cy] };
        });

        // Clean up the hidden svg
        document.body.removeChild(hiddenSvg);

        // If we discovered shapes, use them; otherwise fall back
        if (Object.keys(shapes).length > 0) {
          setStateShapes(shapes);
        } else {
          setStateShapes(fallbackShapes);
        }
      } catch (err) {
        // If anything goes wrong, keep the fallback shapes
        setStateShapes(fallbackShapes);
        // Optionally keep a console message for debugging
        // eslint-disable-next-line no-console
        console.warn('USMap: failed to load usable SVG map, using fallback shapes', err);
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

  // While loading, show nothing (or you could show a spinner).
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

          // If there is no path data, skip rendering this state
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
