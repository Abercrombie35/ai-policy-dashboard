# Decisions for batch 06, claim by claim.

GOV_0921_2026 = {'title': 'Office of the Governor of California: Governor Newsom signs most comprehensive data center laws in the nation (Sept. 21, 2026)',
                 'url': 'https://www.gov.ca.gov/2026/09/21/governor-newsom-signs-most-comprehensive-data-center-laws-in-the-nation-providing-communities-more-control-on-water-electricity-and-land-use/'}
GOV_0930_2026 = {'title': 'Office of the Governor of California: Governor Newsom signs more first-in-the-nation AI worker protections (Sept. 30, 2026)',
                 'url': 'https://www.gov.ca.gov/2026/09/30/californias-nation-leading-ai-framework-just-got-stronger-governor-newsom-signs-more-first-in-the-nation-worker-protections-and-more/'}
SENATE_SUMMARY_2026 = {'title': 'California Senate: Summary of significant legislation, 2026 (final)',
                       'url': 'https://sfa.senate.ca.gov/system/files/2026-11/sig-leg-2026-final.pdf'}


def sponsor(name, party='Democratic', role='sponsor'):
    return [{'name': name, 'party': party, 'role': role, 'linkedCandidateId': None}]


DECISIONS = {
    'ca-2026-ab2383': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: the governor\'s Sept. 21, 2026 signing release and the Senate\'s final 2026 summary confirm the law and '
                 'Assemblymember Rick Chavez Zbur\'s authorship, and the release cites "preventing cost shifts to low-income customers". The full '
                 'list of costs data center tariffs must cover (wildfire, electrification, environmental and other programs) could not be checked '
                 'in the bill text.'),
        'unconfirmed': ['The complete list of wildfire, electrification, environmental and other costs the tariffs must cover.'],
        'extra_sources': [SENATE_SUMMARY_2026],
    },
    'ca-2026-sb1000': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in the governor\'s Sept. 30, 2026 signing release, which lists SB 1000 by Sen. Josh Becker (D) as the California AI '
                 'Transparency Act; author added. The precise changes to the disclosure and provenance rules are not in the opened sources, so Medium.'),
        'unconfirmed': ['The precise changes to the disclosure and provenance requirements in the final bill.'],
        'apply': set_fields(sponsors=sponsor('Josh Becker'), sponsorsNote=None, source=GOV_0930_2026),
    },
    'ca-2026-sb887': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in Sen. Steve Padilla\'s Sept. 21, 2026 release (passed the Senate 30-8 and the Assembly 59-11) and the governor\'s signing '
                 'release of the same day, which also covers the package\'s water-use disclosure and developer-funded water infrastructure.'),
        'extra_sources': [GOV_0921_2026],
        'apply': set_fields(statusNote='Passed the Senate 30-8 and the Assembly 59-11; signed Sept. 21, 2026.',
                            source={'title': 'Sen. Steve Padilla: Nation-leading data center regulations signed into law (Sept. 21, 2026)',
                                    'url': 'https://sd18.senate.ca.gov/news/nation-leading-data-center-regulations-signed-law'}),
    },
    'ca-2026-sb947': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in Sen. Jerry McNerney\'s Sept. 30, 2026 release: the No Robo Bosses Act of 2026 bars employers from relying solely on '
                 'automated decision systems to fire or discipline workers and requires human oversight; author added.'),
        'apply': set_fields(
            sponsors=sponsor('Jerry McNerney'), sponsorsNote=None,
            summary=('Bars employers from relying solely on AI or automated decision systems to fire or discipline workers and requires human '
                     'oversight of those decisions (the "No Robo Bosses Act of 2026", a narrower version of the vetoed SB 7).'),
            source={'title': 'Sen. Jerry McNerney: Newsom signs No Robo Bosses Act of 2026 (Sept. 30, 2026)',
                    'url': 'https://sd05.senate.ca.gov/news/newsom-signs-mcnerneys-no-robo-bosses-act-2026-requiring-human-oversight-ai-workplace'}),
    },
    'cr-ca-gov-becerra-1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed on the campaign\'s AI page: eleven numbered proposals, including full funding for CalCompute, independent audits of every '
                 'AI system a state agency deploys, enforcement, tracking AI\'s effects on jobs and protecting children. The page shows no date; the '
                 'May 2026 release rests on news reports (Tech Times), so Medium.'),
        'unconfirmed': ['The May 2026 release date.'],
        'apply': set_fields(dateNote='Release month from news reports; the campaign page shows no date'),
    },
    'cr-ca-gov-hilton-1': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('Not confirmed: the Tech Times article returned an error (HTTP 403) and the campaign\'s policy page opened without readable text, so '
                 'neither the quote nor the limits on new rules could be checked against his own plan.'),
    },
    'cr-ct-gov-fazio-2': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Corrected to his words as WFSB quoted them on Sept. 3, 2026: data centers should "bring their own power if they are to plug into the '
                 'grid"; "or contract for" was not in the report and was removed. WSHU (Sept. 7) reports his opposition to a ban. No campaign '
                 'statement or transcript was found, so Medium.'),
        'unconfirmed': ['An official campaign statement or transcript with his full position.'],
        'extra_sources': [{'title': 'WSHU: Lamont says no to big data centers in CT (Sept. 7, 2026)',
                           'url': 'https://www.wshu.org/connecticut-news/2026-09-07/ct-data-centers-ned-lamont'}],
        'apply': set_fields(text=('Called for ending tax breaks for large data centers and said they should "bring their own power if they are to plug '
                                  'into the grid," with guardrails on the industry. Does not want to ban data centers.')),
    },
    'cr-ct-gov-lamont-1': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: CT Mirror\'s report of Apr. 24, 2024 confirms the 24-12 party-line Senate vote and Lamont\'s objections. His veto '
                 'threat in his own words and the bill\'s end in the House could not be checked on the official record (the 2024 bill history would '
                 'not open).'),
        'unconfirmed': ['A recording or written statement of his veto threat.', 'The bill\'s final disposition in the House.'],
    },
    'cr-ct-gov-lamont-2': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('Not confirmed: the CT News Junkie article would not open on repeated attempts, and no statement of his was found saying AI regulation '
                 'belongs to Congress and the Federal Trade Commission.'),
    },
    'cr-ct-gov-lamont-3': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the governor\'s official transcript of his 2026 State of the State address: "We extended our Millstone nuclear agreement '
                 'and said slow down new data centers, unless they add more generation as well." The address opens the session, which the state '
                 'constitution convenes in February in even years. The transcript is now the source.'),
        'apply': set_fields(source={'title': 'Office of the Governor of Connecticut: 2026 State of the State address (transcript)',
                                    'url': 'https://portal.ct.gov/governor/news/speeches/governor-lamont-2026-state-of-the-state-address'}),
    },
    'cr-ct-gov-lamont-4': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in the governor\'s official bill notification, which lists SB 5 as Public Act 26-15 among bills signed May 27, 2026. The '
                 'enacted text would not open, so the law\'s provisions rest on the Ropes & Gray summary and confidence is Medium.'),
        'unconfirmed': ['The final provisions on automated hiring, consumer chatbots, frontier developers, whistleblowers, provenance and minors.'],
    },
    'cr-ct-gov-lamont-5': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in WSHU\'s Sept. 7, 2026 report, which adds that proposals bringing their own water and electricity could be considered case '
                 'by case, with review by the Public Utilities Regulatory Authority and the final decision left to towns. No transcript was found, '
                 'so Medium.'),
        'apply': set_fields(text=('Said Connecticut is open to IT infrastructure but there is "no place" for massive data centers in the state, because '
                                  'they would raise residents\' electric rates; proposals that bring their own water and electricity could be '
                                  'considered case by case, after review by the Public Utilities Regulatory Authority, with towns deciding.')),
    },
}
