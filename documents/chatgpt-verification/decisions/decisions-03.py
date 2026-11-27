# Decisions for batch 03, claim by claim. Results keep their own label and stay
# "Unofficial" until certified figures from the state's own table are checked.

CT_CANVASS = {'title': 'Connecticut Secretary of the State: official canvass of the 2026 general election completed (Nov. 25, 2026)',
              'url': 'https://portal.ct.gov/sots/press-releases/2026-press-releases/connecticut-completes-official-canvass-of-2026-general-election-results'}
MI_CERT = {'title': 'Michigan Department of State: Board of State Canvassers certifies the 2026 general election (Nov. 23, 2026)',
           'url': 'https://www.michigan.gov/sos/resources/news/2026/11/23/michigan-board-of-state-canvassers-certifies-record-breaking-2026-general-election'}
TX_SOS = {'title': 'Texas Secretary of State: Election results, Nov. 3, 2026 (unofficial)', 'url': 'https://electionresults.sos.state.tx.us/results.html'}


def add_sources(*srcs):
    def f(r, h):
        have = {s['url'] for s in [r['source']] + r.get('additionalSources', [])}
        r.setdefault('additionalSources', []).extend(s for s in srcs if s['url'] not in have)
    return f


def votes(**kw):
    def f(r, h):
        for c in r['candidates']:
            if c['name'] in kw:
                c.update(kw[c['name']])
    return f


