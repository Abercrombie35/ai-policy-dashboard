import React from 'react';
import { pollsForRace, pollsForPlace, placeOf, publicOpinion, voterPriorities, races, isVerified } from '../lib/data';
import { useDrafts } from '../lib/drafts';
import { CheckNote, SourceList, makeSourceIndex } from './PolicyBox';
import '../styles/OpinionCharts.css';

// Charts follow one method: the job decides the form. Voter priorities are
// "one item is the point, the rest are context", so AI is the single coloured
// bar and every other issue is grey. Party findings compare two series, so
// they use the two party colours with a legend. Every value is printed on its
// bar and repeated in a table view; hover and focus add a readout but never
// hold the only copy of a number.

const fmtPct = (v) => (v == null ? 'n/a' : `${Number.isInteger(v) ? v : v.toFixed(1)}%`);
const fmtDates = (p) => {
  const opts = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
  const d = (x) => (!x ? null : /^\d{4}-\d{2}-\d{2}$/.test(x) ? new Date(`${x}T12:00:00Z`).toLocaleDateString('en-US', opts) : x);
  if (!p.fieldStart && !p.fieldEnd) return 'dates not reported';
  if (!p.fieldStart || p.fieldStart === p.fieldEnd) return d(p.fieldEnd || p.fieldStart);
  return `${d(p.fieldStart)} to ${d(p.fieldEnd)}`;
};
const pollMeta = (p) =>
  [
    `${p.pollster}${p.sponsor ? ` for ${p.sponsor}` : ''}`,
    fmtDates(p),
    p.population && p.sampleSize ? `${p.sampleSize.toLocaleString('en-US')} ${p.population}` : p.population,
    p.marginOfError != null ? `margin of error ±${p.marginOfError} points` : null,
  ]
    .filter(Boolean)
    .join(' · ');
const QUESTION_TYPE = {
  single: 'Respondents picked one issue',
  'up-to-three': 'Respondents could pick up to three issues, so shares add up to more than 100%',
  'importance-rating': 'Share rating each issue as very or extremely important',
};
// Axis end: the next multiple of 10 above the largest value (at least 50), so
// short bars are not stretched across the card.
const axisMax = (values) => Math.max(50, Math.ceil(Math.max(0, ...values) / 10) * 10);

function Bar({ label, value, max, accent = false, rank, of, color }) {
  const width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
  const readout = `${label}: ${fmtPct(value)}${rank ? ` · rank ${rank} of ${of}` : ''}`;
  return (
    <div className={`bar-row ${accent ? 'is-accent' : ''}`} tabIndex={0} aria-label={readout}>
      <span className="bar-label">
        {rank ? <span className="bar-rank">{rank}.</span> : null} {label}
      </span>
      <span className="bar-track" aria-hidden="true">
        <span className="bar-fill" style={{ width, ...(color ? { background: color } : {}) }} />
        <span className="bar-value">{fmtPct(value)}</span>
      </span>
      <span className="bar-tip" role="tooltip">{readout}</span>
    </div>
  );
}

