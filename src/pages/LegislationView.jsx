import React, { useMemo, useState } from 'react';
import { PolicyBox, SourceList, makeSourceIndex } from '../components/PolicyBox';
import { HiddenDraftsNotice } from '../components/ItemCard';
import { bills, billStatuses, filterDrafts, jurisdictionKey, jurisdictionLabel, blocOf, legislationNote, domainsOf, domains, DOMAIN_IDS, categoriesInDomain, primaryCategory, categoriesOf, billParty } from '../lib/data';
import { useDrafts } from '../lib/drafts';

function LegislationView() {
  const { includeDrafts } = useDrafts();
  const [state, setState] = useState('all');
  const [status, setStatus] = useState('all');
  const [domain, setDomain] = useState('all');
  const [category, setCategory] = useState('all');

  // U.S. jurisdictions first (federal, then states), then France and the EU.
  const states = useMemo(
    () =>
      [...new Set(bills.map(jurisdictionKey))].sort(
        (a, b) => Number(a.startsWith('intl-')) - Number(b.startsWith('intl-')) || (a === 'US' ? -1 : b === 'US' ? 1 : jurisdictionLabel(a).localeCompare(jurisdictionLabel(b))),
      ),
    [],
  );
  const inScope = bills.filter(
    (b) =>
      (state === 'all' || jurisdictionKey(b) === state) &&
      (status === 'all' || b.status === status) &&
      (domain === 'all' || domainsOf(b).includes(domain)) &&
      (category === 'all' || categoriesOf(b).includes(category)),
  );
  const shown = filterDrafts(inScope, includeDrafts);
  const areas = domain === 'all' ? DOMAIN_IDS : [domain];

  return (
    <div className="page">
      <header className="page-head">
        <h2>AI legislation and proposed moratoriums</h2>
        <p>
          Federal and state AI bills, including proposed data center moratoriums, plus French and EU laws for the France
          pilot, with sponsors, party, topic and status,
          so that what legislators do can be compared with what candidates say (research question 3). Every bill links to
          its source; most still need checking.
        </p>
        <p className="fine-print">{legislationNote}</p>
      </header>

      <div className="filter-row">
        <label>
          Policy area
          <select value={domain} onChange={(e) => { setDomain(e.target.value); setCategory('all'); }}>
            <option value="all">Both areas</option>
            {DOMAIN_IDS.map((d) => <option key={d} value={d}>{domains[d].label}</option>)}
          </select>
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {areas.map((d) => (
              <optgroup key={d} label={domains[d].label}>
                {categoriesInDomain(d).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <label>
          Jurisdiction
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="all">All (U.S., France and EU)</option>
            {states.map((s) => <option key={s} value={s}>{jurisdictionLabel(s)}</option>)}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Any status</option>
            {Object.values(billStatuses).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <HiddenDraftsNotice count={inScope.length - shown.length} />
      {shown.length === 0 && inScope.length === 0 && <p className="empty-note">No bills match these filters.</p>}
      {areas.map((d) => {
        // Group this area's bills by their first category in the area.
        const inArea = shown.filter((b) => domainsOf(b).includes(d));
        if (inArea.length === 0) return null;
        return (
          <section key={d} className="legislation-area">
            <h3 className={`domain-heading ${d}`}>{domains[d].label} ({inArea.length})</h3>
            {categoriesInDomain(d).map((cat) => {
              const list = inArea.filter((b) => primaryCategory(b, d) === cat.id);
              if (list.length === 0) return null;
              const index = makeSourceIndex(list);
              const refPrefix = `src-leg-${cat.id}`;
              return (
                <section key={cat.id} className="category-group">
                  <h4 title={cat.description}>{cat.label} ({list.length})</h4>
                  <p className="category-desc">{cat.description}</p>
                  <ul className="policy-list">
                    {list.map((bill) => (
                      <li key={bill.id}>
                        <PolicyBox
                          record={bill}
                          party={billParty(bill)}
                          bloc={blocOf(bill)}
                          refNum={index.numberOf(bill)}
                          refPrefix={refPrefix}
                          details={[bill.summary, bill.statusNote].filter(Boolean).join(' ')}
                        />
                      </li>
                    ))}
                  </ul>
                  <SourceList index={index} refPrefix={refPrefix} />
                </section>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

export default LegislationView;
