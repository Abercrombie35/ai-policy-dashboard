"""Draw the 2026 Senate sample from published criteria (AIPD-102).

usage (from the repository root):
  python3 tools/select_senate_races.py . documents/senate-selection/races-2026.json

The input holds sourced facts about every 2026 Senate contest (incumbent, open seat, final pre-election rating,
result, AI/data center signals). The criteria below were fixed before the list was drawn and are applied
mechanically; the output is src/data/senate-race-selection.json, shown on the Methodology page.
"""
import json
import sys

REPO, FACTS = sys.argv[1:3]
OUT = f'{REPO}/src/data/senate-race-selection.json'
TRACKED = {'MI': 'mi-senate-2026', 'TX': 'tx-senate-2026'}
NOTES = {'FL': 'Florida is still built out as its own priority (AIPD-109) for its state AI and data center activity and open governor\'s race, alongside the sample rather than in it'}
MIN_N, MAX_N = 10, 20

CRITERIA = [
    {'id': 'competitive', 'short': 'competitive', 'label': 'Competitive',
     'description': 'Rated Toss-up or Lean (either party) in the final pre-election rating from the Cook Political Report '
                    '(or, where Cook could not be found, Sabato\'s Crystal Ball or Inside Elections). Every such race is included.'},
    {'id': 'ai-salience', 'short': 'AI or data centers in the race', 'label': 'AI or data centers were a campaign issue',
     'description': 'A candidate\'s own statement, ad or debate exchange, reported by a news outlet, made AI or data centers an issue '
                    'between the Senate candidates (news framing alone does not count). Included when the race was also rated Likely or '
                    'closer, or the seat was open.'},
    {'id': 'open-seat', 'short': 'open seat', 'label': 'Open seat',
     'description': 'No incumbent on the ballot (retired, lost the primary or the seat was vacated). Open seats rank above '
                    'incumbent races when the list has to be filled or cut.'},
    {'id': 'party-balance', 'short': 'party balance', 'label': 'Party balance',
     'description': 'Every race in the sample profiles both parties\' nominees (in Nebraska, the Republican and the independent '
                    'Democrats backed), so the sample has as many candidates from one side as the other. Republicans defended most of '
                    '2026\'s competitive seats, so the seats in the sample lean Republican before the election; that share is reported '
                    'rather than evened out with uncompetitive races.'},
    {'id': 'state-activity', 'short': 'state AI or data center activity', 'label': 'State AI or data center activity',
     'description': 'A notable 2025-2026 state AI law or data center fight. Used to rank races when the list has to be '
                    f'filled to {MIN_N} or cut to {MAX_N}.'},
]
RATING_POINTS = {'toss-up': 3, 'lean': 2, 'likely': 1, 'solid': 0}


def tier(rating):
    r = ((rating or {}).get('rating') or '').lower().replace('toss up', 'toss-up')
    for k in RATING_POINTS:
        if k in r:
            return k
    return None


def ai(r):
    # News framing alone ("weak") does not count; a candidate's own statement, ad or debate exchange does.
    a = r.get('aiSignal')
    return bool(a) and a.get('strength') != 'weak'


def score(r):
    return (RATING_POINTS.get(tier(r.get('rating')), 0) * 10 + (6 if ai(r) else 0)
            + (3 if r.get('openSeat') else 0) + (1 if r.get('stateSignal') else 0))


facts = json.load(open(FACTS))
races = facts['races']
for r in races:
    t = tier(r.get('rating'))
    met = []
    if t in ('toss-up', 'lean'):
        met.append('competitive')
    if ai(r) and (t in ('toss-up', 'lean', 'likely') or r.get('openSeat')):
        met.append('ai-salience')
    if r.get('openSeat'):
        met.append('open-seat')
    if r.get('stateSignal'):
        met.append('state-activity')
    r['_met'], r['_score'], r['_tier'] = met, score(r), t

ranked = sorted(races, key=lambda r: -r['_score'])
chosen = [r for r in ranked if 'competitive' in r['_met'] or 'ai-salience' in r['_met'] or r['state'] in TRACKED and r.get('seatType') == 'regular']
if len(chosen) < MIN_N:
    for r in ranked:
        if r not in chosen and len(chosen) < MIN_N and (r['_tier'] == 'likely' or r.get('openSeat')):
            chosen.append(r)
