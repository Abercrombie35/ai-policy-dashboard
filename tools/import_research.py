"""Add researched races, candidate records, polls and bills to the data (AIPD-103, AIPD-109).

usage (from the repository root):
  python3 tools/import_research.py RESEARCH.json DECISIONS.py [YYYY-MM-DD]

RESEARCH.json follows documents/research/SCHEMA.md (gathered by web search). DECISIONS.py defines DECISIONS, keyed by
  "<raceId>#s<i>"  for statement i of a race: coding, stances, categories, and optionally text, headline, kind, skip
  "<raceId>#p<i>"  for poll i of a race: questionType, aiIssue (name of the AI option, if any), races, skip
  "<raceId>"       for a race: seatNote, nomineesSource, skipCandidates, notes (dict of candidateId -> note)
  "<billId>"       for a bill: coding, categories, and optionally summary, skip
Every statement and bill needs coding and categories (they are the project's model-drafted coding, flagged unreviewed).

Confidence follows the project's search-based rule: a claim also reported by other independent outlets is checked
"confirmed" at Medium; a claim found only in its own source is "not-checked" at Low until it is checked. Nothing is
High until its primary source is read (AIPD-212). Existing ids are never overwritten.
"""
import datetime
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'src', 'data')
RESEARCH, DECISIONS_PATH = sys.argv[1:3]
TODAY = sys.argv[3] if len(sys.argv) > 3 else datetime.date.today().isoformat()


def load(name):
    with open(os.path.join(D, name)) as f:
        return json.load(f)


