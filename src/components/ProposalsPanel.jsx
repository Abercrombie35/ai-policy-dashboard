import React from 'react';
import { proposals, billStatuses, confidenceLevels, stateName, domains, categoriesInDomain, categoryById, primaryCategory } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/Analysis.css';

const partyClass = (party) => (['Democratic', 'Republican'].includes(party) ? party.toLowerCase() : 'other');

function ProposalRow({ p, domainId }) {
  const rec = p.record;
  const confidence = confidenceLevels[rec.confidence];
  const needsCheck = rec.confidence !== 'high';
  // Other categories this proposal also falls under, in either policy area.
  const primary = primaryCategory(rec, domainId);
  const others = (rec.categories || []).filter((c) => c !== primary);
  return (
    <li className="proposal">
      <div className="proposal-tags">
        <span className="ptag">
          {p.type === 'bill' ? 'Bill' : rec.kind === 'action' ? 'Official action / vote' : 'Candidate proposal'} · {stateName(p.jurisdiction)}
        </span>
        <span className={`ptag party-${partyClass(p.party)}`}>{p.party}</span>
        {p.type === 'bill' && <span className="ptag status">{billStatuses[rec.status]?.label || rec.status}</span>}
        <span className={`badge confidence-${rec.confidence}`} title={confidence?.description}>
          {rec.confidence === 'unverified' ? confidence?.label : `Confidence: ${confidence?.label}`}
        </span>
        {needsCheck && <span className="ptag verify">To verify</span>}
      </div>
      <div className="proposal-title">{p.title}</div>
      <div className="proposal-meta">
        {p.who}
        {p.date ? ` · ${p.date}` : rec.dateNote ? ` · ${rec.dateNote}` : ''}
        {rec.statusNote ? ` · ${rec.statusNote}` : ''}
      </div>
      {p.type === 'bill' && rec.summary && <p className="proposal-summary">{rec.summary}</p>}
      {others.length > 0 && (
        <div className="proposal-also">
          Also: {others.map((c) => categoryById[c]?.label || c).join(' · ')}
        </div>
      )}
      <div className="proposal-source">
        Source:{' '}
        {rec.source?.url ? (
          <a href={rec.source.url} target="_blank" rel="noopener noreferrer">{rec.source.title || rec.source.url}</a>
        ) : (
          <span className="missing">None recorded</span>
        )}
      </div>
    </li>
  );
}

// One policy area: proposals grouped under that area's categories, in
// codebook order. Each proposal sits under its first category in this area.
function Column({ domainId, items }) {
  const groups = categoriesInDomain(domainId)
    .map((cat) => ({ cat, list: items.filter((p) => primaryCategory(p.record, domainId) === cat.id) }))
    .filter((g) => g.list.length > 0);
  const uncategorized = items.filter((p) => !primaryCategory(p.record, domainId));
  return (
    <div className={`proposal-column ${domainId}`}>
      <h4 className={`domain-heading ${domainId}`}>{domains[domainId].label} ({items.length})</h4>
      {items.length === 0 && <p className="empty-note">No proposals recorded.</p>}
      <nav className="category-index" aria-label={`${domains[domainId].label} categories`}>
        {groups.map(({ cat, list }) => (
          <span key={cat.id} className="category-chip" title={cat.description}>{cat.label} · {list.length}</span>
        ))}
      </nav>
      {groups.map(({ cat, list }) => (
        <section key={cat.id} className="category-group">
          <h5 title={cat.description}>{cat.label} ({list.length})</h5>
          <p className="category-desc">{cat.description}</p>
          <ul className="proposal-list">{list.map((p) => <ProposalRow key={p.id} p={p} domainId={domainId} />)}</ul>
        </section>
      ))}
      {uncategorized.length > 0 && (
        <section className="category-group">
          <h5>Not yet categorized ({uncategorized.length})</h5>
          <ul className="proposal-list">{uncategorized.map((p) => <ProposalRow key={p.id} p={p} domainId={domainId} />)}</ul>
        </section>
      )}
    </div>
  );
}

// Proposed bills, moratoriums and candidates' concrete proposals and official
// actions, split into the two policy areas and grouped by category. With a
// state, shows that state's items plus federal bills.
function ProposalsPanel({ state, title = 'Proposed bills and moratoriums' }) {
  const { includeDrafts } = useDrafts();
  const items = proposals(includeDrafts, { state });
  const forDomain = (d) => items.filter((p) => p.domains.includes(d));
  return (
    <section className="proposals-panel">
      <h3>{title}</h3>
      <p className="section-note">
        What is being proposed, as distinct from what is said: bills (federal{state ? ` and ${stateName(state)}` : ' and state'}),
        proposed moratoriums, candidates' plans and official actions, grouped by category. Every entry links to its source.
        Entries marked "To verify" came from web search summaries and need checking against the source.
      </p>
      <div className="proposal-columns">
        <Column domainId="data-centers" items={forDomain('data-centers')} />
        <Column domainId="ai-general" items={forDomain('ai-general')} />
      </div>
    </section>
  );
}

export default ProposalsPanel;