DECISIONS = {
    'result-ct-governor-2026': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': 'Confirmed: Lamont won (AP call 9:18 p.m. on Nov. 3, per WFSB); unofficial shares 59.6% to 40.4% (MultiState). Connecticut completed its official canvass on Nov. 25, 2026; its statement of vote, with certified totals, is due in early 2027.',
        'apply': chain(set_fields(
            call='Called for Lamont by the Associated Press at 9:18 p.m. on election night (WFSB).',
            figuresAsOf='Unofficial shares as listed by MultiState (Nov. 16, 2026). Connecticut completed its official canvass on Nov. 25, 2026; the official statement of vote, with certified totals, is due in early 2027.',
            context='Lamont won a third term; he defeated Bob Stefanowski in 2018 and 2022.'),
            add_sources(CT_CANVASS)),
    },
    'result-ct-house-04-2026': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected: the Associated Press called the race for Himes at 9:58 p.m. on Nov. 3, 2026 (News 12, CT Insider), not Nov. 4. The unofficial figures are confirmed by Decision Desk HQ. Connecticut completed its canvass on Nov. 25; certified totals are due in early 2027.',
        'apply': chain(set_fields(
            call='Called for Himes by the Associated Press at 9:58 p.m. on election night (News 12, CT Insider).',
            figuresAsOf='Unofficial results as listed by Decision Desk HQ. Connecticut completed its official canvass on Nov. 25, 2026; certified totals are due in early 2027.',
            context='Himes, first elected in 2008, won a 10th term and is expected to chair the House Intelligence Committee in the new Democratic majority.',
            source={'title': 'Decision Desk HQ: Connecticut U.S. House District 4, general election', 'url': 'https://votes.decisiondeskhq.com/races/2026-11-03/connecticut-us-house-4-general-election'}),
            add_sources(CT_CANVASS)),
    },
    'result-mi-governor-2026': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Updated to Decision Desk HQ\'s final count: Benson 2,615,251 (54.57%), James 2,094,566 (43.71%), Hudson 44,497 (0.93%); Decision Desk HQ called it at 10:45 p.m. on Nov. 3. Michigan certified its results on Nov. 23, 2026, but the certified figures could not be opened, so the result stays Unofficial here.',
        'unconfirmed': ['Certified figures from the state\'s own results table'],
        'apply': chain(votes(**{'Jocelyn Benson': {'votes': 2615251, 'votePct': 54.57}, 'John James': {'votes': 2094566, 'votePct': 43.71},
                                'Anthony Hudson': {'votes': 44497, 'votePct': 0.93}}),
                       set_fields(figuresAsOf='Decision Desk HQ count (race called Nov. 3, 10:45 p.m.). Michigan\'s Board of State Canvassers certified the results on Nov. 23, 2026; the certified figures have not yet been checked against the state\'s table.'),
                       add_sources(MI_CERT)),
    },
    'result-mi-senate-2026': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': 'Confirmed: Fox\'s count (El-Sayed 52.54%, Rogers 45.46%, Christensen 1.04%) rounds to the shares shown; Fox and Decision Desk HQ called the race. Michigan certified its results on Nov. 23, 2026; the certified figures could not be opened.',
        'apply': chain(set_fields(figuresAsOf='Unofficial results as of 2:30 p.m., Nov. 4, 2026 (The Detroit News); Fox\'s later count rounds to the same shares. Michigan certified its results on Nov. 23, 2026; the certified figures have not yet been checked against the state\'s table.'),
                       add_sources(MI_CERT, {'title': 'Fox News: Michigan 2026 results', 'url': 'https://www.foxnews.com/elections/2026/midterm-results/state/michigan'})),
    },
    'result-tx-governor-2026': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': 'Confirmed on the Texas Secretary of State\'s returns (including write-ins): Hinojosa 52.8% (5,230,789 votes), Abbott 45.7%, Dixon 1.5%. Still unofficial: the incoming Legislature canvasses the governor\'s race in January.',
        'apply': chain(votes(**{'Gina Hinojosa': {'votes': 5230789}}),
                       set_fields(source=TX_SOS,
                                  figuresAsOf='Unofficial returns from the Texas Secretary of State (last updated Nov. 4, 2026), including write-ins. The incoming Legislature canvasses the governor\'s race when it meets in January.')),
    },
    'result-tx-senate-2026': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected: Ted Brown ran on the Libertarian line (190,237 votes). The shares (Talarico 55.1%, Paxton 43.0%, Brown 1.9%) are confirmed on the Texas Secretary of State\'s returns; AP called the race at about 10:04 p.m. and Paxton conceded before 10:30 p.m. Still unofficial.',
        'unconfirmed': ['Completion of the statewide canvass and certified figures'],
        'apply': chain(votes(**{'Ted Brown': {'party': 'Libertarian', 'votes': 190237}}),
                       set_fields(source=TX_SOS,
                                  call='Called for Talarico by the Associated Press at about 10:04 p.m. on election night (KUT); Paxton conceded shortly before 10:30 p.m.',
                                  figuresAsOf='Unofficial returns from the Texas Secretary of State (last updated Nov. 4, 2026), including write-ins.')),
    },
    'tx-90r-sb296': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in the bill text as filed: a two-year pause on new or expanded data center connections, then local majority approval and yearly payments to host-county residents.',
        'apply': set_fields(
            summary=('Would pause new and expanded data centers for two years ("a utility may not energize a new or expanded electric service '
                     'connection for a project"), then require approval by a local majority vote and a yearly payment, the greater of 2% of '
                     'gross receipts or $10,000 per megawatt, shared equally among the host county\'s residents.'),
            statusNote='Prefiled Nov. 9, 2026 for the session starting Jan. 12, 2027.',
            source={'title': 'Texas Legislature: SB 296 (90th Legislature), as filed', 'url': 'https://capitol.texas.gov/tlodocs/90R/billtext/pdf/SB00296I.pdf'}),
    },
    'us-s3852-grid-act': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected from the bill text: existing data centers keep grid power during a 10-year transition only while they hold a one-year "Zero Rate Effect Certificate"; planned sites would disclose utility-use estimates for their first year and the next five, existing sites for the current and next five years plus up to five past years. Introduced Feb. 11, 2026 by Hawley with Blumenthal.',
        'apply': set_fields(
            billNumber='S. 3852', status='in-committee', statusDate='2026-02-11',
            statusNote='Introduced Feb. 11, 2026; referred to the Senate Energy and Natural Resources Committee.',
            summary=('Would bar private data centers drawing 20 megawatts or more (backup power included) from using grid power unless they rely on '
                     'dedicated off-grid sources, starting 180 days after enactment. During a 10-year transition, existing centers can keep using '
                     'grid power only while they hold a one-year federal "Zero Rate Effect Certificate". Planned sites would disclose estimated '
                     'utility use for their first year and the next five; existing sites, current and next-five-year estimates plus up to five past years.'),
            source={'title': 'GovInfo: S. 3852, Guaranteeing Rate Insulation from Data Centers Act (introduced)', 'url': 'https://www.govinfo.gov/content/pkg/BILLS-119s3852is/html/BILLS-119s3852is.htm'}),
    },
    'us-s5653': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected: S. 5653 was introduced Sept. 30, 2026 by Sen. Shelley Moore Capito (R) with Sens. Lee (R), Whitehouse (D) and Heinrich (D). The Senate voted on the package as an amendment to H.R. 2347: cloture 73-25 on Nov. 9, then passage 62-33 on Nov. 19, sending it back to the House. The White House says it puts the Ratepayer Protection Pledge into law; Heinrich\'s own codification wording was not found.',
        'unconfirmed': ['Heinrich personally saying it codifies the Ratepayer Protection Pledge'],
        'extra_sources': [{'title': 'The White House: Statement of administration policy on S. 5653 (Nov. 2026)', 'url': 'https://www.whitehouse.gov/wp-content/uploads/2026/11/SAP-S5653.pdf'},
                          {'title': 'GovInfo: S. 5653 (introduced Sept. 30, 2026)', 'url': 'https://www.govinfo.gov/app/details/BILLS-119s5653is'}],
        'apply': set_fields(
            billNumber='S. 5653 (passed as an amendment to H.R. 2347)',
            sponsors=[{'name': 'Shelley Moore Capito', 'party': 'Republican', 'role': 'sponsor', 'linkedCandidateId': None},
                      {'name': 'Mike Lee', 'party': 'Republican', 'role': 'cosponsor', 'linkedCandidateId': None},
                      {'name': 'Sheldon Whitehouse', 'party': 'Democratic', 'role': 'cosponsor', 'linkedCandidateId': None},
                      {'name': 'Martin Heinrich', 'party': 'Democratic', 'role': 'cosponsor', 'linkedCandidateId': None}],
            sponsorsNote=None, status='passed-one-chamber', statusDate='2026-11-19',
            statusNote='Introduced Sept. 30, 2026. The Senate passed the package as an amendment to H.R. 2347 on Nov. 19, 2026 (62-33), after a 73-25 vote to begin debate on Nov. 9; it goes back to the House.',
            summary=('Energy permitting package that bars utilities from recovering the extra retail costs of serving data centers and other large '
                     'computing users from other customers. The White House says it puts the Ratepayer Protection Pledge into law; the Center for '
                     'Biological Diversity calls it a giveaway to the data center industry.'),
            source={'title': 'U.S. Senate Daily Press: Thursday, Nov. 19, 2026', 'url': 'https://www.dailypress.senate.gov/thursday-november-19-2026/'}),
    },
    'us-s5658': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in the bill text: introduced by Sen. Ron Wyden (D) on Sept. 30, 2026 and referred to Energy and Natural Resources; it covers National Forest System and Interior-managed land, excluding specified Tribal lands.',
        'apply': set_fields(
            summary=('Would prohibit building data centers on National Forest System land and land managed by the Interior Department, excluding '
                     'specified Tribal lands. Referred to the Energy and Natural Resources Committee.'),
            source={'title': 'GovInfo: S. 5658, to prohibit the construction of data centers on Federal land (introduced)', 'url': 'https://www.govinfo.gov/content/pkg/BILLS-119s5658is/xhtml/BILLS-119s5658is.html'}),
    },
    'cr-ct-gov-fazio-1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': 'His no vote on SB 5 on Apr. 21, 2026 (passed 32-4) is confirmed on the Senate roll call; his reason, that AI is better handled federally, is as reported by CT News Junkie, so Medium.',
        'extra_sources': [{'title': 'CT News Junkie: AI regulation takes center stage as campaign issue (Sept. 24, 2026)', 'url': 'https://ctnewsjunkie.com/2026/09/24/ai-regulation-takes-center-stage-as-campaign-issue/'}],
    },
    'cr-ct-house04-himes-1': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in the Brookings transcript of the Oct. 21, 2026 event ("the one real lever we have there ... is just slowing the dispersion of advanced chips into China"), which now serves as the source.',
        'apply': set_fields(
            dateNote='Said at a Brookings event on Oct. 21, 2026.',
            source={'title': 'Brookings: AI on the Ballot, data centers and the 2026 midterms (transcript, Oct. 21, 2026)',
                    'url': 'https://www.brookings.edu/wp-content/uploads/2026/10/aiet_20261021_ai_midterms_transcript.pdf'}),
    },
}
