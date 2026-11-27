"""Import certified election results relayed from ChatGPT (AIPD-108).

usage (from the repository root):
  python3 tools/import_certified.py . documents/chatgpt-verification/results/certified-NN.json NN [YYYY-MM-DD]

The input is ChatGPT's JSON reply to documents/chatgpt-verification/certified-results.txt.

For each race:
- status "certified" with figures from the official source: the result gets a new version with status
  Certified, High confidence, the official source, the certified vote counts and shares, and its
  certification marked as entered. The previous figures stay in the record's history.
- status "canvass-complete" or "pending" (or certified without usable figures): only the certification
  status, authority, date or expected date are updated; the unofficial figures stay as they are.

The import stops, changing nothing, if the certified winner differs from the recorded winner, a
recorded candidate is missing from the official table, or the votes do not add up to the stated total.
Those need a person's decision.
"""
import datetime
import json
import sys

REPO, BATCH, LABEL = sys.argv[1:4]
TODAY = sys.argv[4] if len(sys.argv) > 4 else datetime.date.today().isoformat()
D = f'{REPO}/src/data/'
METHOD = (f'Certified figures from the official state source, checked with ChatGPT (web browsing) and relayed by the '
          f'project owner on {TODAY} (certified results, relay {LABEL})')


def load(p):
    return json.load(open(D + p))


def save(p, d):
    with open(D + p, 'w') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write('\n')


MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']


def short_date(iso):
    y, m, d = iso.split('-')
    return f'{MONTHS[int(m) - 1]} {int(d)}, {y}'


def norm(name):
    return ' '.join(name.lower().replace('.', '').split())


relayed = json.load(open(BATCH))
results = load('results.json')
ver = load('verification.json')
by_id = {r['id']: r for r in results['results']}
problems, changes = [], []

for v in relayed:
    rid = v['id']
    rec = by_id.get(rid)
    if rec is None:
        problems.append(f'{rid}: no such result')
        continue
    status = v.get('status')
    if status not in ('certified', 'canvass-complete', 'pending'):
        problems.append(f'{rid}: unknown status {status!r}')
        continue
    cands = [c for c in (v.get('candidates') or []) if c.get('votes') is not None]
    official = (v.get('source_url') or '').strip()
    if status == 'certified' and cands and official:
        total = v.get('total_votes') or sum(c['votes'] for c in cands)
        if v.get('total_votes') and abs(sum(c['votes'] for c in cands) - v['total_votes']) > 0:
            problems.append(f'{rid}: candidate votes add up to {sum(c["votes"] for c in cands)}, not the stated total {v["total_votes"]}')
            continue
        top = max(cands, key=lambda c: c['votes'])
        if norm(top['name']) != norm(rec['winner']['name']):
            problems.append(f'{rid}: the certified winner is {top["name"]}, not {rec["winner"]["name"]}; needs a decision')
            continue
        official_names = {norm(c['name']): c for c in cands}
        missing = [c['name'] for c in rec['candidates'] if norm(c['name']) not in official_names]
        if missing:
            problems.append(f'{rid}: recorded candidates missing from the official table: {missing}; needs a decision')
            continue
        changes.append((rec, v, cands, total))
    else:
        changes.append((rec, v, None, None))

if problems:
    print('Nothing imported. Resolve these first:')
    for p in problems:
        print(' -', p)
    sys.exit(1)

for rec, v, cands, total in changes:
    cert = dict(rec.get('certification') or {})
    cert['status'] = v['status']
    if v.get('certified_by'):
        cert['by'] = v['certified_by']
    if v['status'] != 'pending' and v.get('certified_on'):
        cert['date'] = v['certified_on']
    if v.get('expected'):
        cert['expected'] = v['expected']
    official = {'title': v.get('source_title') or v.get('source_url'), 'url': v.get('source_url')} if v.get('source_url') else None
    if v['status'] != 'pending' and official:
        cert['source'] = official
    if cands:
        recorded = {norm(c['name']): c for c in rec['candidates']}
        new_cands = []
        for c in sorted(cands, key=lambda c: -c['votes']):
            old = recorded.get(norm(c['name']), {})
            pct = c.get('vote_pct')
            pct = round(pct if pct is not None else 100 * c['votes'] / total, 2)
            new_cands.append({'name': old.get('name', c['name']), 'party': old.get('party', c.get('party') or 'Other'),
                              'candidateId': old.get('candidateId'), 'votes': int(c['votes']), 'votePct': pct,
                              **({'partyNote': old['partyNote']} if old.get('partyNote') else {})})
        previous = '; '.join(f"{c['name']} {c.get('votePct')}%" for c in rec['candidates'])
        rec['candidates'] = new_cands
        rec['resultStatus'] = 'certified'
        rec['confidence'] = 'high'
        if rec.get('source') and rec['source'].get('url') != official['url']:
            rec.setdefault('additionalSources', []).insert(0, rec['source'])
        rec['source'] = official
        rec['figuresAsOf'] = f"Certified results from the {cert.get('by', 'state canvassing authority')}" + (
            f", {short_date(cert['date'])}" if cert.get('date') else '') + f'; {total:,} votes cast in the race.'
        cert['figuresEntered'] = True
        note = f'{METHOD}: certified figures entered, High confidence. Previous unofficial shares: {previous}.'
        ver['checks'][rec['id']] = {'result': 'confirmed', 'checkedOn': TODAY, 'method': 'chatgpt-primary-source', 'relay': f'certified-{LABEL}',
                                    'note': f"Certified figures from the official source ({official['title']}).", 'sources': [official],
                                    **({'quote': v['exact_quote']} if v.get('exact_quote') else {}), 'level': 'high'}
    else:
        note = f"{METHOD}: certification status updated to {v['status'].replace('-', ' ')}; figures unchanged." + (f" {v['notes']}" if v.get('notes') else '')
    rec['certification'] = cert
    rec['lastVerified'] = TODAY
    rec['version'] = rec.get('version', 1) + 1
    rec.setdefault('history', []).append({'version': rec['version'], 'date': TODAY, 'note': note})

ver.setdefault('relays', []).append({'batch': f'certified-{LABEL}', 'date': TODAY, 'claims': len(changes), 'tool': 'ChatGPT (web browsing)',
                                    'relayedBy': 'project owner'})
save('results.json', results)
save('verification.json', ver)
print('imported', len(changes), 'results:', ', '.join(f"{r['id']} -> {v['status']}{' (figures entered)' if c else ''}" for r, v, c, _ in changes))
