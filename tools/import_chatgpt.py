"""Import ChatGPT primary-source checks relayed by the project owner (AIPD-212).

usage (from the repository root):
  python3 tools/import_chatgpt.py . documents/chatgpt-verification/results/batch-NN.json \
      documents/chatgpt-verification/decisions/decisions-NN.py NN [YYYY-MM-DD]

The batch file is ChatGPT's JSON reply to documents/chatgpt-verification/batch-NN.txt.
The decisions file records, claim by claim, any correction or confidence level that
differs from the default rules below (see decisions-01.py for the format).

Default rules (decisions-NN.py can override any claim, and must cover every
"contradicted" verdict):
- verified + official/campaign/transcript/election-office source + quote + date -> confirmed, High
- verified otherwise (news, or no date)                                           -> confirmed, Medium
- partly-verified / not-found                                                     -> partly-confirmed / not-confirmed, Low
Every touched record gets a new version and a history note naming the method.
"""
import json
import sys

import datetime

REPO, BATCH, DECISIONS, LABEL = sys.argv[1:5]
D = f'{REPO}/src/data/'
TODAY = sys.argv[5] if len(sys.argv) > 5 else datetime.date.today().isoformat()
METHOD = f'Checked against the primary source with ChatGPT (web browsing), relayed by the project owner on {TODAY} (batch {LABEL})'
PRIMARY = {'official', 'campaign', 'transcript', 'election-office'}


def load(p):
    return json.load(open(D + p))


def save(p, d):
    with open(D + p, 'w') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write('\n')


def set_fields(**kw):
    def f(rec, h):
        for k, v in kw.items():
            if v is None:
                rec.pop(k, None)
            else:
                rec[k] = v
    return f


def chain(*fs):
    def f(rec, h):
        for g in fs:
            g(rec, h)
    return f


def headline(rid, text):
    def f(rec, h):
        h[rid] = text
    return f


exec(open(DECISIONS).read())  # defines DECISIONS

results = json.load(open(BATCH))
research = load('candidate-research.json')
legislation = load('legislation.json')
results_file = load('results.json')
partylines = load('party-lines.json')
headlines = load('headlines.json')
ver = load('verification.json')
recs = {r['id']: r for r in research['records']}
recs.update({b['id']: b for b in legislation['bills']})
recs.update({r['id']: r for r in results_file['results']})

tally = {}
for v in results:
    cid = v['id']
    if cid not in ver['checks']:
        raise SystemExit(f'unknown id {cid}')
    dec = DECISIONS.get(cid, {})
    if v['verdict'] == 'contradicted' and not dec:
        raise SystemExit(f'contradicted without a decision: {cid}')
    primary = v.get('source_type') in PRIMARY and v.get('exact_quote') and v.get('source_date')
    if 'result' in dec:
        result, conf = dec['result'], dec['confidence']
    elif v['verdict'] == 'verified':
        result, conf = 'confirmed', 'high' if primary else 'medium'
    elif v['verdict'] == 'partly-verified':
        result, conf = 'partly-confirmed', 'low'
    else:
        result, conf = 'not-confirmed', 'low'
    sources = [{'title': v['source_title'], 'url': v['source_url']}] + dec.get('extra_sources', [])
    # Only sources ChatGPT (or the decision) actually relied on; earlier search-round sources are not carried over.
    seen = set()
    sources = [s for s in sources if not (s['url'] in seen or seen.add(s['url']))]
    note = dec.get('note') or v.get('notes') or ''
    check = {'result': result, 'checkedOn': TODAY, 'method': 'chatgpt-primary-source', 'relay': LABEL,
             'note': note, 'sources': sources[:3]}
    unconf = dec.get('unconfirmed', v.get('not_confirmed') if result in ('partly-confirmed', 'not-confirmed') else [])
    if unconf:
        check['unconfirmed'] = unconf
    if v.get('exact_quote'):
        check['quote'] = v['exact_quote']
    check['level'] = conf
    ver['checks'][cid] = check
    rec = recs.get(cid)
    if rec is not None:
        if dec.get('apply'):
            dec['apply'](rec, headlines['headlines'])
        if rec.get('labelType') != 'election-result':
            rec['confidence'] = conf
        rec['lastVerified'] = TODAY
        rec['version'] = rec.get('version', 1) + 1
        rec.setdefault('history', []).append({'version': rec['version'], 'date': TODAY,
                                              'note': f'{METHOD}: {result.replace("-", " ")}, {conf.capitalize()} confidence. {note}'})
    tally[f'{result}/{conf}'] = tally.get(f'{result}/{conf}', 0) + 1

ver.setdefault('relays', []).append({'batch': LABEL, 'date': TODAY, 'claims': len(results), 'tool': 'ChatGPT (web browsing)',
                                    'relayedBy': 'project owner'})
for name, data in [('candidate-research.json', research), ('legislation.json', legislation), ('results.json', results_file),
                   ('party-lines.json', partylines), ('headlines.json', headlines), ('verification.json', ver)]:
    save(name, data)
print('imported', len(results), 'claims:', tally)
