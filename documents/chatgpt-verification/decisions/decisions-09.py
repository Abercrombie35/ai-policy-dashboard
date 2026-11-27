# Decisions for batch 09, claim by claim.
#
# Race context notes (fr-president-2027#contextN) and election-calendar entries (international#...) are not
# versioned records, so the importer only writes their checks. One wording change was made by hand after the
# import: context note 1 of races/fr-president-2027.json now gives the appeal ruling's terms (45 months'
# ineligibility, 30 of them suspended).

DECISIONS = {
    'fr-president-2027#context0': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed on the government\'s official page: the official campaign opens Monday, April 5, 2027, with rounds on April 18 and May 2 '
                 '(some overseas territories vote a day earlier).'),
    },
    'fr-president-2027#context1': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: Eunews\' July 7, 2026 report confirms the appeal ruling (45 months\' ineligibility, 30 of them suspended), which '
                 'lets her run in 2027. Her same-day declaration, the Dec. 16 Court of Cassation hearing and Bardella\'s fallback candidacy were not '
                 'confirmed in an opened source; the court\'s pages would not display.'),
    },
    'international#es-2026-snap': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in Royal Decree 806/2026 of Oct. 5 (Boletín Oficial del Estado, Oct. 6), which calls elections to both chambers for Sunday, Nov. 29, 2026.',
    },
    'international#fi-2027-parliamentary': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in government decree 968/2026 (Finlex, Nov. 5, 2026) on constituency seats, which names April 18, 2027 as election day.',
    },
    'international#fr-2027-presidential': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed on service-public.gouv.fr: first round Sunday, April 18, 2027 and runoff May 2, with exceptions for some overseas territories.',
    },
    'international#it-2027-general': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('The constitution confirms the rule (Articles 60 and 61): five-year terms, with elections within 70 days of the end of the previous '
                 'chambers. Dec. 22, 2027 is 70 days after the fifth anniversary of the current chambers\' first sitting (Oct. 13, 2022), a date '
                 'not checked in an opened source, so Medium. No election date has been set.'),
        'unconfirmed': ['The first-sitting date the deadline is counted from (Oct. 13, 2022).', 'An official decree setting the election.'],
    },
    'international#pl-2027-parliamentary': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('Not confirmed: the constitution\'s page yielded no usable text and the electoral commission result found concerned a Senate '
                 'by-election. "By November 11" is the legal deadline as reported by secondary sources; no date has been set.'),
    },
    'mi-2023-election-deepfakes': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in Gov. Whitmer\'s Nov. 30, 2023 signing release: political ads generated wholly or substantially with AI must carry a '
                 'statement saying so, with penalties for specified deceptive election media; Tsernoglou authored HB 5141 and 5144 and Bierlein '
                 'HB 5143. The release is now the source.'),
        'apply': set_fields(
            statusNote='Signed Nov. 30, 2023.',
            summary=('Require political ads generated wholly or substantially with AI to say so, and set penalties for distributing specified '
                     'deceptive AI-generated election media.'),
            source={'title': 'Office of the Governor of Michigan: Whitmer signs election bills package (Nov. 30, 2023)',
                    'url': 'https://www.michigan.gov/whitmer/news/press-releases/2023/11/30/whitmer-signs-election-bills-to-ensure-every-vote-can-be-cast-and-counted'}),
    },
    'mi-2026-house-moratorium': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: the legislature\'s histories confirm HB 5594 (Wortz), HB 5595 (Wegela) and HB 5596 (Fox), introduced Feb. 26, 2026 '
                 'and referred to the Committee on Government Operations with no later action. The April 1, 2027 end date and Gov. Whitmer\'s '
                 'refusal to sign a statewide moratorium were not checked in the bill text or a statement of hers.'),
        'unconfirmed': ['The April 1, 2027 end date, from the bill text.', 'Gov. Whitmer\'s refusal to sign a statewide moratorium, from a statement of hers.'],
        'extra_sources': [{'title': 'Michigan Legislature: House Bill 5595 of 2026', 'url': 'https://www.legislature.mi.gov/Bills/Bill?ObjectName=2026-HB-5595'},
                          {'title': 'Michigan Legislature: House Bill 5596 of 2026', 'url': 'https://www.legislature.mi.gov/Bills/Bill?ObjectName=2026-HB-5596'}],
        'apply': set_fields(
            sponsors=[{'name': 'Jennifer Wortz', 'party': 'Republican', 'role': 'HB 5594', 'linkedCandidateId': None},
                      {'name': 'Dylan Wegela', 'party': 'Democratic', 'role': 'HB 5595', 'linkedCandidateId': None},
                      {'name': 'Joseph Fox', 'party': 'Republican', 'role': 'HB 5596', 'linkedCandidateId': None}],
            statusNote='Introduced Feb. 26, 2026 and referred to the Committee on Government Operations; no later action.'),
    },
    'mi-2026-sb1018': {
        'result': 'corrected', 'confidence': 'high',
        'note': ('Confirmed on the legislature\'s histories: SB 1018-1020 were introduced June 4, 2026 and referred to the Committee on Government '
                 'Operations with no later action. Corrected: Sen. Jim Runestad introduced all three; Sen. Ruth Johnson\'s role could not be confirmed.'),
        'unconfirmed': ['Sen. Ruth Johnson\'s role on the bills.'],
        'extra_sources': [{'title': 'Michigan Legislature: Senate Bill 1019 of 2026', 'url': 'https://www.legislature.mi.gov/Bills/Bill?ObjectName=2026-SB-1019'},
                          {'title': 'Michigan Legislature: Senate Bill 1020 of 2026', 'url': 'https://www.legislature.mi.gov/Bills/Bill?ObjectName=2026-SB-1020'}],
        'apply': set_fields(
            sponsors=[{'name': 'Jim Runestad', 'party': 'Republican', 'role': 'introduced SB 1018-1020', 'linkedCandidateId': None}],
            sponsorsNote='Sen. Ruth Johnson (R) was also reported as a sponsor; her role is not confirmed on the official record.',
            statusNote='Introduced June 4, 2026 and referred to the Committee on Government Operations; no later action.'),
    },
    'mi-hb5396': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed on the legislature\'s histories: Wegela\'s HB 5396, Rep. James DeSana\'s HB 5397 and Rep. Erin Byrnes\'s property-tax '
                 'companion HB 5398 were introduced Dec. 17, 2025 and referred to the Committee on Economic Competitiveness, where they remain. '
                 'Companion sponsors added.'),
        'extra_sources': [{'title': 'Michigan Legislature: House Bill 5397 of 2025', 'url': 'https://www.legislature.mi.gov/Bills/Bill?ObjectName=2025-HB-5397'},
                          {'title': 'Michigan Legislature: House Bill 5398 of 2025', 'url': 'https://www.legislature.mi.gov/Bills/Bill?ObjectName=2025-HB-5398'}],
        'apply': set_fields(
            sponsors=[{'name': 'Dylan Wegela', 'party': 'Democratic', 'role': 'HB 5396', 'linkedCandidateId': None},
                      {'name': 'James DeSana', 'party': 'Republican', 'role': 'HB 5397', 'linkedCandidateId': None},
                      {'name': 'Erin Byrnes', 'party': 'Democratic', 'role': 'HB 5398', 'linkedCandidateId': None}],
            statusNote='Introduced Dec. 17, 2025 and referred to the Committee on Economic Competitiveness; still in committee (HB 5398 covers property tax).'),
    },
    'pl-d-data-centers#0': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the Senate Democrats\' release of Schumer\'s Sept. 30, 2026 floor remarks, which also call the Republican bill toothless; '
                 'the Senate roll call confirms cloture failed 57-43 that day. The release is now the source.'),
        'extra_sources': [{'title': 'U.S. Senate Roll Call Vote 254, 119th Congress, 2nd Session',
                           'url': 'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1192/vote_119_2_00254.htm'}],
        'apply': set_fields(
            date='2026-09-30',
            summary=('Schumer: "Senate Democrats want to make it mandatory for data centers to cover their own costs by law." In the same floor remarks '
                     'he called the Republican Ratepayer Protection Act toothless; Senate cloture on it failed 57-43.'),
            source={'title': 'Senate Democrats: Schumer floor remarks urging Republicans to take real action on AI (Sept. 30, 2026)',
                    'url': 'https://www.democrats.senate.gov/news/press-releases/leader-schumer-floor-remarks-urging-senate-republicans-to-join-democrats-to-take-real-action-on-ai'}),
    },
}
