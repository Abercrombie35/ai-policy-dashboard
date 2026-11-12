import React from 'react';
import { LabelBadges, RecordMeta, CodingChips } from './ItemCard';
import { billStatuses, isVerified, stateName } from '../lib/data';

function BillCard({ bill, showState = false }) {
  const latest = bill.history[bill.history.length - 1];
  return (
    <article className={`item-card bill-card ${isVerified(bill) ? '' : 'draft'}`}>
      <LabelBadges record={bill} />
      <div className="bill-head">
        <h4>
          {showState && <span className="bill-state">{stateName(bill.state)} · </span>}
          {bill.billNumber}: {bill.title}
        </h4>
        <div className="bill-sub">
          {bill.session} · <strong>{billStatuses[bill.status]?.label || bill.status}</strong>
          {bill.statusDate ? ` (${bill.statusDate})` : ''}
        </div>
      </div>
      {bill.sponsors?.length > 0 && (
        <div className="bill-sponsors">
          Sponsors:{' '}
          {bill.sponsors.map((s, i) => (
            <span key={s.name}>
              {i > 0 && ', '}
              {s.name} <span className={`party-tag ${s.party.toLowerCase()}`}>({s.party[0]})</span>
              {s.role ? ` ${s.role}` : ''}
            </span>
          ))}
        </div>
      )}
      {bill.summary && <p className="item-text">{bill.summary}</p>}
      <RecordMeta record={bill} />
      {!isVerified(bill) && latest?.note && <p className="draft-note">{latest.note}</p>}
      <CodingChips coding={bill.coding} />
    </article>
  );
}

export default BillCard;
