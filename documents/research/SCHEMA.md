# Output format for race research (write valid JSON)

{
  "asOf": "2026-11-27",
  "races": [
    {
      "raceId": "fl-governor-2026",            // <state>-<senate|governor>-2026 (Ohio/Florida Senate specials: oh-senate-2026, fl-senate-2026)
      "state": "FL", "office": "Governor" | "U.S. Senate", "seatType": "regular" | "special",
      "seat": {"type": "open" | "incumbent", "note": "one sentence: who held it, why open, special-election context"},
      "nomineesSource": "how the nominees were chosen (primary date) with a source",
      "candidates": [{"id": "first-last", "name": "Full Name", "party": "Democratic" | "Republican" | "Independent" | "Libertarian" ..., "incumbent": true|false}],
      "result": {
        "winner": "Full Name", "call": "who called it and when (e.g. 'Called by AP on election night')",
        "candidates": [{"name": "...", "party": "...", "votePct": 50.9, "votes": 123456 or null}],
        "figuresAsOf": "where and when the figures were taken (e.g. 'Unofficial results from the Florida Division of Elections, Nov. 5, 2026')",
        "source": {"title": "...", "url": "..."}, "additionalSources": [{"title": "...", "url": "..."}],
        "certification": {"status": "certified" | "canvass-complete" | "pending", "by": "body or null", "date": "YYYY-MM-DD or null", "expected": "date/text or null", "source": {"title": "...", "url": "..."} or null}
      },
      "statements": [
        {
          "candidateId": "first-last",
          "date": "YYYY-MM-DD" or "YYYY-MM",
          "kind": "statement" | "position" | "action",      // action = a vote, bill sponsored, executive act
          "track": "said" | "proposed",                     // proposed = a concrete plan, bill or action; said = rhetoric or principle
          "domain": "data-centers" | "ai-general",
          "text": "1-2 neutral sentences in your own words. Put only words the source shows verbatim in quotation marks.",
          "headline": "under 70 characters, neutral, e.g. 'Local say over data center siting'",
          "source": {"title": "Outlet: headline (date)", "url": "...", "type": "campaign" | "official" | "transcript" | "news"},
          "confirmedBy": [{"title": "...", "url": "..."}],  // other independent reports of the same fact (aim for 1-2)
          "notes": "anything uncertain"
        }
      ],
      "polls": [
        {
          "kind": "issue-priorities" | "ai-question",
          "pollster": "...", "sponsor": "... or null", "fieldStart": "YYYY-MM-DD or null", "fieldEnd": "YYYY-MM-DD or null",
          "published": "YYYY-MM-DD", "population": "likely voters | registered voters | adults", "sampleSize": 800 or null, "marginOfError": 3.5 or null,
          "question": "wording as reported",
          "issues": [{"issue": "Cost of living", "pct": 31}],   // issue-priorities: top 3-5 issues as reported
          "aiOffered": true | false | null,                      // was AI/technology among the options?
          "figures": [{"label": "...", "pct": 0}],               // ai-question: the AI or data center results
          "source": {"title": "...", "url": "..."}, "additionalSources": []
        }
      ]
    }
  ],
  "bills": [   // only for the legislation brief
    {
      "id": "fl-2026-sb484", "state": "FL", "session": "2026 session", "billNumber": "SB 484", "title": "...",
      "sponsors": [{"name": "...", "party": "Republican|Democratic", "role": "sponsor"}],
      "status": "introduced" | "in-committee" | "passed-one-chamber" | "passed-legislature" | "enacted" | "vetoed" | "failed" | "announced",
      "statusDate": "YYYY-MM-DD", "statusNote": "one sentence on what happened and when",
      "domain": "data-centers" | "ai-general",
      "summary": "1-2 neutral sentences in your own words",
      "source": {"title": "...", "url": "..."}, "confirmedBy": [{"title": "...", "url": "..."}],
      "linkedCandidateId": "first-last or null"  // if a tracked candidate sponsored or signed it
    }
  ],
  "gaps": ["facts you could not find or are unsure of"]
}

Rules: use only facts shown in search results (page fetching is blocked); never invent a name, number, date or URL; if unsure, leave it out and list it in gaps. Prefer primary sources (official, campaign, transcript) for the `source` and independent outlets for `confirmedBy`. Neutral wording; no adjectives of your own.
