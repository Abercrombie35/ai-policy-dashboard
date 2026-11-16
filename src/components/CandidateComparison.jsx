import React, { useState } from 'react';
import ItemCard, { HiddenDraftsNotice } from './ItemCard';
import { filterDrafts, itemsForRace, domainsOf, trackOf, domains, tracks, categoriesInDomain, primaryCategory } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/CandidateComparison.css';

// Every candidate gets the same tabs and fields (symmetric treatment). The two
// policy-area tabs split each candidate's records into what they said and
// what they proposed.
const POLICY_KINDS = ['statement', 'position', 'action'];
const TABS = [
  { id: 'overview', label: 'Overview', kinds: ['profile', 'stance'] },
  { id: 'data-centers', label: 'Data centers', domain: 'data-centers' },
  { id: 'ai-general', label: 'Everything else in AI', domain: 'ai-general' },
  { id: 'alignment', label: 'Alignment & endorsements', kinds: ['alignment', 'endorsement'] },
  { id: 'projections', label: 'Projections', kinds: ['projection'] },
];

// A policy-area tab: one row per category, with the candidates side by side
// and each candidate's records split into what they said and proposed.
function DomainByCategory({ domainId, candidates, shown }) {
  const rows = categoriesInDomain(domainId)
    .map((cat) => ({ cat, items: shown.filter((i) => primaryCategory(i, domainId) === cat.id) }))
    .filter((r) => r.items.length > 0);
  const uncategorized = shown.filter((i) => !primaryCategory(i, domainId));
  if (uncategorized.length) rows.push({ cat: { id: 'none', label: 'Not yet categorized', description: '' }, items: uncategorized });
  if (rows.length === 0) return <p className="empty-note">No records in this area yet.</p>;
  return (
    <>
      <nav className="category-index" aria-label="Categories in this area">
        {rows.map(({ cat, items }) => (
          <span key={cat.id} className="category-chip" title={cat.description}>{cat.label} · {items.length}</span>
        ))}
      </nav>
      {rows.map(({ cat, items }) => (
        <section key={cat.id} className="category-row">
          <h5 title={cat.description}>{cat.label}</h5>
          {cat.description && <p className="category-desc">{cat.description}</p>}
          <div className="comparison-row" style={{ '--cols': candidates.length }}>
            {candidates.map((c) => {
              const mine = items.filter((i) => i.candidateId === c.id);
              return (
                <div key={c.id} className="candidate-column" aria-label={`${c.name}: ${cat.label}`}>
                  <div className="column-name">{c.name}</div>
                  {['said', 'proposed'].map((t) => {
                    const list = mine.filter((i) => trackOf(i) === t);
                    if (list.length === 0) return null;
                    return (
                      <div key={t} className={`track-group track-${t}`}>
                        <h6 title={tracks[t].description}>{tracks[t].label}</h6>
                        {list.map((item) => <ItemCard key={item.id} item={item} />)}
                      </div>
                    );
                  })}
                  {mine.length === 0 && <p className="empty-note">Nothing recorded.</p>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

const inTab = (tab, item) =>
  tab.domain ? POLICY_KINDS.includes(item.kind) && domainsOf(item).includes(tab.domain) : tab.kinds.includes(item.kind);

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
  const candidates = race.candidates || [];

  const tabItems = itemsForRace(race).filter((i) => inTab(tab, i));
  const shown = filterDrafts(tabItems, includeDrafts);

  return (
    <div className="candidate-comparison">
      <div className="candidate-headers" style={{ '--cols': candidates.length }}>
        {candidates.map((c) => (
          <div key={c.id} className="candidate-header">
            <div className={`avatar ${(c.party || '').toLowerCase()}`} aria-hidden="true">{initials(c.name)}</div>
            <div>
              <h3>{c.name}</h3>
              <span className={`party-badge ${(c.party || '').toLowerCase()}`}>{c.party}</span>
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
        {tab.domain && <p className="section-note">{domains[tab.domain].description}</p>}
        <HiddenDraftsNotice count={tabItems.length - shown.length} />
        {tab.domain ? (
          <DomainByCategory domainId={tab.domain} candidates={candidates} shown={shown} />
        ) : (
          <div className="comparison-row" style={{ '--cols': candidates.length }}>
            {candidates.map((c) => {
              const mine = shown.filter((i) => i.candidateId === c.id);
              const anyAtAll = tabItems.some((i) => i.candidateId === c.id);
              return (
                <div key={c.id} className="candidate-column" aria-label={c.name}>
                  <div className="column-name">{c.name}</div>
                  {mine.length ? (
                    mine.map((item) => <ItemCard key={item.id} item={item} />)
                  ) : (
                    <p className="empty-note">
                      {anyAtAll ? 'Only unverified drafts here so far.' : 'No records in this category yet.'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateComparison;
