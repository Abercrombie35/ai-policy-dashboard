# Coding review and reliability (AIPD-202, AIPD-203)

Every record's coding was drafted by an AI model and has not yet been reviewed by a person. These two steps make the
dataset defensible.

## 1. Human review of every code (AIPD-202)

1. Open `review-sheet.csv` in a spreadsheet. There is one row per coded record or bill (184 items as of Nov. 27, 2026).
2. For each item:
   - **To change a code:** read the text and source, then put your code in the matching `reviewed_` column. The AI's
     code is in the `ai_` column beside it. Use the ids in `codebook-reference.md`, and separate several values with
     semicolons.
   - **To accept a code:** leave the `reviewed_` cell blank.
3. Put your initials and the date on every row you have reviewed. Rows without initials are skipped, so you can work
   in stages.
4. Save it as CSV in this folder and run:

   ```
   python3 tools/coding_review.py import documents/coding-review/review-sheet.csv
   ```

   Each reviewed item gets a new version with a history note, `reviewed: true` and your initials. Every change you make
   to an AI code is logged in `disagreements.csv`. Values not in the codebook stop the import.

## 2. Inter-coder reliability (AIPD-203)

1. Do the review first: the reliability test checks the reviewed scheme.
2. `reliability-sheet.csv` is the sample: 37 of the 184 items (20%), drawn across every race and the bills, with no
   codes shown. Two coders each fill in their own copy, independently.
3. Run:

   ```
   python3 tools/coding_review.py alpha coder1.csv coder2.csv
   ```

   This computes Krippendorff's alpha for each dimension, nominal. Multi-valued dimensions count one present/absent
   decision per category. The results are written to `reliability-results.json` and appear in the methods appendix
   (`npm run appendix`).
4. Revise the codebook rules where alpha is below 0.667, record the changes in `documents/codebook/CHANGELOG.md` and
   freeze the codebook as 1.0 (AIPD-204).

To redraw the sample, or after new races are added, run:

```
python3 tools/coding_review.py sample --share 0.2 --seed 2026
```

Re-run `export` too, so the review sheet includes the new items. The alpha code reproduces the worked example in
Krippendorff, *Computing Krippendorff's Alpha-Reliability* (2011): alpha = 0.743.
