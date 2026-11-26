# Verifying claims in ChatGPT

Claude cannot open the source sites from its cloud environment (government, legislature, news and tracker sites
are blocked by the network settings), so these 138 claims still need checking against their primary sources.
The 42 Michigan Senate prototype drafts are left out until you decide what to do with them (story AIPD-104).

Files (in this folder):
- verify-list.csv: every claim, the batch it is in, what we have found so far, and what is still unconfirmed.
- batch-01.txt ... batch-12.txt: each is one complete ChatGPT message (instructions plus 12 claims).
  Batches 1-3 hold the claims that are partly confirmed or not confirmed (do these first), batches 4-5 the
  corrected ones, batches 6-12 the confirmed ones (to raise them to High confidence).
- batch-13.txt: the 21 poll and survey figures added on Nov. 26 (voter priorities per race, polls on AI and
  data centers, Gallup and Pew by party). For polls, the primary source is the pollster's own release or topline.

Steps:
1. In ChatGPT, use a model with web search turned on (Search, or Deep research for the hardest batches).
2. Paste the whole content of one batch file as a new message. One batch per chat keeps answers accurate.
3. ChatGPT replies with one JSON code block. Copy it.
4. Paste it here in this Claude session, saying which batch it is (e.g. "batch 01 results:" then the JSON).
   Several batches can be pasted in one message.

What Claude does with your results:
- Checks the reply format, that every id exists, and that every verified or contradicted claim has a URL.
- "verified" with an official, campaign, transcript or election-office source, a verbatim quote and a date:
  High confidence. Verified from a news report only: Medium.
- "contradicted": the record is corrected, with a new version and a note.
- "partly-verified" or "not-found": stays Low, with the tiny note on the site.
- Every change records the method: "checked against the primary source with ChatGPT (web browsing), relayed by
  the project owner on [date]", so readers can see how each claim was verified.

## Progress

| Batch | Claims | Relayed | Result |
|---|---|---|---|
| 01 | 12 | 2026-11-26 | 8 High (7 corrected to match the primary source, 1 verified), 4 Medium (2 dates unconfirmed, 2 resting partly on news reports) |

ChatGPT's replies are kept in `results/` (one file per batch) as the record of each check, and Claude's
claim-by-claim decisions in `decisions/`. They are applied with `tools/import_chatgpt.py` (usage at the top of
that file), which bumps each record's version, records the method and level, and updates verification.json.
