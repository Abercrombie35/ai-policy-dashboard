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
