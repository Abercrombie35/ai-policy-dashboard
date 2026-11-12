import React from 'react';
import { labelInfo, confidenceLevels, dimensions, categoryLabel, isVerified, trackOf, domainsOf, domains, stanceLabel, questionById } from '../lib/data';
import { TrackTag } from './Analysis';
import { useDrafts } from '../lib/drafts';
import '../styles/ItemCard.css';

export function LabelBadges({ record }) {
  const type = labelInfo(record.labelType);
  const confidence = confidenceLevels[record.confidence];
  return (
    <div className="label-badges">
      <span className={`badge type-${record.labelType}`} title={type?.description}>{type?.label || record.labelType}</span>
      <span className={`badge confidence-${record.confidence}`} title={confidence?.description}>
        {isVerified(record) ? `Confidence: ${confidence?.label}` : confidence?.label}
      </span>
    </div>
  );
}

export function RecordMeta({ record }) {
  const src = record.source || {};
  return (
    <dl className="record-meta">
      <div>
        <dt>Source</dt>
        <dd>
          {src.url ? (
            <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title || src.url}</a>
          ) : (
            src.title || <span className="missing">None recorded</span>
          )}
        </dd>
      </div>
      <div>
        <dt>Published</dt>
        <dd>{record.publishedDate || <span className="missing">Unknown</span>}</dd>
      </div>
      <div>
        <dt>Last verified</dt>
        <dd>{record.lastVerified || <span className="missing">Never</span>}</dd>
      </div>
      <div>
        <dt>Version</dt>
        <dd title={record.history.map((h) => `v${h.version} (${h.date}): ${h.note}`).join('\n')}>v{record.version}</dd>
      </div>
    </dl>
  );
}

export function CodingChips({ coding }) {
  if (!coding) return null;
  const chips = [];
  for (const dim of dimensions) {
    const value = coding[dim.id];
    const values = Array.isArray(value) ? value : value ? [value] : [];
    values.forEach((v) => chips.push({ key: `${dim.id}-${v}`, dim: dim.label, label: categoryLabel(dim.id, v) }));
  }
  if (chips.length === 0) return null;
  return (
    <details className="coding">
      <summary>
        Coding {coding.reviewed ? '(reviewed)' : '(AI-model draft, not reviewed)'}
      </summary>
      <ul>
        {chips.map((c) => (
          <li key={c.key}><span className="dim">{c.dim}:</span> {c.label}</li>
        ))}
      </ul>
      {coding.note && <p className="coding-note">{coding.note}</p>}
    </details>
  );
}

// Said / proposed and which policy area(s) a record speaks to.
export function ScopeTags({ record }) {
  const track = trackOf(record);
  const ds = domainsOf(record);
  if (!track && ds.length === 0) return null;
  return (
    <div className="scope-tags">
      <TrackTag track={track} />
      {ds.map((d) => <span key={d} className={`domain-tag ${d}`}>{domains[d].label}</span>)}
    </div>
  );
}

function Stances({ stances }) {
  if (!stances || Object.keys(stances).length === 0) return null;
  return (
    <ul className="stance-list">
      {Object.entries(stances).map(([q, s]) => (
        <li key={q}><span className="dim">{questionById[q]?.label}:</span> {stanceLabel(q, s)}</li>
      ))}
    </ul>
  );
}

function ItemCard({ item }) {
  const latest = item.history[item.history.length - 1];
  return (
    <article className={`item-card ${isVerified(item) ? '' : 'draft'}`}>
      <LabelBadges record={item} />
      <ScopeTags record={item} />
      {item.labelType === 'direct-quote' ? (
        <blockquote>{item.text}</blockquote>
      ) : (
        <p className="item-text">{item.text}</p>
      )}
      {item.dateNote && <p className="date-note">When: {item.dateNote}</p>}
      <Stances stances={item.stances} />
      <RecordMeta record={item} />
      {item.confidence !== 'high' && item.confidence !== 'medium' && latest?.note && <p className="draft-note">{latest.note}</p>}
      <CodingChips coding={item.coding} />
    </article>
  );
}

// Shown wherever unverified records were filtered out of a list.
export function HiddenDraftsNotice({ count }) {
  const { includeDrafts, setIncludeDrafts } = useDrafts();
  if (includeDrafts || count === 0) return null;
  return (
    <div className="hidden-drafts">
      <span>
        {count} unverified draft record{count > 1 ? 's are' : ' is'} hidden until checked against sources.
      </span>
      <button type="button" className="link-button" onClick={() => setIncludeDrafts(true)}>Show drafts</button>
    </div>
  );
}

export default ItemCard;
