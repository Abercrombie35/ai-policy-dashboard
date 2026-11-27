"""Human review of the AI-drafted coding (AIPD-202) and the inter-coder reliability test (AIPD-203).

usage (from the repository root):

  python3 tools/coding_review.py export
      Writes documents/coding-review/review-sheet.csv: every coded record and bill, with the AI-drafted code for each
      dimension and empty "reviewed_" columns. A reviewer fills in the reviewed_ columns (leave one blank to accept
      the AI code), their initials and the date, in any spreadsheet.

  python3 tools/coding_review.py import documents/coding-review/review-sheet.csv
      Checks every value against the codebook, applies the reviewed codes (new version, history note, coder initials,
      reviewed: true) and writes documents/coding-review/disagreements.csv: each place the reviewer changed the AI code.
      Rows without reviewer initials are skipped.

  python3 tools/coding_review.py sample [--share 0.2] [--seed 2026]
      Draws the reliability sample (at least 20% of coded items, spread across races and bills) and writes a blank,
      blind coding sheet: documents/coding-review/reliability-sheet.csv (no codes shown).

  python3 tools/coding_review.py alpha CODER1.csv CODER2.csv [...]
      Krippendorff's alpha per dimension (nominal; multi-valued dimensions are scored as one present/absent decision
      per category) for two or more coders' sheets, written to documents/coding-review/reliability-results.json and
      read by the methods appendix.

Values in multi-valued cells are separated by semicolons and use the codebook ids (see codebook-reference.md).
"""
import csv
import datetime
import json
import os
import random
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'src', 'data')
OUT = os.path.join(ROOT, 'documents', 'coding-review')


def load(name):
    with open(os.path.join(D, name)) as f:
        return json.load(f)


