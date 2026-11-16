import React, { useEffect, useRef } from 'react';
import StateView from './StateView';
import ErrorBoundary from './ErrorBoundary';
import { stateName } from '../lib/data';
import '../styles/StateModal.css';

function StateModal({ stateAbbr, onClose }) {
  const contentRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    contentRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="state-modal-overlay" onClick={onClose}>
      <div
        className="state-modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={stateName(stateAbbr)}
        tabIndex={-1}
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <ErrorBoundary resetKey={stateAbbr}>
          <StateView stateAbbr={stateAbbr} onClose={onClose} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default StateModal;