function TableView({ caption, head, rows }) {
  return (
    <details className="chart-table">
      <summary>Show as a table</summary>
      <table className="data-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>{head.map((h) => <th scope="col" key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              <th scope="row">{r[0]}</th>
              {r.slice(1).map((c, i) => <td key={i}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

// Which issues voters ranked highest, with AI (or data centers) highlighted.
// Shows the top issues (3 to 5) and, when AI was an option but ranked lower,
// adds AI as its own row with its rank.
export function IssueRankChart({ poll, refNum, refPrefix, compact = false }) {
  const ranked = [...poll.issues].sort((a, b) => b.pct - a.pct).map((x, i) => ({ ...x, rank: i + 1 }));
  const top = ranked.slice(0, compact ? 3 : 5);
  const ai = ranked.find((x) => x.ai);
  const rows = ai && !top.includes(ai) ? [...top, ai] : top;
  const max = axisMax(rows.map((r) => r.pct));
  const place = poll.state ? placeOf({ state: poll.state }) : placeOf({ country: poll.country });
  return (
    <figure className={`opinion-chart ${compact ? 'compact' : ''}`}>
      <figcaption>
        <span className="chart-title">
          What mattered most to voters{compact ? '' : `: ${place}`}
          {refNum && <sup className="policy-ref"><a href={`#${refPrefix}-${refNum}`}>[{refNum}]</a></sup>}
        </span>
        {!compact && <span className="chart-question">“{poll.question}”</span>}
        <span className="chart-meta">{pollMeta(poll)}</span>
      </figcaption>
      <div className="bars">
        {rows.map((r) => (
          <React.Fragment key={r.issue}>
            {ai && r === ai && !top.includes(ai) && <div className="bar-gap" aria-hidden="true">…</div>}
            <Bar label={r.issue} value={r.pct} max={max} accent={r.ai} rank={r.rank} of={ranked.length} />
          </React.Fragment>
        ))}
      </div>
      <p className="chart-foot">
        {ai ? (
          <>AI {ai.issue.toLowerCase() === 'ai' ? '' : `(“${ai.issue}”) `}ranked {ai.rank} of {ranked.length} issues. </>
        ) : poll.aiOffered === false ? (
          <>AI was not among the options in this poll. </>
        ) : (
          <>Only the top issues were published, so it is not known whether AI was an option. </>
        )}
        {!compact && (QUESTION_TYPE[poll.questionType] || '')}
        {!compact && '. '}
        <span className="poll-label">Poll result: context, not a prediction.</span>
        <CheckNote id={poll.id} className="check-inline" />
      </p>
      {!compact && (
        <TableView
          caption={`Issues ranked by voters, ${place}`}
          head={['Issue', 'Share', 'Rank']}
          rows={ranked.map((r) => [r.issue, fmtPct(r.pct), `${r.rank} of ${ranked.length}`])}
        />
      )}
    </figure>
  );
}

// Polls that asked directly about AI or data centers: one meter per figure,
// each against its own 0-100 track.
function AiQuestionPolls({ polls, index, refPrefix }) {
  if (polls.length === 0) return null;
  return (
    <div className="ai-question-polls">
      <h5>Polls that asked about AI or data centers</h5>
      {polls.map((p) => (
        <figure key={p.id} className="opinion-chart meter-list">
          <figcaption>
            <span className="chart-question">
              “{p.question}”
              <sup className="policy-ref"><a href={`#${refPrefix}-${index.numberOf(p)}`}>[{index.numberOf(p)}]</a></sup>
            </span>
            <span className="chart-meta">{pollMeta(p)}</span>
          </figcaption>
          <div className="bars">
            {p.figures.map((f) => <Bar key={f.label} label={f.label} value={f.pct} max={100} accent />)}
          </div>
          <p className="chart-foot">
            <span className="poll-label">Poll result: context, not a prediction.</span>
            <CheckNote id={p.id} className="check-inline" />
          </p>
        </figure>
      ))}
    </div>
  );
}

const visible = (polls, includeDrafts) => polls.filter((p) => includeDrafts || isVerified(p));

// Race page section: the state's (or country's) issue ranking and any AI
// question, or a plain statement that no published poll asked.
export function VoterPriorities({ race }) {
  const { includeDrafts } = useDrafts();
  const polls = visible(pollsForRace(race), includeDrafts);
  const issuePolls = polls.filter((p) => p.kind === 'issue-priorities');
  const aiPolls = polls.filter((p) => p.kind === 'ai-question');
  const index = makeSourceIndex(polls);
  const refPrefix = `src-vp-${race.id}`;
  const place = placeOf(race);
  return (
    <section className="voter-priorities">
      <h3>How much AI mattered to voters</h3>
      <p className="section-note">
        Published polls of {place} voters on the issues that mattered most to their vote
        {race.state && race.office.startsWith('U.S. House') ? ' (statewide polls; no district poll was found)' : ''}. AI is
        highlighted; other issues are grey.
      </p>
      {issuePolls.length === 0 && aiPolls.length === 0 && (
        <p className="empty-note">No published poll asked {place} voters about their priorities or about AI as of {voterPriorities.asOf}.</p>
      )}
      <div className="chart-grid">
        {issuePolls.map((p) => (
          <IssueRankChart key={p.id} poll={p} refNum={index.numberOf(p)} refPrefix={refPrefix} />
        ))}
      </div>
      {issuePolls.length > 0 && issuePolls.every((p) => !p.issues.some((x) => x.ai)) && aiPolls.length === 0 && (
        <p className="empty-note">No published poll asked {place} voters about AI or data centers as of {voterPriorities.asOf}.</p>
      )}
      <AiQuestionPolls polls={aiPolls} index={index} refPrefix={refPrefix} />
      <SourceList index={index} refPrefix={refPrefix} />
    </section>
  );
}

// Compact version for the state and country pop-ups.
export function PlaceVoterPriorities({ state, country }) {
  const { includeDrafts } = useDrafts();
  const polls = visible(pollsForPlace({ state, country }), includeDrafts);
  const issuePoll = polls.find((p) => p.kind === 'issue-priorities');
  const aiPolls = polls.filter((p) => p.kind === 'ai-question');
  if (!issuePoll && aiPolls.length === 0) return null;
  return (
    <section className="state-section voter-priorities compact">
      <h3>How much AI mattered to voters</h3>
      {issuePoll && <IssueRankChart poll={issuePoll} compact />}
      {aiPolls.length > 0 && (
        <p className="chart-foot">
          {aiPolls.length} poll{aiPolls.length > 1 ? 's' : ''} asked about AI or data centers directly; see each race page.
        </p>
      )}
    </section>
  );
}

// Policy analysis page: where AI ranked in each race's issue poll.
export function AiRankSummary() {
  const { includeDrafts } = useDrafts();
  const rows = races.map((race) => {
    const polls = visible(pollsForRace(race), includeDrafts);
    const issuePoll = polls.find((p) => p.kind === 'issue-priorities');
    const ranked = issuePoll ? [...issuePoll.issues].sort((a, b) => b.pct - a.pct) : [];
    const ai = ranked.find((x) => x.ai);
    const aiAsked = polls.some((p) => p.kind === 'ai-question');
    return { race, issuePoll, ai, rank: ai ? ranked.indexOf(ai) + 1 : null, of: ranked.length, top: ranked[0], aiAsked };
  });
  const max = axisMax(rows.filter((r) => r.ai).map((r) => r.ai.pct));
  return (
    <section className="voter-priorities summary">
      <h3>Where AI ranked for voters, race by race</h3>
      <p className="section-note">
        From each race's issue poll (details and sources on the race pages). A bar means AI or data centers was an option and
        shows its share; otherwise the row says what the poll found instead.
      </p>
      <div className="bars">
        {rows.map(({ race, issuePoll, ai, rank, of, top, aiAsked }) => {
          const label = `${placeOf(race)}: ${race.office}`;
          if (ai) return <Bar key={race.id} label={label} value={ai.pct} max={max} accent rank={null} />;
          return (
            <div key={race.id} className="bar-row no-bar" tabIndex={0}>
              <span className="bar-label">{label}</span>
              <span className="bar-none">
                {issuePoll
                  ? `${issuePoll.aiOffered === false ? 'AI not an option' : 'AI not among the published top issues'}; top issue: ${top.issue} (${fmtPct(top.pct)})`
                  : 'No published issue poll found'}
                {aiAsked ? '; a separate poll asked about AI' : ''}
              </span>
            </div>
          );
        })}
      </div>
      <TableView
        caption="Where AI ranked for voters in each race"
        head={['Race', 'AI share', 'AI rank', 'Top issue']}
        rows={rows.map(({ race, ai, rank, of, top }) => [
          `${placeOf(race)}: ${race.office}`,
          ai ? fmtPct(ai.pct) : 'not shown in the poll',
          ai ? `${rank} of ${of}` : '-',
          top ? `${top.issue} (${fmtPct(top.pct)})` : 'no poll',
        ])}
      />
    </section>
  );
}

// Party comparison page: Gallup and Pew findings by party.
const PARTY_COLORS = { Democratic: 'var(--research-dem, #245f9f)', Republican: 'var(--research-rep, #a33d38)' };
const PARTY_NAMES = { Democratic: 'Democrats', Republican: 'Republicans' };

export function PartyOpinion() {
  const { includeDrafts } = useDrafts();
  const findings = publicOpinion.findings.filter((f) => includeDrafts || isVerified(f));
  if (findings.length === 0) return null;
  const index = makeSourceIndex(findings);
  const refPrefix = 'src-opinion';
  return (
    <section className="party-opinion">
      <h3>What each party's voters think about AI</h3>
      <p className="section-note">
        Published Gallup and Pew Research Center findings, by party, to set beside the party lines. National surveys of
        U.S. adults, not of any one race. Figures are cited from each organisation's published report (linked below);
        the charts are drawn by this project. Party groups include independents who lean to a party where the source says so.
      </p>
      <ul className="chart-legend" aria-label="Legend">
        {Object.entries(PARTY_NAMES).map(([p, n]) => (
          <li key={p}><span className="legend-key" style={{ background: PARTY_COLORS[p] }} aria-hidden="true" />{n}</li>
        ))}
      </ul>
      <div className="chart-grid">
        {findings.map((f) => (
          <figure key={f.id} className="opinion-chart">
            <figcaption>
              <span className="chart-title">
                {f.measure}
                <sup className="policy-ref"><a href={`#${refPrefix}-${index.numberOf(f)}`}>[{index.numberOf(f)}]</a></sup>
              </span>
              <span className="chart-meta">
                {f.org === 'Pew' ? 'Pew Research Center' : 'Gallup'}
                {f.publishedDate ? ` · published ${fmtDates({ fieldEnd: f.publishedDate })}` : ''}
                {f.fieldStart || f.fieldEnd ? ` · fielded ${fmtDates(f)}` : ''}
                {f.sampleSize ? ` · ${f.sampleSize.toLocaleString('en-US')} ${f.population || 'adults'}` : ''}
                {f.marginOfError != null ? ` · ±${f.marginOfError} points` : ''}
              </span>
            </figcaption>
            <div className="bars">
              {Object.keys(PARTY_NAMES).map((p) =>
                f.byParty?.[p] != null ? (
                  <Bar key={p} label={PARTY_NAMES[p]} value={f.byParty[p]} max={100} color={PARTY_COLORS[p]} />
                ) : null,
              )}
            </div>
            <p className="chart-foot">
              {f.overall != null && <>All adults: {fmtPct(f.overall)}. </>}
              {f.byParty?.Independent != null && <>Independents: {fmtPct(f.byParty.Independent)}. </>}
              {f.partyNote ? `${f.partyNote}. ` : ''}
              <CheckNote id={f.id} className="check-inline" />
            </p>
            <details className="chart-table">
              <summary>Question wording and table</summary>
              <p className="chart-question">“{f.question}”</p>
              <table className="data-table">
                <thead><tr><th scope="col">Group</th><th scope="col">Share</th></tr></thead>
                <tbody>
                  {f.overall != null && <tr><th scope="row">All adults</th><td>{fmtPct(f.overall)}</td></tr>}
                  {Object.entries(f.byParty || {}).filter(([, v]) => v != null).map(([p, v]) => (
                    <tr key={p}><th scope="row">{PARTY_NAMES[p] || 'Independents'}</th><td>{fmtPct(v)}</td></tr>
                  ))}
                </tbody>
              </table>
            </details>
          </figure>
        ))}
      </div>
      <SourceList index={index} refPrefix={refPrefix} />
    </section>
  );
}
