import React, { useMemo, useState } from 'react';
import BillCard from '../components/BillCard';
import { HiddenDraftsNotice } from '../components/ItemCard';
import { bills, billStatuses, filterDrafts, stateName, legislationNote, domainsOf, domains, DOMAIN_IDS, categoriesInDomain, primaryCategory } from '../lib/data';
import { useDrafts } from '../lib/drafts';

function LegislationView() {
  const { includeDrafts } = useDrafts();
  const [state, setState] = useState('all');
  const [status, setStatus] = useState('all');
  const [domain, setDomain] = useState('all');
  const [category, setCategory] = useState('all');

  const states = useMemo(() => [...new Set(bills.map((b) => b.state))].sort((a, b) => stateName(a).localeCompare(stateName(b))), []);
  const inScope = bills.filter(
    (b) =>
      (state === 'all' || b.state === state) &&
      (status === 'all' || b.status === status) &&
      (domain === 'all' || domainsOf(b).includes(domain)) &&
      (category === 'all' || (b.categories || []).includes(category)),
  );
  const shown = filterDrafts(inScope, includeDrafts);
  const areas = domain === 'all' ? DOMAIN_IDS : [domain];

  return (
    <div className="page">
      <header className="page-head">
        <h2>AI legislation and proposed moratoriums</h2>
        <p>
          Federal and state AI bills, including proposed data center moratoriums, with sponsors, party, topic and status,
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
            <option value="all">Federal and all states</option>
            {states.map((s) => <option key={s} value={s}>{stateName(s)}</option>)}
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
              return (
                <section key={cat.id} className="category-group">
                  <h4 title={cat.description}>{cat.label} ({list.length})</h4>
                  <p className="category-desc">{cat.description}</p>
                  <div className="bill-list">
                    {list.map((bill) => <BillCard key={bill.id} bill={bill} showState />)}
                  </div>
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
