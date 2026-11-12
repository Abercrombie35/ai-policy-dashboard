import React from 'react';
import { codebook, dimensions, resultLabel, domains, categoryLabel, partyLines } from '../lib/data';

const REPO_ISSUES = 'https://github.com/Abercrombie35/ai-policy-dashboard/issues';

function MethodsView() {
  return (
    <div className="page methods">
      <header className="page-head">
        <h2>Methodology</h2>
        <p>
          How records are sourced, labeled, coded and corrected. The dashboard is the transparent version of the
          research dataset: every finding should trace back to its sources.
        </p>
      </header>

      <section>
        <h3>Labels on every record</h3>
        <p>Each record has exactly one of these six types, and also carries a source, publication date, last-verified date and confidence level.</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Type</th><th scope="col">Meaning</th></tr></thead>
            <tbody>
              {codebook.labelTypes.map((t) => (
                <tr key={t.id}><th scope="row">{t.label}</th><td>{t.description}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Confidence and verification</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Level</th><th scope="col">Meaning</th></tr></thead>
            <tbody>
              {codebook.confidenceLevels.map((c) => (
                <tr key={c.id}><th scope="row">{c.label}</th><td>{c.description}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul>
          <li>A record counts as verified only once it has a source link and a last-verified date. This is checked automatically.</li>
          <li>Records are versioned and never silently overwritten. Every change raises the version number and adds a dated note to the record's history.</li>
          <li>Sparse coverage is recorded as sparse rather than filled in by inference. It is itself evidence of how salient AI is in a race.</li>
        </ul>
      </section>

      <section>
        <h3>Two policy areas, and said vs. proposed</h3>
        <p>
          The project studies two policy areas separately: <strong>{domains['data-centers'].label}</strong> and{' '}
          <strong>{domains['ai-general'].label}</strong>. A record belongs to an area through its coded issue areas and
          stances, and can belong to both. Within each area, what is <strong>said</strong> is kept apart from what is{' '}
          <strong>proposed</strong>, using the codebook's specificity coding:
        </p>
        <ul>
          {codebook.tracks.map((t) => (
            <li key={t.id}>
              <strong>{t.label}:</strong> {t.description} (specificity:{' '}
              {t.specificity.map((sp) => categoryLabel('specificity', sp)).join(', ')})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Party lines and deviation</h3>
        <ul>
          {partyLines.parties.map((p) => (
            <li key={p.party}><strong>{p.party} line:</strong> {p.referenceActors}.</li>
          ))}
          <li>Leaders not yet elected or sworn in are treated as leaders.</li>
          <li>
            Each line is an editorial judgment built from the listed evidence on six directional policy questions. Where
            the reference actors have no clear position, there is no line, and deviation is not judged.
          </li>
          <li>
            A candidate deviates on a question when their stance differs from their party's line. The analysis uses the
            latest stance in each of "said" and "proposed", and flags candidates whose stance shifted over time.
          </li>
          <li>
            Stances were coded by an AI model from web search summaries and have not been reviewed. Results are
            model-generated analysis, not findings.
          </li>
        </ul>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Policy question</th><th scope="col">Stances (ordered)</th></tr></thead>
            <tbody>
              {codebook.policyQuestions.map((q) => (
                <tr key={q.id}>
                  <th scope="row">{q.label}<div className="q-text">{q.question}</div></th>
                  <td>{q.options.map((o) => o.label).join(' / ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Election results: a separate label</h3>
        <p>
          Results carry their own label, "{resultLabel.label}", and are stored apart from candidate statements, so a
          vote count is never confused with a position. {resultLabel.description}
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Result status</th><th scope="col">Meaning</th></tr></thead>
            <tbody>
              {codebook.resultStatuses.map((s) => (
                <tr key={s.id}><th scope="row">{s.label}</th><td>{s.description}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Every result records when and where its figures were taken. When a state certifies its canvass, the result
          gets a new version with status "Certified" and the official source. Unofficial figures are never silently
          replaced.
        </p>
      </section>

      <section>
        <h3>Codebook ({codebook.version})</h3>
        <p>{codebook.status}</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Dimension</th><th scope="col">Categories</th></tr></thead>
            <tbody>
              {dimensions.map((d) => (
                <tr key={d.id}>
                  <th scope="row">{d.label}{d.multi ? ' (can be several)' : ''}</th>
                  <td>{d.categories.map((c) => c.label).join(' / ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Neutrality</h3>
        <ul>
          <li>Symmetric treatment: all candidates and parties get the same fields, coding rules and questionnaire.</li>
          <li>No hidden evaluations: no position is labeled better than another without disclosed criteria.</li>
          <li>Questionnaires have a fixed deadline. Non-response is shown as "No response received as of [date]".</li>
          <li>Polling and prediction markets are secondary context, labeled as forecasts rather than facts.</li>
          <li>Projections are conditional, carry confidence labels and state their assumptions.</li>
          <li>International statements are coded from the original language, and translations are noted.</li>
        </ul>
      </section>

      <section>
        <h3>Corrections and right of reply</h3>
        <p>
          To report an error or reply on behalf of a candidate, open an issue on the project's{' '}
          <a href={REPO_ISSUES} target="_blank" rel="noopener noreferrer">GitHub issue tracker</a>. Corrections are made as
          new record versions, so the change history stays visible.
        </p>
      </section>

      <section>
        <h3>Sources for legislation</h3>
        <p>
          Bill data comes from official state legislature websites or open legislative-data services. Trackers such as
          IAPP's US State AI Governance Legislation Tracker, NCSL's Artificial Intelligence Legislation Database and
          MultiState's AI legislation tracker are used to check coverage, not as data to copy. Their licensing terms are
          checked before any reuse.
        </p>
      </section>

      <section>
        <h3>Privacy</h3>
        <p>
          This site sets no cookies and runs no analytics. Your choice to show drafts is kept only in this browser
          tab's session storage. Any future user survey would be a separate, consent-based module subject to IRB review.
        </p>
      </section>
    </div>
  );
}

export default MethodsView;
