import React from 'react';
import { scenarios, researchRecords, bills, partyLines, raceById, headlineOf, confidenceLevels, domains, questionById } from '../lib/data';

const recordIndex = new Map(researchRecords.map((r) => [r.id, r]));
const billIndex = new Map(bills.map((b) => [b.id, b]));
const lineIndex = new Map(partyLines.positions.map((p) => [p.id, p]));

// A link and a short label for one piece of coded evidence.
function Evidence({ id }) {
  const rec = recordIndex.get(id);
  if (rec) {
    const race = raceById(rec.raceId);
    const href = race ? (race.country ? `#/country/${race.country}/${race.id}` : `#/state/${race.state}/${race.id}`) : '#/';
    const who = race?.candidates.find((c) => c.id === rec.candidateId)?.name;
    return <a href={href}>{who}: {headlineOf(rec) || rec.text.slice(0, 70)}</a>;
  }
  const bill = billIndex.get(id);
  if (bill) return <a href="#/legislation">{bill.billNumber}: {bill.title}</a>;
  const line = lineIndex.get(id);
  if (line) return <a href="#/analysis">{line.party} party line: {questionById[line.questionId]?.label || line.questionId}</a>;
  return <span>{id}</span>;
}

function ScenariosView() {
  return (
    <div className="page scenarios-page">
      <header className="page-head">
        <h2>Conditional scenarios</h2>
        <p>
          Possible directions for state and federal AI rules after the 2026 elections. Each is a <strong>projection</strong>:
          it states its assumptions, the coded records it rests on and what would change it. These are not predictions;
          read the assumptions first. Reviewed {scenarios.asOf}.
        </p>
      </header>
      {scenarios.scenarios.map((sc) => (
        <article key={sc.id} className="item-card scenario-card" id={sc.id}>
          <div className="label-badges">
            <span className="badge type-projection">Projection</span>
            <span className={`badge confidence-${sc.confidence}`}>Confidence: {confidenceLevels[sc.confidence]?.label}</span>
            <span className={`domain-tag ${sc.domain}`}>{domains[sc.domain]?.label}</span>
            <span className="category-tag">{sc.level === 'federal' ? 'Federal' : 'State'}</span>
          </div>
          <h3>{sc.title}</h3>
          <p className="scenario-projection">{sc.projection}</p>
          <h4>Assumptions</h4>
          <ul>{sc.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
          <h4>Why</h4>
          <p>{sc.reasoning}</p>
          <h4>What would change it</h4>
          <ul>{sc.wouldChangeIf.map((a) => <li key={a}>{a}</li>)}</ul>
          <details>
            <summary>Evidence ({sc.evidence.length} coded records, bills and party lines)</summary>
            <ul className="scenario-evidence">{sc.evidence.map((id) => <li key={id}><Evidence id={id} /></li>)}</ul>
          </details>
        </article>
      ))}
    </div>
  );
}

export default ScenariosView;
