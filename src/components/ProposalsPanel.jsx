import React from 'react';
import { PolicyBox, SourceList, makeSourceIndex } from './PolicyBox';
import { proposals, stateName, countryName, domains, categoriesInDomain, primaryCategory } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import '../styles/Analysis.css';

// One category: its policy boxes, then their numbered sources.
function CategoryGroup({ cat, list, refPrefix }) {
  const index = makeSourceIndex(list.map((p) => p.record));
  return (
    <section className="category-group">
      <h5 title={cat.description}>{cat.label} ({list.length})</h5>
      <p className="category-desc">{cat.description}</p>
      <ul className="policy-list">
        {list.map((p) => (
          <li key={p.id}>
            <PolicyBox
              record={p.record}
              party={p.party}
              bloc={p.bloc}
              race={p.race}
              candidate={p.candidate}
              refNum={index.numberOf(p.record)}
              refPrefix={refPrefix}
            />
          </li>
        ))}
      </ul>
      <SourceList index={index} refPrefix={refPrefix} />
    </section>
  );
}

// One policy area: proposals grouped under that area's categories, in
// codebook order. Each proposal sits under its first category in this area.
function Column({ domainId, items, scope }) {
  const groups = categoriesInDomain(domainId)
    .map((cat) => ({ cat, list: items.filter((p) => primaryCategory(p.record, domainId) === cat.id) }))
    .filter((g) => g.list.length > 0);
  const uncategorized = items.filter((p) => !primaryCategory(p.record, domainId));
  if (uncategorized.length) groups.push({ cat: { id: 'none', label: 'Not yet categorized', description: '' }, list: uncategorized });
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
        <CategoryGroup key={cat.id} cat={cat} list={list} refPrefix={`src-${scope}-${cat.id}`} />
      ))}
    </div>
  );
}

// Proposed bills, moratoriums and candidates' concrete proposals and official
// actions, split into the two policy areas and grouped by category. With a
// state, shows that state's items plus federal bills; with a country, that
// country's items plus EU law.
function ProposalsPanel({ state, country, title = 'Proposed bills and moratoriums' }) {
  const { includeDrafts } = useDrafts();
  const items = proposals(includeDrafts, { state, country });
  const forDomain = (d) => items.filter((p) => p.domains.includes(d));
  const scope = state || (country ? `intl-${country}` : 'all');
  return (
    <section className="proposals-panel">
      <h3>{title}</h3>
      {country ? (
        <p className="section-note">
          What is being proposed, as distinct from what is said: {countryName(country)}'s bills and government plans, the
          EU laws that apply there, and candidates' concrete plans, grouped by category. Boxes are tinted by political
          bloc: pink left, amber centre, teal right, brown far right; gray where no bloc applies (EU law). Numbers point
          to the sources listed under each category.
        </p>
      ) : (
        <p className="section-note">
          What is being proposed, as distinct from what is said: bills (federal{state ? ` and ${stateName(state)}` : ' and state'}),
          proposed moratoriums, candidates' plans and official actions, grouped by category. Blue boxes are Democratic,
          red Republican, purple bipartisan. Numbers point to the sources listed under each category.
        </p>
      )}
      <div className="proposal-columns">
        <Column domainId="data-centers" items={forDomain('data-centers')} scope={scope} />
        <Column domainId="ai-general" items={forDomain('ai-general')} scope={scope} />
      </div>
    </section>
  );
}

export default ProposalsPanel;
