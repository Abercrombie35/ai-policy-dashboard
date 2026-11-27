# Archiving campaign pages (AIPD-101)

Campaign sites start disappearing after an election. Every page a candidate record cites, and each candidate's
campaign homepage and AI, technology or data center issue pages, should have an archived copy with a capture date,
so the source can still be read after the original is gone.

This project's build environment cannot reach the Wayback Machine, so the capture runs on your own computer.

## Steps

1. Download this folder (`archive_pages.py` and `urls.csv`).
2. On your computer, in that folder, run:

   ```
   python3 archive_pages.py
   ```

   For each page it reuses a Wayback Machine snapshot taken on or after Nov. 3, 2026, or asks Save Page Now to take
   one. Results go into `archived.csv` as it works; you can stop it (Ctrl+C) and run it again later.
3. Send `archived.csv` back to Claude (paste it, or commit it into this folder). It is imported with
   `python3 tools/import_archives.py . documents/archive/archived.csv`, which adds the copies to
   `src/data/archives.json`. Each source on the site then shows an "archived copy" link next to it.

Pages the script cannot archive are listed at the end of its output. You can save them by hand at
https://web.archive.org/save and add a line to `archived.csv`: the original URL, the snapshot link
(`https://web.archive.org/web/<timestamp>/<url>`), the capture date (YYYY-MM-DD) and `wayback`.

## Files

- `urls.csv`: the pages to archive. It is rebuilt from the data by `python3 tools/import_archives.py .`.
  - `kind` is `cited-source` (a page a record cites) or `campaign-page` (a campaign homepage or issue page).
  - `already_archived` marks pages done.
- `campaign-pages.json`: each candidate's official campaign homepage and issue pages, found through web search
  on Nov. 27, 2026. Candidates with no official page found say so.
- `archive_pages.py`: the capture script. It needs Python 3.8 or later and no extra packages.

The validator warns, without failing the build, while any candidate record cites a page with no archived copy.
