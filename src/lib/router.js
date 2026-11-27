import { useEffect, useState } from 'react';

// Tiny hash router so every view has a shareable URL without a dependency.
// Routes: #/  #/state/MI  #/state/MI/<raceId>  #/parties  #/legislation
//         #/international  #/methods  #/data
function parse() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return { page: parts[0] || 'map', params: parts.slice(1) };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const navigate = (path) => {
  window.location.hash = path;
};

// The hash before the current one, so a layer opened from another view can
// close by stepping back in history (keeping the back button honest).
const key = (hash) => hash.replace(/^#\/?/, '').replace(/\/+$/, '').toLowerCase();
let currentHash = window.location.hash;
let previousHash = null;
window.addEventListener('hashchange', () => {
  previousHash = currentHash;
  currentHash = window.location.hash;
});

// Close a layer and show `path`: step back if that is where the reader came
// from, otherwise replace the entry (a deep link should not leave the closed
// layer one back-press away).
export function closeTo(path) {
  if (previousHash !== null && key(previousHash) === key(path)) window.history.back();
  else window.location.replace(`#${path}`);
}

// The race whose pop-up closed last, so the state or country pop-up can put
// focus back on that race's card.
let lastRace = null;
export const rememberRace = (id) => {
  lastRace = id;
};
export const takeLastRace = () => {
  const id = lastRace;
  lastRace = null;
  return id;
};
