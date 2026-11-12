import React from 'react';
import { proposals, billStatuses, confidenceLevels, stateName, domains } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/Analysis.css';

function ProposalRow({ p, domainId }) {
  const rec = p.record;
  const confidence = confidenceLevels[rec.confidence];
  const needsCheck = rec.confidence !== 'high';
  return (
    <li className={`proposal ${p.isMoratorium && domainId === 'data-centers' ? 'moratorium' : ''}`}>
      <div className="proposal-tags">
        <span className="ptag">{p.type === 'bill' ? `Bill · ${stateName(p.jurisdiction)}` : `Candidate proposal · ${stateName(p.jurisdiction)}`}</span>
        {p.isMoratorium && domainId === 'data-centers' && <span className="ptag moratorium-tag">Data center moratorium / pause</span>}
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

function Column({ domainId, items }) {
  // Moratoriums are data center moratoriums, so they are grouped only there.
  const groupMoratoriums = domainId === 'data-centers';
  const moratoriums = groupMoratoriums ? items.filter((p) => p.isMoratorium) : [];
  const others = groupMoratoriums ? items.filter((p) => !p.isMoratorium) : items;
  return (
    <div className={`proposal-column ${domainId}`}>
      <h4 className={`domain-heading ${domainId}`}>{domains[domainId].label}</h4>
      {items.length === 0 && <p className="empty-note">No proposals recorded.</p>}
      {moratoriums.length > 0 && (
        <>
          <h5>Proposed moratoriums and bans ({moratoriums.length})</h5>
          <ul className="proposal-list">{moratoriums.map((p) => <ProposalRow key={p.id} p={p} domainId={domainId} />)}</ul>
        </>
      )}
      {others.length > 0 && (
        <>
          <h5>{domainId === 'data-centers' ? 'Other bills, plans and actions' : 'Bills, plans and actions'} ({others.length})</h5>
          <ul className="proposal-list">{others.map((p) => <ProposalRow key={p.id} p={p} domainId={domainId} />)}</ul>
        </>
      )}
    </div>
  );
}

// Proposed bills, moratoriums and candidates' concrete proposals, split into
// the two policy areas. With a state, shows that state's items plus federal bills.
function ProposalsPanel({ state, title = 'Proposed bills and moratoriums' }) {
  const { includeDrafts } = useDrafts();
  const items = proposals(includeDrafts, { state });
  const forDomain = (d) => items.filter((p) => p.domains.includes(d));
  return (
    <section className="proposals-panel">
      <h3>{title}</h3>
      <p className="section-note">
        What is being proposed, as distinct from what is said: bills (federal{state ? ` and ${stateName(state)}` : ' and state'}),
        proposed moratoriums, candidates' plans and official actions. Every entry links to its source. Entries marked
        "To verify" came from web search summaries and need checking against the source.
      </p>
      <div className="proposal-columns">
        <Column domainId="data-centers" items={forDomain('data-centers')} />
        <Column domainId="ai-general" items={forDomain('ai-general')} />
      </div>
    </section>
  );
}

export default ProposalsPanel;
