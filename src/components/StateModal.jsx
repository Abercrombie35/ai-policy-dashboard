import React, { useEffect } from 'react';
import StateView from './StateView';
import './styles/StateModal.css';

function StateModal({ stateAbbr, stateName, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="state-modal-overlay" onClick={onClose}>
      <div className="state-modal-content" onClick={(e) => e.stopPropagation()}>
        <StateView stateAbbr={stateAbbr} stateName={stateName} onBack={onClose} />
      </div>
    </div>
  );
}

export default StateModal;
