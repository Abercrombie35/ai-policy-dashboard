import React from 'react';
import { PartyLineCell, DeviationMatrix, DeviationTimeline, StatusTag } from '../components/Analysis';
import { partyLines, domains } from '../lib/data';
import { allCandidates, questionsInDomain, deviationSummary, referenceActors } from '../lib/analysis';
import { useDrafts } from '../lib/drafts';

const PARTIES = ['Republican', 'Democratic'];

function WhereSummary() {
  const { includeDrafts } = useDrafts();
  const summary = deviationSummary(includeDrafts);
  const total = allCandidates().length;
  return (
    <div className="table-wrap">
      <table className="data-table where-table">
        <thead>
          <tr>
            <th scope="col">Policy question</th>
            <th scope="col">Area</th>
            <th scope="col"><StatusTag status="deviates" small /></th>
            <th scope="col"><StatusTag status="aligned" small /></th>
            <th scope="col">Stance changed over time</th>
            <th scope="col"><StatusTag status="no-baseline" small /></th>
            <th scope="col"><StatusTag status="no-evidence" small /></th>
          </tr>
        </thead>
        <tbody>
          {summary.map(({ question, counts }) => (
            <tr key={question.id}>
              <th scope="row">{question.label}</th>
              <td>{domains[questionsInDomain('data-centers').some((q) => q.id === question.id) ? 'data-centers' : 'ai-general'].label}</td>
              <td className="num strong">{counts.deviates} of {total}</td>
              <td className="num">{counts.aligned}</td>
              <td className="num">{counts.shifted}</td>
              <td className="num">{counts['no-baseline']}</td>
              <td className="num">{counts['no-evidence']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="fine-print">
        Counts use each candidate's latest recorded stance. "No party line" means the candidate took a stance but their
        party's reference actors have no clear position to compare it with.
      </p>
    </div>
  );
}

function DomainSection({ domainId }) {
  const questions = questionsInDomain(domainId);
  return (
    <section className={`domain-section ${domainId}`}>
      <h3 className={`domain-heading ${domainId}`}>{domains[domainId].label}</h3>
      <p className="section-note">{domains[domainId].description}</p>

      <h4>Party lines</h4>
      <div className="table-wrap">
        <table className="data-table party-lines">
          <thead>
            <tr>
              <th scope="col">Question</th>
              {PARTIES.map((p) => <th scope="col" key={p}>{p} line</th>)}
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <th scope="row">{q.label}<div className="q-text">{q.question}</div></th>
                {PARTIES.map((p) => <td key={p}><PartyLineCell party={p} questionId={q.id} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>Where: each candidate against their party line</h4>
      <p className="section-note">
        Each cell separates what the candidate <strong>said</strong> from what they <strong>proposed</strong> (bills,
        moratoriums, plans, official actions), showing their latest stance in each.
      </p>
      <DeviationMatrix domainId={domainId} rows={allCandidates()} />

      <h4>When: timeline</h4>
      <DeviationTimeline domainId={domainId} />
    </section>
  );
}

function AnalysisPage() {
  return (
    <div className="page analysis-page">
      <header className="page-head">
        <h2>Policy analysis: deviation from the party line</h2>
        <p>
          Where and when candidates in the four tracked races depart from their party's line, in the two policy areas
          this project studies: <strong>data centers</strong> and <strong>everything else in AI</strong>. Within each
          area, what candidates <strong>say</strong> is kept apart from what they <strong>propose</strong>.
        </p>
        <div className="definition-grid">
          {PARTIES.map((p) => (
            <div key={p} className="definition">
              <span className="label">{p} line</span>
              <p>{referenceActors(p)}</p>
            </div>
          ))}
        </div>
        <div className="warning-panel" role="note">
          Party lines are an <strong>editorial judgment</strong> built from the evidence listed. Deviation results are
          <strong> model-generated analysis</strong>: an AI model coded every stance from web search summaries, and no
          person has reviewed them yet. Every record cites its source with Low confidence until it is checked. As of{' '}
          {partyLines.asOf}.
        </div>
      </header>

      <section>
        <h3>Where deviation exists</h3>
        <WhereSummary />
      </section>

      <DomainSection domainId="data-centers" />
      <DomainSection domainId="ai-general" />
    </div>
  );
}

export default AnalysisPage;
