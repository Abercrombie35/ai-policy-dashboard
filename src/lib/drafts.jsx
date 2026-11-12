import React, { createContext, useContext, useState } from 'react';

// Unverified draft records are hidden from the public view unless a reader
// opts in. Flip this to true to show drafts by default.
export const SHOW_DRAFTS_BY_DEFAULT = false;

const DraftsContext = createContext({ includeDrafts: SHOW_DRAFTS_BY_DEFAULT, setIncludeDrafts: () => {} });

export function DraftsProvider({ children }) {
  const [includeDrafts, setIncludeDrafts] = useState(() => {
    const stored = window.sessionStorage.getItem('includeDrafts');
    return stored == null ? SHOW_DRAFTS_BY_DEFAULT : stored === 'true';
  });
  const set = (value) => {
    window.sessionStorage.setItem('includeDrafts', String(value));
    setIncludeDrafts(value);
  };
  return (
    <DraftsContext.Provider value={{ includeDrafts, setIncludeDrafts: set }}>{children}</DraftsContext.Provider>
  );
}

export const useDrafts = () => useContext(DraftsContext);
