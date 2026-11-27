"""Archive campaign pages and cited statements in the Wayback Machine (AIPD-101).

Run this on your own computer (Python 3.8+, no extra packages), from this folder:

    python3 archive_pages.py

It reads urls.csv and, for each page not yet in archived.csv:
  1. looks for an existing Wayback Machine snapshot taken on or after MIN_DATE and uses it, or
  2. asks the Wayback Machine's Save Page Now to capture the page now.
Each result is appended to archived.csv straight away, so you can stop (Ctrl+C) and run it again later; finished
pages are skipped. Save Page Now limits anonymous use, so the script waits between captures (about 20-30 minutes for
a hundred pages). When it finishes, send archived.csv back to Claude (or commit it) to be imported with
tools/import_archives.py.
"""
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
URLS = os.path.join(HERE, 'urls.csv')
OUT = os.path.join(HERE, 'archived.csv')
MIN_DATE = '20261103'  # snapshots from election day on count as current
PAUSE = 12  # seconds between Save Page Now requests
HEADERS = {'User-Agent': 'ai-policy-dashboard-archiver/1.0 (research project)'}


def get(url, timeout=90):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.geturl(), dict(r.headers), r.read()


def existing_snapshot(url):
    api = 'https://archive.org/wayback/available?' + urllib.parse.urlencode({'url': url, 'timestamp': time.strftime('%Y%m%d')})
    try:
        _, _, body = get(api, timeout=30)
        snap = json.loads(body).get('archived_snapshots', {}).get('closest')
    except Exception:
        return None
    if snap and snap.get('available') and snap.get('timestamp', '') >= MIN_DATE:
        return snap['url'].replace('http://', 'https://', 1), snap['timestamp']
    return None


def save_now(url):
    final, headers, _ = get('https://web.archive.org/save/' + url, timeout=180)
    loc = headers.get('Content-Location') or headers.get('content-location') or ''
    target = final if '/web/' in final else ('https://web.archive.org' + loc if loc.startswith('/web/') else '')
    if '/web/' not in target:
        return None
    ts = target.split('/web/')[1].split('/')[0][:14]
    return target, ts


def main():
    done = set()
    if os.path.exists(OUT):
        with open(OUT, newline='') as f:
            done = {row['url'] for row in csv.DictReader(f)}
    with open(URLS, newline='') as f:
        todo = [row for row in csv.DictReader(f) if row['url'] not in done and row.get('already_archived') != 'yes']
    print(f'{len(todo)} pages to archive ({len(done)} already in archived.csv).')
    new_file = not os.path.exists(OUT)
    with open(OUT, 'a', newline='') as f:
        w = csv.writer(f)
        if new_file:
            w.writerow(['url', 'archive_url', 'captured_on', 'service', 'how'])
        for i, row in enumerate(todo, 1):
            url = row['url']
            found, how = existing_snapshot(url), 'existing snapshot'
            if not found:
                how = 'saved now'
                for attempt in range(3):
                    try:
                        found = save_now(url)
                        break
                    except urllib.error.HTTPError as e:
                        wait = 60 * (attempt + 1) if e.code in (429, 502, 503, 520, 523) else 0
                        print(f'  {url}: HTTP {e.code}' + (f', retrying in {wait}s' if wait else ''))
                        if not wait:
                            break
                        time.sleep(wait)
                    except Exception as e:
                        print(f'  {url}: {e}')
                        break
                time.sleep(PAUSE)
            if found:
                snap, ts = found
                w.writerow([url, snap, f'{ts[:4]}-{ts[4:6]}-{ts[6:8]}', 'wayback', how])
                f.flush()
                print(f'[{i}/{len(todo)}] {how}: {snap}')
            else:
                print(f'[{i}/{len(todo)}] NOT archived (try again later, or save it by hand at https://web.archive.org/save): {url}')
    print('Done. Send archived.csv back to be imported.')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit('\nStopped; run again to continue where you left off.')