def save(name, data):
    with open(os.path.join(D, name), 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')


ns = {}
exec(open(DECISIONS_PATH).read(), ns)
DECISIONS = ns['DECISIONS']
research = json.load(open(RESEARCH))

research_db = load('candidate-research.json')
legislation = load('legislation.json')
results_db = load('results.json')
polls_db = load('voter-priorities.json')
headlines = load('headlines.json')
ver = load('verification.json')
existing = {r['id'] for r in research_db['records']} | {b['id'] for b in legislation['bills']} | \
           {r['id'] for r in results_db['results']} | {p['id'] for p in polls_db['polls']}

SEARCH_NOTE = (f'Summarized from web search results citing this source on {TODAY}; the page itself could not be opened from the '
               'build environment.')
CODING_NOTE = 'Coding, stance and categories were assigned by an AI model and have not been reviewed.'
added = {'races': 0, 'records': 0, 'results': 0, 'polls': 0, 'bills': 0}


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def check_for(rid, source, confirmed_by, what='claim'):
    confirmed_by = [c for c in (confirmed_by or []) if c.get('url') and c.get('url') != (source or {}).get('url')]
    if confirmed_by:
        outlets = ', '.join(c['title'].split(':')[0] for c in confirmed_by[:3])
        ver['checks'][rid] = {'result': 'confirmed', 'checkedOn': TODAY,
                              'note': f'Confirmed by other published reports found by web search ({outlets}). Not yet checked against the primary source.',
                              'sources': confirmed_by[:3]}
        return 'medium', f'Checked {TODAY} against other published reports: confirmed ({outlets}).'
    ver['checks'][rid] = {'result': 'not-checked', 'checkedOn': TODAY,
                          'note': f'Only the cited source was found by web search on {TODAY}; this {what} has not yet been checked against other reports.',
                          'sources': []}
    return 'low', 'Only the cited source was found; not yet checked against other reports.'


def strip_urls(s):
    # Sources are shown as links elsewhere; keep raw addresses out of the text.
    s = re.sub(r'\s*Sources?:\s*[^.]*?(https?://\S+[\s,;and]*)+\.?\s*$', '', s)
    s = re.sub(r'\s*\((?:[^()]*?)https?://[^)]*\)', '', s)
    s = re.sub(r'\s*https?://\S+', '', s)
    return re.sub(r'\s+', ' ', s).strip().rstrip(' ,;')


def year_month(date):
    return date if date and re.match(r'^\d{4}(-\d{2}(-\d{2})?)?$', date) else None


for race_r in research.get('races', []):
    rid = race_r['raceId']
    dec = DECISIONS.get(rid, {})
    skip_c = set(dec.get('skipCandidates', []))
    path = os.path.join(D, 'races', f'{rid}.json')
    if os.path.exists(path):
        sys.exit(f'{rid}: a race file already exists; not overwritten')
    cands = [c for c in race_r['candidates'] if c['id'] not in skip_c]
    race = {
        'id': rid, 'state': race_r['state'],
        'office': race_r['office'] + (' (special)' if race_r.get('seatType') == 'special' else ''), 'cycle': 2026, 'electionDate': '2026-11-03',
        'seat': {'type': race_r['seat']['type'], 'note': dec.get('seatNote') or race_r['seat']['note']},
        'nomineesSource': dec.get('nomineesSource') or strip_urls(race_r.get('nomineesSource') or '') or 'Party nominees as reported (see this race\'s election-result record).',
        'candidates': [{'id': c['id'], 'name': c['name'], 'party': c['party'],
                        'questionnaire': {'status': 'not-sent', 'deadline': None, 'asOf': None}} for c in cands],
        'items': [], 'contextSignals': [],
    }
    with open(path, 'w') as f:
        json.dump(race, f, indent=2, ensure_ascii=False)
        f.write('\n')
    added['races'] += 1
    ids = {c['id'] for c in cands}

    # Election result
    res = race_r.get('result')
    if res and res.get('winner'):
        res_id = f'result-{rid}'
        winner = next((c for c in res['candidates'] if c['name'] == res['winner']), None)
        conf, note = check_for(res_id, res.get('source'), res.get('additionalSources'), 'result')
        cert = dict(res.get('certification') or {'status': 'pending'})
        if 'certExpected' in dec:
            cert['expected'] = dec['certExpected']
        certification = {'status': cert.get('status') or 'pending', 'by': cert.get('by'),
                         'date': cert.get('date') if cert.get('status') in ('certified', 'canvass-complete') else None,
                         'expected': cert.get('expected'), 'figuresEntered': False,
                         'source': cert.get('source') if cert.get('status') in ('certified', 'canvass-complete') else None}
        if dec.get('certNote'):
            certification['note'] = dec['certNote']
        if certification['status'] != 'pending' and not (certification['date'] and certification['by'] and (certification['source'] or {}).get('url')):
            certification = {'status': 'pending', 'by': cert.get('by'), 'date': None, 'expected': cert.get('expected'), 'figuresEntered': False,
                             'source': None, 'note': 'Certification reported but its date or official notice was not confirmed.'}
        by_name = {c['name']: c['id'] for c in cands}
        results_db['results'].append({
            'id': res_id, 'raceId': rid, 'labelType': 'election-result', 'resultStatus': 'unofficial',
            'winner': {'name': res['winner'], 'party': (winner or {}).get('party'), 'candidateId': by_name.get(res['winner'])},
            'call': res.get('call'), 'figuresAsOf': res.get('figuresAsOf') or 'Unofficial figures as reported.',
            'context': dec.get('resultContext') or race_r['seat']['note'],
            'candidates': [{'name': c['name'], 'party': c['party'], 'candidateId': by_name.get(c['name']),
                            **({'votePct': c['votePct']} if c.get('votePct') is not None else {}),
                            **({'votes': c['votes']} if isinstance(c.get('votes'), int) else {})} for c in res['candidates']],
            'source': res['source'], 'additionalSources': res.get('additionalSources') or [],
            'publishedDate': None, 'lastVerified': TODAY, 'confidence': conf, 'version': 1,
            'history': [{'version': 1, 'date': TODAY, 'note': f'{SEARCH_NOTE} {note}'}],
            'certification': certification,
        })
        added['results'] += 1

    # Candidate records
    counters = {}
    office = 'sen' if 'Senate' in race_r['office'] else 'gov'
    for i, st in enumerate(race_r.get('statements', [])):
        key = f'{rid}#s{i}'
        d = DECISIONS.get(key)
        if d is None:
            sys.exit(f'{key}: no decision (coding and categories are required, or skip: True)')
        if d.get('skip') or st['candidateId'] not in ids:
            continue
        last = st['candidateId'].split('-')[-1]
        counters[st['candidateId']] = counters.get(st['candidateId'], 0) + 1
        rec_id = f"cr-{race_r['state'].lower()}-{office}-{last}-{counters[st['candidateId']]}"
        if rec_id in existing:
            sys.exit(f'{rec_id} already exists')
        conf, note = check_for(rec_id, st['source'], st.get('confirmedBy'))
        date = year_month(st.get('date'))
        rec = {
            'id': rec_id, 'raceId': rid, 'candidateId': st['candidateId'], 'kind': d.get('kind') or st.get('kind', 'statement'),
            'labelType': 'source-summary', 'text': (d.get('text') or st['text']) + d.get('append', ''),
            'source': {'title': st['source']['title'], 'url': st['source']['url']},
            'publishedDate': date, 'lastVerified': TODAY, 'confidence': conf,
            'coding': {**d['coding'], 'coder': 'model-draft', 'reviewed': False},
            'stances': d.get('stances', {}), 'categories': d['categories'], 'version': 1,
            'history': [{'version': 1, 'date': TODAY, 'note': f'{SEARCH_NOTE} {note} {CODING_NOTE}'}],
        }
        if not date:
            rec['dateNote'] = d.get('dateNote') or 'Date not reported in the sources found'
            rec['sortDate'] = d.get('sortDate') or '2026-10'
        research_db['records'].append(rec)
        headlines['headlines'][rec_id] = d.get('headline') or st.get('headline') or rec['text'][:70]
        added['records'] += 1

    # Polls
    for i, p in enumerate(race_r.get('polls', [])):
        key = f'{rid}#p{i}'
        d = DECISIONS.get(key, {})
        if d.get('skip'):
            continue
        kind = p['kind']
        poll_id = f"vp-{race_r['state'].lower()}-{slug(p['pollster'])[:28]}-{'issue' if kind == 'issue-priorities' else 'ai-qu'}-{i + 1}"
        if poll_id in existing or any(x['id'] == poll_id for x in polls_db['polls']):
            continue
        conf, note = check_for(poll_id, p['source'], p.get('additionalSources'), 'poll')
        entry = {'id': poll_id, 'state': race_r['state'], 'races': d.get('races') or [rid], 'kind': kind,
                 'pollster': p['pollster'], 'sponsor': p.get('sponsor'), 'fieldStart': year_month(p.get('fieldStart')),
                 'fieldEnd': year_month(p.get('fieldEnd')), 'population': p.get('population'), 'sampleSize': p.get('sampleSize'),
                 'marginOfError': p.get('marginOfError'), 'question': p['question']}
        if kind == 'issue-priorities':
            ai_issue = d.get('aiIssue')
            entry.update({'questionType': d.get('questionType', 'single'),
                          'issues': [{'issue': x['issue'], 'pct': x['pct'], **({'ai': True} if x['issue'] == ai_issue else {})} for x in d.get('issues', p['issues'])],
                          'aiOffered': True if ai_issue else p.get('aiOffered')})
        else:
            entry['figures'] = p['figures']
        entry.update({'labelType': 'reported-fact', 'source': p['source'], 'additionalSources': p.get('additionalSources') or [],
                      'publishedDate': year_month(p.get('published')), 'lastVerified': TODAY, 'confidence': conf, 'version': 1,
                      'history': [{'version': 1, 'date': TODAY, 'note': f'{SEARCH_NOTE} {note}'}]})
        polls_db['polls'].append(entry)
        added['polls'] += 1

for b in research.get('bills', []):
    d = DECISIONS.get(b['id'])
    if d is None:
        sys.exit(f"{b['id']}: no decision (coding and categories are required, or skip: True)")
    if d.get('skip'):
        continue
    if b['id'] in existing:
        sys.exit(f"{b['id']} already exists")
    conf, note = check_for(b['id'], b['source'], b.get('confirmedBy'), 'bill')
    legislation['bills'].append({
        'id': b['id'], 'state': b['state'], 'session': b['session'], 'billNumber': b['billNumber'], 'title': b['title'],
        'sponsors': [{'name': s['name'], 'party': s['party'], 'role': s.get('role', 'sponsor'),
                      'linkedCandidateId': b.get('linkedCandidateId') if d.get('linkSponsor') == s['name'] else None}
                     for s in d.get('sponsors', b.get('sponsors', [])) if s.get('name') and s.get('party')],
        **({'sponsorsNote': d['sponsorsNote']} if d.get('sponsorsNote') else {}),
        'status': d.get('status') or b['status'], 'statusDate': year_month(b.get('statusDate')),
        'statusNote': d.get('statusNote') or b.get('statusNote'), 'categories': d['categories'],
        'summary': d.get('summary') or b['summary'], 'labelType': 'source-summary',
        'source': b['source'], 'publishedDate': None, 'lastVerified': TODAY, 'confidence': conf,
        'coding': {**d['coding'], 'coder': 'model-draft', 'reviewed': False}, 'version': 1,
        'history': [{'version': 1, 'date': TODAY, 'note': f'{SEARCH_NOTE} {note} {CODING_NOTE}'}],
    })
    added['bills'] += 1

for name, data in [('candidate-research.json', research_db), ('legislation.json', legislation), ('results.json', results_db),
                   ('voter-priorities.json', polls_db), ('headlines.json', headlines), ('verification.json', ver)]:
    save(name, data)
print('added', added)
