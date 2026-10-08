import React, { useState } from 'react';
import '../styles/CandidateComparison.css';

function CandidateComparison({ candidates, race }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (candidates.length !== 2) {
    return <div>Error: Expected 2 candidates</div>;
  }

  const [dem, rep] = candidates.sort((a, b) =>
    a.party === 'Democratic' ? -1 : 1
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'quotes', label: 'Quotes & Statements' },
    { id: 'policy', label: 'AI Policy Positions' },
    { id: 'alignment', label: 'Party Alignment' },
    { id: 'projection', label: 'Policy Projection' },
  ];

  return (
    <div className="candidate-comparison">
      {/* Polling Center */}
      <div className="polling-center">
        <div className="poll-item dem-poll">
          <div className="candidate-name">{dem.name}</div>
          <div className="poll-number">{dem.polling.current}%</div>
          <div className="poll-trend up">↑ {dem.polling.trend}</div>
        </div>
        <div className="poll-divider" />
        <div className="poll-item rep-poll">
          <div className="candidate-name">{rep.name}</div>
          <div className="poll-number">{rep.polling.current}%</div>
          <div className="poll-trend flat">→ {rep.polling.trend}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="tabs-content">
        {activeTab === 'overview' && (
          <div className="comparison-row">
            <CandidatePanel candidate={dem} side="left" />
            <CandidatePanel candidate={rep} side="right" />
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="comparison-row">
            <QuotesPanel candidate={dem} side="left" />
            <QuotesPanel candidate={rep} side="right" />
          </div>
        )}

        {activeTab === 'policy' && (
          <div className="comparison-row">
            <PolicyPositionsPanel candidate={dem} side="left" />
            <PolicyPositionsPanel candidate={rep} side="right" />
          </div>
        )}

        {activeTab === 'alignment' && (
          <div className="comparison-row">
            <AlignmentPanel candidate={dem} side="left" />
            <AlignmentPanel candidate={rep} side="right" />
          </div>
        )}

        {activeTab === 'projection' && (
          <div className="comparison-row">
            <ProjectionPanel candidate={dem} side="left" />
            <ProjectionPanel candidate={rep} side="right" />
          </div>
        )}
      </div>
    </div>
  );
}

function CandidatePanel({ candidate, side }) {
  return (
    <div className={`candidate-panel ${side}`}>
      <div className="candidate-header">
        <img src={candidate.photo} alt={candidate.name} className="candidate-photo" />
        <div>
          <h3>{candidate.name}</h3>
          <span className={`party-badge ${candidate.party.toLowerCase()}`}>
            {candidate.party}
          </span>
        </div>
      </div>
      <p className="bio">{candidate.bio}</p>
      <div className="stance-card">
        <strong>AI Policy Stance:</strong>
        <p>{candidate.aiPolicy.stance}</p>
      </div>
    </div>
  );
}

function QuotesPanel({ candidate, side }) {
  return (
    <div className={`candidate-panel ${side}`}>
      <div className="quotes-list">
        {candidate.quotes.map((quote, idx) => (
          <div key={idx} className="quote-item">
            <blockquote>{quote.text}</blockquote>
            <div className="quote-meta">
              <span className="source">{quote.source}</span>
              <span className="date">{quote.date}</span>
              <span className="context">{quote.context}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PolicyPositionsPanel({ candidate, side }) {
  return (
    <div className={`candidate-panel ${side}`}>
      <h4>{candidate.aiPolicy.stance}</h4>
      <ul className="positions-list">
        {candidate.aiPolicy.keyPositions.map((pos, idx) => (
          <li key={idx}>{pos}</li>
        ))}
      </ul>
    </div>
  );
}

function AlignmentPanel({ candidate, side }) {
  return (
    <div className={`candidate-panel ${side}`}>
      <div className="alignment-score">
        <div className="score-label">Party Alignment</div>
        <div className="score-bar">
          <div
            className="score-fill"
            style={{ width: `${candidate.partyAlignment.score * 100}%` }}
          />
        </div>
        <div className="score-number">{(candidate.partyAlignment.score * 100).toFixed(0)}%</div>
      </div>
      <p>{candidate.partyAlignment.description}</p>
      {candidate.partyAlignment.deviations.length > 0 && (
        <div className="deviations">
          <strong>Deviations:</strong>
          <ul>
            {candidate.partyAlignment.deviations.map((dev, idx) => (
              <li key={idx}>{dev}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="endorsements">
        <strong>Endorsements:</strong>
        <ul>
          {candidate.endorsements.map((end, idx) => (
            <li key={idx}>
              {end.organization} <span className="endorsement-date">({end.date})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProjectionPanel({ candidate, side }) {
  return (
    <div className={`candidate-panel ${side}`}>
      <div className="projection-card">
        <h4>If Elected</h4>
        <p>{candidate.policyProjection.ifElected}</p>
      </div>
      <div className="initiatives">
        <strong>Key Initiatives:</strong>
        <ul>
          {candidate.policyProjection.keyInitiatives.map((init, idx) => (
            <li key={idx}>{init}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CandidateComparison;
