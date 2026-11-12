import React, { useMemo, useState } from 'react';
import BillCard from '../components/BillCard';
import { HiddenDraftsNotice } from '../components/ItemCard';
import { bills, billStatuses, filterDrafts, stateName, legislationNote } from '../lib/data';
import { useDrafts } from '../lib/drafts';

function LegislationView() {
  const { includeDrafts } = useDrafts();
  const [state, setState] = useState('all');
  const [status, setStatus] = useState('all');

  const states = useMemo(() => [...new Set(bills.map((b) => b.state))].sort((a, b) => stateName(a).localeCompare(stateName(b))), []);
  const inScope = bills.filter((b) => (state === 'all' || b.state === state) && (status === 'all' || b.status === status));
  const shown = filterDrafts(inScope, includeDrafts);

  return (
    <div className="page">
      <header className="page-head">
        <h2>State AI legislation</h2>
        <p>
          AI bills by state, with sponsors, party, topic and status, so that what legislators do can be compared with what
          candidates say (research question 3).
        </p>
        <p className="fine-print">{legislationNote}</p>
      </header>

      <div className="filter-row">
        <label>
          State
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="all">All states</option>
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
      {shown.length ? (
        <div className="bill-list">
          {shown.map((bill) => <BillCard key={bill.id} bill={bill} showState />)}
        </div>
      ) : (
        inScope.length === 0 && <p className="empty-note">No bills match these filters.</p>
      )}
    </div>
  );
}

export default LegislationView;
