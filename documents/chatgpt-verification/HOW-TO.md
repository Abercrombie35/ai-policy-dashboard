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
- batch-14.txt: the 25 bills added on Nov. 26 from the IAPP, NCSL and MultiState trackers (Michigan, Texas,
  Connecticut, California and federal).

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
| 02 | 12 | 2026-11-27 | 8 High (6 corrected, 2 verified), 4 Medium (James and Rogers rest partly on news reports, a Schumer remark reported by Reuters, California's result still unofficial). Ruffin withdrew on Nov. 22. |
| 03 | 12 | 2026-11-27 | 5 High (S. 5653 passed the Senate Nov. 19 as an amendment to H.R. 2347; GRID Act text; SB 296; Wyden's bill; Himes), 7 Medium (election results stay unofficial until certified figures are checked; Fazio's reason rests on a news report). Michigan certified Nov. 23; Connecticut completed its canvass Nov. 25. |
| 04 | 12 | 2026-11-27 | 8 High (Ruffin's resolution registered Oct. 13; Abbott's letter; CT SB 1292 expired June 4, 2025; the French simplification law; Benson; HB 5926; Michigan deepfake laws; Schumer on Nvidia), 4 Medium (James, El-Sayed's later positions, Paxton, Talarico rest on news reports). |
| 05 | 12 | 2026-11-27 | 5 High (Ratepayer Protection Act corrected to H.R. 9340, cloture failed 57-43 Sept. 30; SB 1047 veto; SB 7; AB 1331; AB 1577), 5 Medium (SB 243 corrected: New York acted first; SB 53 and SB 243 effective dates, AB 1064 and SB 57 details, Jeffries on data centers rest on news), 2 Low (AB 1883 neural-data limits unchecked; the Jeffries preemption quote is not in the article it cited). |
| 06 | 12 | 2026-11-27 | 3 High (SB 887; SB 947; Lamont's State of the State quote, now cited to the official transcript), 5 Medium (Fazio corrected to his quoted words; SB 1000 details; Becerra's release date; Lamont's SB 5 provisions and "no place" remarks rest on news or a law-firm summary), 4 Low (AB 2383 cost list and Lamont's 2024 veto threat partly confirmed; Hilton's AI plan and Lamont's 2025 federal-role remark could not be opened). |
| 07 | 12 | 2026-11-27 | 4 High (Himes on Face the Nation; Mélenchon, now cited to his own site; El-Sayed's "AI Under Democracy"; Abbott's TRAIGA), 2 Medium (James's 2025 vote corrected: the moratorium covered state AI laws and was dropped before enactment; Rogers rests on E&E News), 6 Low (Goldstein's two claims, Philippe at VivaTech, Benson's ad, James's Aug. 1 statement partly confirmed or not found; El-Sayed's October freeze not found). |

ChatGPT's replies are kept in `results/` (one file per batch) as the record of each check, and Claude's
claim-by-claim decisions in `decisions/`. They are applied with `tools/import_chatgpt.py` (usage at the top of
that file), which bumps each record's version, records the method and level, and updates verification.json.