def save(name, data):
    with open(os.path.join(D, name), 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')


CODEBOOK = load('codebook.json')
DIMS = CODEBOOK['dimensions']
CATS = {c['id'] for c in CODEBOOK['proposalCategories']}
ALLOWED = {d['id']: {c['id'] for c in d['categories']} for d in DIMS}
MULTI = {d['id']: bool(d.get('multi')) for d in DIMS}


def items():
    """Every coded item: candidate records, then bills."""
    out = []
    for r in load('candidate-research.json')['records']:
        if r.get('coding'):
            out.append(('candidate-research.json', 'records', r, r.get('raceId'), r.get('text', '')))
    for b in load('legislation.json')['bills']:
        if b.get('coding'):
            out.append(('legislation.json', 'bills', b, f"bills-{b.get('state') or b.get('country')}", f"{b['billNumber']}: {b.get('summary', '')}"))
    return out


def cell(value):
    if value is None:
        return ''
    return ';'.join(value) if isinstance(value, list) else str(value)


def parse(dim, text):
    vals = [v.strip() for v in (text or '').split(';') if v.strip()]
    return vals if MULTI.get(dim, True) else (vals[0] if vals else None)


def export():
    os.makedirs(OUT, exist_ok=True)
    head = ['id', 'group', 'text', 'source_url']
    for d in DIMS:
        head += [f'ai_{d["id"]}', f'reviewed_{d["id"]}']
    head += ['ai_categories', 'reviewed_categories', 'reviewer_initials', 'review_date', 'notes']
    with open(os.path.join(OUT, 'review-sheet.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(head)
        for _, _, rec, group, text in items():
            row = [rec['id'], group, text, (rec.get('source') or {}).get('url', '')]
            for d in DIMS:
                row += [cell(rec['coding'].get(d['id'])), '']
            row += [cell(rec.get('categories')), '', '', '', '']
            w.writerow(row)
    with open(os.path.join(OUT, 'codebook-reference.md'), 'w') as f:
        f.write(f'# Codebook reference ({CODEBOOK["version"]})\n\nUse these ids in the sheets; separate several values with semicolons.\n\n')
        for d in DIMS:
            f.write(f'## {d["label"]} (`{d["id"]}`, {"several allowed" if d.get("multi") else "one value"})\n\n')
            for c in d['categories']:
                f.write(f'- `{c["id"]}`: {c["label"]}' + (f' — {c["description"]}' if c.get('description') else '') + '\n')
            f.write('\n')
        f.write('## Policy categories (`categories`, several allowed)\n\n')
        for c in CODEBOOK['proposalCategories']:
            f.write(f'- `{c["id"]}`: {c["label"]}\n')
    print(f'Wrote review-sheet.csv ({len(items())} items) and codebook-reference.md to documents/coding-review/')


def import_review(path):
    today = datetime.date.today().isoformat()
    files = {}
    index = {}
    for fname, key, rec, _, _ in items():
        files.setdefault(fname, None)
        index[rec['id']] = (fname, key)
    data = {f: load(f) for f in files}
    lookup = {}
    for fname, key in set(index.values()):
        for rec in data[fname][key]:
            lookup[rec['id']] = rec
    problems, disagreements, reviewed = [], [], 0
    rows = list(csv.DictReader(open(path, newline='')))
    for row in rows:
        initials = (row.get('reviewer_initials') or '').strip()
        if not initials:
            continue
        rec = lookup.get(row['id'])
        if rec is None:
            problems.append(f'{row["id"]}: unknown id')
            continue
        changes = []
        for d in DIMS:
            dim = d['id']
            text = (row.get(f'reviewed_{dim}') or '').strip()
            if not text:
                continue
            val = parse(dim, text)
            bad = [v for v in (val if isinstance(val, list) else [val]) if v not in ALLOWED[dim]]
            if bad:
                problems.append(f'{row["id"]} {dim}: {bad} not in the codebook')
                continue
            if val != rec['coding'].get(dim):
                disagreements.append([row['id'], dim, cell(rec['coding'].get(dim)), cell(val), initials, row.get('notes', '')])
                changes.append(f'{dim}: {cell(rec["coding"].get(dim)) or "none"} -> {cell(val)}')
                rec['coding'][dim] = val
        cats = (row.get('reviewed_categories') or '').strip()
        if cats:
            val = parse('categories', cats)
            bad = [v for v in val if v not in CATS]
            if bad:
                problems.append(f'{row["id"]} categories: {bad} not in the codebook')
            elif val != rec.get('categories'):
                disagreements.append([row['id'], 'categories', cell(rec.get('categories')), cell(val), initials, row.get('notes', '')])
                changes.append(f'categories: {cell(rec.get("categories"))} -> {cell(val)}')
                rec['categories'] = val
        rec['coding']['coder'] = f'model-draft, reviewed by {initials}'
        rec['coding']['reviewed'] = True
        rec['version'] = rec.get('version', 1) + 1
        rec.setdefault('history', []).append({'version': rec['version'], 'date': row.get('review_date') or today,
                                              'note': f'Coding reviewed by {initials}' + (f'; changed {"; ".join(changes)}.' if changes else '; AI-drafted codes accepted.')})
        reviewed += 1
    if problems:
        print('Nothing imported. Fix these first:')
        for p in problems:
            print(' -', p)
        sys.exit(1)
    for f, d in data.items():
        save(f, d)
    os.makedirs(OUT, exist_ok=True)
    log = os.path.join(OUT, 'disagreements.csv')
    new = not os.path.exists(log)
    with open(log, 'a', newline='') as f:
        w = csv.writer(f)
        if new:
            w.writerow(['id', 'dimension', 'ai_code', 'reviewed_code', 'reviewer', 'notes'])
        w.writerows(disagreements)
    print(f'{reviewed} items reviewed; {len(disagreements)} codes changed (logged in documents/coding-review/disagreements.csv).')


def sample(share=0.2, seed=2026):
    rng = random.Random(seed)
    groups = {}
    for _, _, rec, group, text in items():
        groups.setdefault(group, []).append((rec, text))
    picked = []
    for g in sorted(groups):
        recs = sorted(groups[g], key=lambda x: x[0]['id'])
        n = max(1, round(len(recs) * share))
        picked += rng.sample(recs, n)
    total = len(items())
    os.makedirs(OUT, exist_ok=True)
    head = ['id', 'text', 'source_url'] + [d['id'] for d in DIMS] + ['categories', 'coder_initials']
    with open(os.path.join(OUT, 'reliability-sheet.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(head)
        for rec, text in sorted(picked, key=lambda x: x[0]['id']):
            w.writerow([rec['id'], text, (rec.get('source') or {}).get('url', '')] + [''] * (len(DIMS) + 2))
    print(f'Reliability sample: {len(picked)} of {total} coded items ({100 * len(picked) / total:.0f}%), seed {seed}. '
          'Each coder fills in a copy of documents/coding-review/reliability-sheet.csv without seeing the other codes.')


def alpha_nominal(units):
    """Krippendorff's alpha for nominal data. units: list of lists of values (None = missing)."""
    from collections import Counter
    o = Counter()
    for vals in units:
        vals = [v for v in vals if v is not None]
        m = len(vals)
        if m < 2:
            continue
        for i, a in enumerate(vals):
            for j, b in enumerate(vals):
                if i != j:
                    o[(a, b)] += 1 / (m - 1)
    n_c = Counter()
    for (a, _), w in o.items():
        n_c[a] += w
    n = sum(n_c.values())
    if n <= 1:
        return None
    d_o = sum(w for (a, b), w in o.items() if a != b)
    d_e = sum(n_c[a] * n_c[b] for a in n_c for b in n_c if a != b)
    if d_e == 0:
        return 1.0
    return 1 - (n - 1) * d_o / d_e


def alpha(paths):
    sheets = [{r['id']: r for r in csv.DictReader(open(p, newline=''))} for p in paths]
    ids = sorted(set().union(*[set(s) for s in sheets]))
    results = {}
    for d in DIMS + [{'id': 'categories', 'label': 'Policy categories', 'multi': True}]:
        dim = d['id']
        multi = d.get('multi', False)
        values = lambda s, i: parse(dim, s[i].get(dim, '')) if i in s and (s[i].get(dim) or '').strip() else None
        if multi:
            options = sorted(ALLOWED.get(dim, CATS))
            units = []
            for i in ids:
                coded = [values(s, i) for s in sheets]
                if sum(c is not None for c in coded) < 2:
                    continue
                for opt in options:
                    units.append([None if c is None else (opt in c) for c in coded])
        else:
            units = [[values(s, i) for s in sheets] for i in ids]
        a = alpha_nominal(units)
        n_units = sum(1 for i in ids if sum(values(s, i) is not None for s in sheets) >= 2)
        results[dim] = {'label': d['label'], 'alpha': None if a is None else round(a, 3), 'units': n_units}
    out = {'date': datetime.date.today().isoformat(), 'coders': len(paths), 'items': len(ids), 'method': (
        "Krippendorff's alpha, nominal. Multi-valued dimensions are scored as one present/absent decision per category "
        'and item. 0.80 or above is conventionally reliable; 0.667-0.80 supports tentative conclusions.'), 'dimensions': results}
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, 'reliability-results.json'), 'w') as f:
        json.dump(out, f, indent=2)
    for dim, r in results.items():
        print(f'{r["label"]:<28} alpha={r["alpha"]}  ({r["units"]} items coded by 2+ coders)')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'export':
        export()
    elif cmd == 'import':
        import_review(sys.argv[2])
    elif cmd == 'sample':
        args = sys.argv[2:]
        share = float(args[args.index('--share') + 1]) if '--share' in args else 0.2
        seed = int(args[args.index('--seed') + 1]) if '--seed' in args else 2026
        sample(share, seed)
    elif cmd == 'alpha':
        alpha(sys.argv[2:])
    else:
        print(__doc__)
