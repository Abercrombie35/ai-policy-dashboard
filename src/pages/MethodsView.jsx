import React from 'react';
import { codebook, dimensions, resultLabel, domains, categoryLabel, partyLines, verification, CHECK_RESULTS, blocs, BLOC_IDS, results, raceById, placeOf, resultStatuses, certificationStatuses, certificationText } from '../lib/data';

// How many checks ended in each result.
const checkCounts = () => {
  const counts = {};
  for (const c of Object.values(verification.checks)) counts[c.result] = (counts[c.result] || 0) + 1;
  return counts;
};

const REPO_ISSUES = 'https://github.com/Abercrombie35/ai-policy-dashboard/issues';
const APPENDIX = 'https://github.com/Abercrombie35/ai-policy-dashboard/blob/main/documents/methods-appendix.md';

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
        <div className="table-wrap" role="region" aria-label="Record type definitions" tabIndex={0}>
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
        <div className="table-wrap" role="region" aria-label="Confidence level definitions" tabIndex={0}>
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
        <h4>How each claim was checked ({verification.checkedOn})</h4>
        <p>{verification.method}</p>
        {verification.relays?.length > 0 && (
          <p>
            Primary-source checks relayed so far: {verification.relays.map((r) => `batch ${r.batch} (${r.claims} claims, ${r.date})`).join(', ')}.{' '}
            {Object.values(verification.checks).filter((c) => c.method === 'chatgpt-primary-source').length} claims checked this way; see
            the files in the project's documents/chatgpt-verification folder for the prompts and replies.
          </p>
        )}
        <div className="table-wrap" role="region" aria-label="Check results" tabIndex={0}>
          <table className="data-table">
            <thead><tr><th scope="col">Result</th><th scope="col">Claims</th><th scope="col">Shown as</th><th scope="col">Meaning</th></tr></thead>
            <tbody>
              {Object.entries(CHECK_RESULTS).map(([id, r]) => (
                <tr key={id}>
                  <th scope="row">{r.label}</th>
                  <td>{checkCounts()[id] || 0}</td>
                  <td>{r.short ? <em>{r.short}</em> : 'Confirming reports listed under the sources'}</td>
                  <td>{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Every box, record and piece of party-line evidence carries its result. Claims that could not be confirmed keep a
          small note and Low confidence; hover over the note for what was and was not found. Corrections raise the record's
          version with a dated note. The stance coding and party-line judgments are analysis, not facts, and were not part
          of this check.
        </p>
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
        <h3>Proposal categories</h3>
        <p>
          Every bill and every coded candidate record (statements as well as proposals and official actions) has at least
          one category, so what is said and what is proposed can be compared category by category within each policy area,
          by party and by state. A record is counted under its first category in an area; any others are shown on it.
          Items stored in the race files are categorized through a separate lookup, so those files are not edited.
          Categories were assigned by an AI model and have not been reviewed.
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Policy area</th><th scope="col">Category</th><th scope="col">Covers</th></tr></thead>
            <tbody>
              {codebook.proposalCategories.map((c) => (
                <tr key={c.id}>
                  <td>{domains[c.domain].label}</td>
                  <th scope="row">{c.label}</th>
                  <td>{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <div className="table-wrap" role="region" aria-label="Policy question stances" tabIndex={0}>
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
        <div className="table-wrap" role="region" aria-label="Election result status definitions" tabIndex={0}>
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
        <p>
          Two-round elections, such as France's presidential election, record both rounds: the first round (with the two
          candidates who advance) and the runoff, each with its own date and vote shares. The runoff decides the winner.
        </p>
        <h4 id="certification">Certification tracker</h4>
        <p>
          Where each state's official canvass stands. Certified figures come from the state's own results table and
          are relayed by the project owner, because this project's build environment cannot open state election sites.
        </p>
        <div className="table-wrap" role="region" aria-label="Certification status of each election result" tabIndex={0}>
          <table className="data-table">
            <thead>
              <tr><th scope="col">Race</th><th scope="col">Certification</th><th scope="col">Where it stands</th><th scope="col">Figures shown</th></tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const race = raceById(r.raceId);
                return (
                  <tr key={r.id}>
                    <th scope="row">{race ? `${race.office}: ${placeOf(race)}` : r.raceId}</th>
                    <td>{certificationStatuses[r.certification?.status]?.label || 'Not recorded'}</td>
                    <td>{certificationText(r)}</td>
                    <td>{resultStatuses[r.resultStatus]?.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Voter priorities and public opinion</h3>
        <p>
          Two kinds of poll results sit beside the candidate and legislative records. They describe voters, not
          candidates, and are shown as context, not as predictions:
        </p>
        <ul>
          <li>
            <strong>How much AI mattered to voters</strong> (each race page, the state and country pop-ups, and the Policy
            analysis page): the most recent published poll in the race's state or country on which issues mattered most,
            with AI or data centers highlighted when they were an option, plus any poll that asked about AI directly. Where
            no published poll asked, the page says so; nothing is estimated. State polls stand in for the CT-4 House race
            because no district poll was found.
          </li>
          <li>
            <strong>What each party's voters think about AI</strong> (Party comparison page): Gallup and Pew Research Center
            findings broken down by party. Figures are cited with the publication date and a link, as both organisations'
            terms allow; the charts are drawn by this project and no Gallup or Pew chart is reproduced.
          </li>
        </ul>
        <p>
          Each poll records the pollster, field dates, sample, margin of error and question wording as reported, and is
          checked like every other claim. Charts highlight one bar (AI) and keep the rest grey, print every value, and have a
          table view; the party charts use the party colours with a legend.
        </p>
      </section>

      <section>
        <h3>Codebook ({codebook.version})</h3>
        <p>{codebook.status}</p>
        {(codebook.changelog || []).length > 0 && (
          <details className="codebook-changelog">
            <summary>Codebook changes since the pilot draft ({codebook.changelog.length})</summary>
            <ul>
              {codebook.changelog.map((c, i) => (
                <li key={i}><strong>{c.version}</strong>, {c.date}: {c.summary}</li>
              ))}
            </ul>
          </details>
        )}
        <div className="table-wrap" role="region" aria-label="Codebook dimensions and categories" tabIndex={0}>
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
        <h3>Methods appendix</h3>
        <p>
          A <a href={APPENDIX} target="_blank" rel="noopener noreferrer">methods appendix</a> for reviewers is generated
          from the same data as this page (<code>npm run appendix</code>). It covers the sample, labels, coding scheme,
          verification counts, certification, party lines, archived sources, reliability results (pending the
          inter-coder test) and the project's limitations.
        </p>
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
          Bills are found through IAPP's US State AI Governance Legislation Tracker, NCSL's Artificial Intelligence
          Legislation Database and MultiState's AI legislation tracker (or their reports), then confirmed on the official
          legislature record where possible. Their terms of use were checked on Nov. 26, 2026 (summarised on the
          Legislation page): none addresses citing bill facts with a link, and all restrict copying their content. So this
          site cites bill facts with attribution and links, writes its own summaries, and copies no tracker content or
          database. Each bill shows which trackers cover it, and the Legislation page compares this dataset with the
          trackers' published counts.
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