if len(chosen) > MAX_N:
    keep = [r for r in chosen if r['state'] in TRACKED]
    rest = sorted([r for r in chosen if r not in keep], key=lambda r: -r['_score'])
    chosen = keep + rest[:MAX_N - len(keep)]


def held(r):
    return ((r.get('incumbent') or {}).get('party') or '')[:1]


chosen_ids = {id(r) for r in chosen}
untracked = sorted([r for r in chosen if r['state'] not in TRACKED], key=lambda r: -r['_score'])
next_five = {id(r) for r in untracked[:5]}


def describe(r, selected):
    bits = []
    rating = (r.get('rating') or {}).get('rating')
    if rating:
        bits.append(f'Rated {rating}')
    if r.get('openSeat'):
        bits.append(f"open seat ({r['openReason'][0].lower() + r['openReason'][1:]})" if r.get('openReason') else 'open seat')
    if ai(r):
        bits.append(f"AI or data centers in the race: {r['aiSignal']['text']}")
    elif selected:
        bits.append('no AI or data center exchange between the candidates found')
    if not selected:
        why = []
        if r['_tier'] not in ('toss-up', 'lean'):
            why.append('not rated competitive')
        if not ai(r):
            why.append('no AI or data center exchange between the candidates found' + (' (only news framing)' if r.get('aiSignal') else ''))
        elif 'ai-salience' in r['_met']:
            why.append('ranked below the 20-race limit')
        else:
            why.append('AI or data centers were an issue, but the race was rated Solid and the seat was not open')
        if r['state'] in NOTES:
            why.append(NOTES[r['state']])
        bits = [f'Rated {rating}' if rating else 'No rating found'] + why
    return '; '.join(bits) + '.'


out = []
for r in sorted(races, key=lambda r: (r['state'], r.get('seatType') != 'regular')):
    sel = id(r) in chosen_ids
    out.append({
        'state': r['state'], 'stateName': r.get('stateName') or r['state'], 'seatType': r.get('seatType', 'regular'),
        'incumbent': r.get('incumbent'), 'openSeat': bool(r.get('openSeat')), 'openReason': r.get('openReason'),
        'nominees': r.get('nominees'), 'rating': r.get('rating'), 'result': r.get('result'),
        'aiSignal': r.get('aiSignal'), 'stateSignal': r.get('stateSignal'),
        'selected': sel, 'criteriaMet': r['_met'] + (['party-balance'] if sel else []),
        'reason': describe(r, sel),
        'trackedRaceId': TRACKED.get(r['state']) if sel and r.get('seatType', 'regular') == 'regular' else None,
        'status': ('tracked' if r['state'] in TRACKED and r.get('seatType', 'regular') == 'regular' else 'next' if id(r) in next_five else 'later') if sel else None,
    })
summary = (f'The sample is drawn from all {len(races)} Senate contests of 2026 by the criteria below, applied in order to facts '
           f'gathered before the list was drawn. It has {len(chosen)} races: every competitive race, plus races where AI or data '
           'centers were a campaign issue, kept between 10 and 20 races, each profiling both parties\' nominees. Michigan and '
           'Texas, the pilot races, are tracked; the five highest-ranked others are added next (AIPD-103). '
           f"Before the election, {sum(1 for r in chosen if held(r) == 'R')} of the {len(chosen)} seats were held by Republicans and "
           f"{sum(1 for r in chosen if held(r) == 'D')} by Democrats.")
json.dump({'asOf': facts.get('asOf'), 'method': facts.get('method'), 'gaps': facts.get('gaps', []), 'note': 'Senate race selection (AIPD-102), drawn by tools/select_senate_races.py from documents/senate-selection/races-2026.json.',
           'criteriaSummary': summary, 'criteria': CRITERIA, 'races': out}, open(OUT, 'w'), indent=2, ensure_ascii=False)
open(OUT, 'a').write('\n')
print(f'{len(chosen)} selected of {len(races)}:', ', '.join(f"{r['state']}{'*' if r.get('seatType') == 'special' else ''}({r['_score']})" for r in sorted(chosen, key=lambda r: -r['_score'])))
print('party held before:', {p: sum(1 for r in chosen if held(r) == p) for p in 'DRI'})
print('next five:', [r['state'] for r in untracked[:5]])
