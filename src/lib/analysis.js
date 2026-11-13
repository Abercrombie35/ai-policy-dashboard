// Party-line deviation analysis. Each candidate record can carry stances on the
// codebook's policy questions; each stance is compared with the candidate's
// party line for that question. This is model-generated analysis built on
// AI-coded stances, and the UI labels it that way.
import { races, partyLines, policyQuestions, itemsForRace, filterDrafts, trackOf, codebook } from './data';

export const STATUS = {
  aligned: { label: 'Aligned', icon: '✓', description: 'Same stance as the party line.' },
  deviates: { label: 'Deviates', icon: '✗', description: 'Different stance from the party line.' },
  'no-baseline': { label: 'No party line', icon: '·', description: 'The party has no clear line on this question, so deviation cannot be judged.' },
  'no-evidence': { label: 'No evidence', icon: '–', description: 'No record of the candidate taking a stance on this question.' },
};

export const partyLine = (party, questionId) =>
  partyLines.positions.find((p) => p.party === party && p.questionId === questionId) || null;

export const referenceActors = (party) => partyLines.parties.find((p) => p.party === party)?.referenceActors;

export function compareStance(party, questionId, stance) {
  const line = partyLine(party, questionId);
  if (!line || line.stance == null) return 'no-baseline';
  return stance === line.stance ? 'aligned' : 'deviates';
}

// Records sort by publication date; undated records use an approximate
// sortDate (shown to readers through their dateNote). Partial dates such as
// "2026-08" sort by their prefix.
const sortKey = (rec) => rec.publishedDate || rec.sortDate || '';
const byDate = (a, b) => sortKey(a.record).localeCompare(sortKey(b.record));

export function stanceEntries(race, candidate, questionId, includeDrafts) {
  return filterDrafts(itemsForRace(race), includeDrafts)
    .filter((r) => r.candidateId === candidate.id && r.stances?.[questionId])
    .map((record) => ({
      record,
      race,
      candidate,
      questionId,
      stance: record.stances[questionId],
      track: trackOf(record),
      status: compareStance(candidate.party, questionId, record.stances[questionId]),
    }))
    .sort(byDate);
}

// One cell of the deviation matrix: a candidate on one question, split into
// what they said and what they proposed, with the latest stance in each.
export function deviationCell(race, candidate, questionId, includeDrafts) {
  const entries = stanceEntries(race, candidate, questionId, includeDrafts);
  const byTrack = {};
  for (const t of codebook.tracks.map((x) => x.id)) {
    const list = entries.filter((e) => e.track === t);
    byTrack[t] = list.length ? list[list.length - 1] : null;
  }
  const latest = entries[entries.length - 1] || null;
  return {
    entries,
    byTrack,
    latest,
    status: latest ? latest.status : 'no-evidence',
    // The candidate's stance on this question changed over time.
    shifted: new Set(entries.map((e) => e.stance)).size > 1,
    line: partyLine(candidate.party, questionId),
  };
}

export const allCandidates = () => races.flatMap((race) => (race.candidates || []).map((candidate) => ({ race, candidate })));

export const questionsInDomain = (domainId) => {
  const ids = codebook.domains.find((d) => d.id === domainId)?.policyQuestions || [];
  return policyQuestions.filter((q) => ids.includes(q.id));
};

// Every stance entry in a policy area, in date order, for the "when" view.
export function timeline(domainId, includeDrafts) {
  const qs = questionsInDomain(domainId).map((q) => q.id);
  const out = [];
  for (const { race, candidate } of allCandidates()) {
    for (const q of qs) out.push(...stanceEntries(race, candidate, q, includeDrafts));
  }
  return out.sort(byDate);
}

// Where deviation exists: per question, how many candidates currently align,
// deviate or have no evidence.
export function deviationSummary(includeDrafts) {
  return policyQuestions.map((q) => {
    const counts = { aligned: 0, deviates: 0, 'no-baseline': 0, 'no-evidence': 0, shifted: 0 };
    for (const { race, candidate } of allCandidates()) {
      const c = deviationCell(race, candidate, q.id, includeDrafts);
      counts[c.status] += 1;
      if (c.shifted) counts.shifted += 1;
    }
    return { question: q, counts };
  });
}
