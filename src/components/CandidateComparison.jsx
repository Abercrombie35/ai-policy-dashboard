import React, { useState } from 'react';
import ItemCard, { HiddenDraftsNotice } from './ItemCard';
import { filterDrafts } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/CandidateComparison.css';

// Every candidate gets the same tabs and fields (symmetric treatment).
const TABS = [
  { id: 'overview', label: 'Overview', kinds: ['profile', 'stance'] },
  { id: 'statements', label: 'Statements', kinds: ['statement'] },
  { id: 'positions', label: 'Positions', kinds: ['position'] },
  { id: 'alignment', label: 'Alignment & endorsements', kinds: ['alignment', 'endorsement'] },
  { id: 'projections', label: 'Projections', kinds: ['projection'] },
];

const initials = (name) => name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

function QuestionnaireStatus({ q }) {
  if (!q) return null;
  switch (q.status) {
    case 'no-response':
      return <span>Questionnaire: No response received as of {q.asOf}</span>;
    case 'responded':
      return <span>Questionnaire: responded {q.asOf}</span>;
    case 'sent':
      return <span>Questionnaire: sent{q.deadline ? `, deadline ${q.deadline}` : ''}</span>;
    default:
      return <span>Questionnaire: not yet sent</span>;
  }
}

function CandidateComparison({ race }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { includeDrafts } = useDrafts();
  const tab = TABS.find((t) => t.id === activeTab);

  const inTab = race.items.filter((i) => tab.kinds.includes(i.kind));
  const shown = filterDrafts(inTab, includeDrafts);

  return (
    <div className="candidate-comparison">
      <div className="candidate-headers" style={{ '--cols': race.candidates.length }}>
        {race.candidates.map((c) => (
          <div key={c.id} className="candidate-header">
            <div className={`avatar ${c.party.toLowerCase()}`} aria-hidden="true">{initials(c.name)}</div>
            <div>
              <h3>{c.name}</h3>
              <span className={`party-badge ${c.party.toLowerCase()}`}>{c.party}</span>
              <div className="questionnaire"><QuestionnaireStatus q={c.questionnaire} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="tabs-header" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={`tab-button ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tabs-content" role="tabpanel">
        {tab.id === 'projections' && (
          <p className="section-note">
            Projections are conditional estimates of possible policy direction, not predictions or facts.
          </p>
        )}
        <HiddenDraftsNotice count={inTab.length - shown.length} />
        <div className="comparison-row" style={{ '--cols': race.candidates.length }}>
          {race.candidates.map((c) => {
            const mine = shown.filter((i) => i.candidateId === c.id);
            const anyAtAll = inTab.some((i) => i.candidateId === c.id);
            return (
              <div key={c.id} className="candidate-column" aria-label={c.name}>
                <div className="column-name">{c.name}</div>
                {mine.length ? (
                  mine.map((item) => <ItemCard key={item.id} item={item} />)
                ) : (
                  <p className="empty-note">
                    {anyAtAll ? 'No verified records in this category yet.' : 'No records in this category yet.'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CandidateComparison;
