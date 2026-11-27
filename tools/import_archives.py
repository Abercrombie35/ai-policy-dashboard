"""Import archived copies of cited pages (AIPD-101) and refresh the list of pages to archive.

usage (from the repository root):
  python3 tools/import_archives.py .            # rebuild documents/archive/urls.csv only
  python3 tools/import_archives.py . archived.csv  # also merge captured copies into src/data/archives.json

urls.csv lists every page a candidate record cites plus each candidate's campaign homepage and issue pages
(documents/archive/campaign-pages.json). archived.csv is written by documents/archive/archive_pages.py, which the
project owner runs on their own computer because this environment cannot reach the Wayback Machine.
"""
import csv
import json
import re
import sys

REPO = sys.argv[1]
D = f'{REPO}/src/data/'
A = f'{REPO}/documents/archive/'
SNAPSHOT = re.compile(r'^https://(web\.archive\.org/web/\d{8,14}|perma\.cc/|archive\.(ph|today|is)/)')

records = json.load(open(D + 'candidate-research.json'))['records']
archives = json.load(open(D + 'archives.json'))
campaign = json.load(open(A + 'campaign-pages.json'))['candidates']

pages = {}  # url -> row
for r in records:
    url = r.get('source', {}).get('url')
    if not url or url.startswith('https://web.archive.org/web/'):
        continue
    row = pages.setdefault(url, {'url': url, 'kind': 'cited-source', 'candidate_id': r['candidateId'], 'record_ids': []})
    row['record_ids'].append(r['id'])
for c in campaign:
    for url, title in [(c.get('homepage'), 'homepage')] + [(p['url'], p.get('title', '')) for p in c.get('issuePages', [])]:
        if url and url not in pages:
            pages[url] = {'url': url, 'kind': 'campaign-page', 'candidate_id': c['candidateId'], 'record_ids': []}

if len(sys.argv) > 2:
    have = {a['url']: a for a in archives['pages']}
    added = 0
    with open(sys.argv[2], newline='') as f:
        for row in csv.DictReader(f):
            url, snap, day = row['url'].strip(), row['archive_url'].strip(), row['captured_on'].strip()
            if not SNAPSHOT.match(snap) or not re.match(r'^\d{4}-\d{2}-\d{2}$', day):
                print('skipped (not a snapshot link or date):', url)
                continue
            meta = pages.get(url, {})
            entry = {'url': url, 'archiveUrl': snap, 'capturedOn': day, 'service': row.get('service') or 'wayback',
                     'kind': meta.get('kind', 'cited-source'), 'candidateId': meta.get('candidate_id')}
            if url not in have:
                added += 1
            have[url] = entry
    archives['pages'] = sorted(have.values(), key=lambda a: (a.get('candidateId') or '', a['url']))
    with open(D + 'archives.json', 'w') as f:
        json.dump(archives, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print(f'archives.json: {added} added, {len(have)} in total')

archived = {a['url'] for a in archives['pages']}
with open(A + 'urls.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['url', 'kind', 'candidate_id', 'record_ids', 'already_archived'])
    for row in sorted(pages.values(), key=lambda r: (r['candidate_id'], r['kind'], r['url'])):
        w.writerow([row['url'], row['kind'], row['candidate_id'], ' '.join(row['record_ids']), 'yes' if row['url'] in archived else 'no'])
todo = sum(1 for u in pages if u not in archived)
print(f'urls.csv: {len(pages)} pages ({sum(1 for p in pages.values() if p["kind"] == "campaign-page")} campaign pages), {todo} still to archive')
