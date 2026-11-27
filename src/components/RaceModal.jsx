import React, { useCallback, useEffect, useRef } from 'react';
import RaceView from './RaceView';
import ErrorBoundary from './ErrorBoundary';
import { placeOf } from '../lib/data';
import { closeTo, rememberRace } from '../lib/router';
import '../styles/RaceModal.css';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

// A race in a large pop-up over the map (80% of the screen; the full screen
// on phones). Built to avoid the blank screen reported on Nov. 16 with the
// old in-pop-up races: the dialog is the only scroll area, the overlay has a
// plain dim background (no blur) and nothing is animated with transforms.
function RaceModal({ race }) {
  const contentRef = useRef(null);
  const raceId = useRef(race.id);
  raceId.current = race.id;
  const parent = race.country ? `/country/${race.country}` : `/state/${race.state}`;
  const close = useCallback(() => closeTo(parent), [parent]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      const box = contentRef.current;
      if (!box) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      // Keep focus inside the dialog.
      const nodes = [...box.querySelectorAll(FOCUSABLE)].filter((n) => n.getClientRects().length > 0);
      if (nodes.length === 0) {
        e.preventDefault();
        box.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const inside = box.contains(active) && active !== box;
      if (e.shiftKey && (!inside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      rememberRace(raceId.current);
      if (previousFocus && previousFocus !== document.body && document.contains(previousFocus)) previousFocus.focus();
    };
  }, [close]);

  // A new race starts at the top, with focus on the dialog.
  useEffect(() => {
    const box = contentRef.current;
    if (!box) return;
    box.scrollTop = 0;
    box.focus({ preventScroll: true });
  }, [race.id]);

  return (
    <div
      className="race-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="race-modal-content race-page"
        role="dialog"
        aria-modal="true"
        aria-label={`${race.office}: ${placeOf(race)}`}
        tabIndex={-1}
        ref={contentRef}
      >
        <button type="button" className="modal-close" onClick={close} aria-label="Close">×</button>
        <ErrorBoundary resetKey={race.id}>
          <RaceView race={race} onBack={close} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default RaceModal;
