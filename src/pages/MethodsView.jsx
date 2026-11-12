import React from 'react';
import { codebook, dimensions } from '../lib/data';

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
