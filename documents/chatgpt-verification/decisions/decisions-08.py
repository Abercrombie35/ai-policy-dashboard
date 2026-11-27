# Decisions for batch 08, claim by claim.

TALARICO_PLATFORM = {'title': 'Talarico campaign: Social media, AI and tech', 'url': 'https://jamestalarico.com/issue/social-media-artificial-intelligence-tech/'}

DECISIONS = {
    'cr-tx-gov-abbott-3': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: his Sept. 21, 2026 release directing the TCEQ to halt data center permits says he will work with the Legislature '
                 'next session to eliminate financial incentives for data centers (added). The Oct. 14 interview, the call to write every restriction '
                 'into law and more local say over siting rest on the Texarkana Gazette, which would not open.'),
        'unconfirmed': ['The Oct. 14, 2026 statement.', 'Giving cities, counties and residents more authority over siting.',
                        'A commitment to write every administrative restriction into law.'],
        'apply': set_fields(
            text=('Said he wants the Legislature to write his data center restrictions into law in 2027 and to give cities, counties and residents more '
                  'authority over where data centers are built. His Sept. 21 release directing the state environmental agency (TCEQ) to halt data '
                  'center permits said he would work with the Legislature to eliminate financial incentives for data centers.'),
            dateNote='Interview reported Oct. 14, 2026; release of Sept. 21'),
    },
    'cr-tx-gov-hinojosa-1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed on her campaign\'s July 2026 release: an immediate moratorium until a legislative session puts protections in place, '
                 'union jobs, local participation, ending subsidies, protecting residents\' water and electricity costs and stopping data center '
                 'companies from using NDAs. "Just words" rests on FOX 4\'s report and is now attributed to it, so Medium.'),
        'unconfirmed': ['Her description of Gov. Abbott\'s pause as "just words" (FOX 4).'],
        'apply': set_fields(
            text=('Pledged an immediate moratorium on new data centers until the Legislature puts protections in place, an end to data center '
                  'subsidies and a local say over projects. Goals include American union jobs, transparency (no NDAs for data center companies), '
                  'data centers paying for themselves and protecting Texans\' water and electricity costs. FOX 4 reported she called Gov. Abbott\'s '
                  'pause "just words".'),
            dateNote='Campaign release of July 2026 and later campaign stops'),
    },
    'cr-tx-gov-hinojosa-2': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Corrected the quote: Reuters\' report of her Nov. 5, 2026 CNN interview has her saying "We will have laws to protect Texans, and we '
                 'need to stop what we are doing with data centers until we have those protections." The line "It is not that I hate data centers" '
                 'could not be confirmed from the opened report or a recording and was removed. Rests on a news report, so Medium.'),
        'unconfirmed': ['A recording or transcript of the CNN interview.'],
        'apply': set_fields(
            text=('As governor-elect, told CNN the state will have laws to shield residents from data centers and that new projects should pause until '
                  'then: "We will have laws to protect Texans, and we need to stop what we are doing with data centers until we have those protections."'),
            source={'title': 'Reuters (via Investing.com): Texas governor-elect says state will have laws to shield citizens from data centers (Nov. 5, 2026)',
                    'url': 'https://www.investing.com/news/economy-news/texas-governorelect-says-state-will-have-laws-to-shield-citizens-from-data-centers-5006141'}),
    },
    'cr-tx-sen-paxton-1': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the attorney general\'s releases: the Aug. 18, 2025 investigation of Meta AI Studio and Character.AI for possible '
                 'deceptive trade practices and misleadingly marketing themselves as mental health tools, and the Sept. 18, 2024 settlement with '
                 'Pieces Technologies over allegedly misleading health care AI claims. The releases are now the source; the companies are named.'),
        'extra_sources': [{'title': 'Texas Attorney General: Settlement in first-of-its-kind health care generative AI investigation (Sept. 18, 2024)',
                           'url': 'https://www.texasattorneygeneral.gov/news/releases/attorney-general-ken-paxton-reaches-settlement-first-its-kind-healthcare-generative-ai-investigation'}],
        'apply': set_fields(
            text=('As Texas attorney general, opened an investigation into Meta AI Studio and Character.AI for possible deceptive trade practices and '
                  'for misleadingly marketing themselves as mental health tools. In Sept. 2024 he reached a settlement with Pieces Technologies, a '
                  'generative-AI health care company, over allegedly misleading claims.'),
            source={'title': 'Texas Attorney General: Paxton investigates Meta and Character.AI for misleading children with deceptive AI-generated mental health services (Aug. 18, 2025)',
                    'url': 'https://www.texasattorneygeneral.gov/news/releases/attorney-general-ken-paxton-investigates-meta-and-characterai-misleading-children-deceptive-ai'}),
    },
    'cr-tx-sen-talarico-1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed on his campaign platform ("Protect workers from invasive AI surveillance in the workplace"), which also calls for corporate '
                 'accountability, worker participation, human review of major employment decisions and applying ordinary copyright law to AI '
                 'companies. The page is undated, so Medium.'),
        'unconfirmed': ['When the platform was published.'],
    },
    'cr-tx-sen-talarico-2': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Corrected: his campaign platform ("Establish an AI Dividend") does give details: a tax on AI-attributable profits funding annual '
                 'dividends to Americans and grants for entrepreneurs. The tax rate and eligibility rules are not given, and whether these details '
                 'were in his first statement is unknown. The platform is undated, so Medium; it is now the source.'),
        'unconfirmed': ['The tax rate, eligibility rules and how it would be administered.',
                        'Whether these details were in his first statement (Austin American-Statesman).'],
        'apply': set_fields(
            text=('Proposed an "AI dividend": a tax on AI-attributable profits that would fund annual dividends to Americans and grants for '
                  'entrepreneurs. The tax rate and eligibility rules are not specified.'),
            dateNote='First proposed in Aug. 2026 (Austin American-Statesman); details from the current campaign platform',
            source=TALARICO_PLATFORM),
    },
    'ct-2024-sb2': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed, with the status date corrected: Apr. 24, 2024 was the Senate\'s 24-12 vote (CT Mirror), not the day the bill failed; it died when the '
                 'session ended on May 8, 2024 (the Wednesday after the first Monday in May, as the state constitution sets for even years). '
                 'Maroney as sponsor and Lamont\'s objections are confirmed in the report; the House outcome and veto threat could not be checked on '
                 'the official record, which would not open, so Low.'),
        'unconfirmed': ['The bill\'s final disposition in the House, from the official record.', 'The veto threat, from a primary record.'],
        'apply': set_fields(statusDate='2024-05-08',
                            statusNote='Passed the Senate 24-12 on Apr. 24, 2024; never called for a House vote and died when the session ended May 8.'),
    },
    'ct-2025-sb2': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('Not confirmed: the legislature\'s bill history would not open on repeated attempts, so the Senate vote, the House outcome, the veto '
                 'threat and the date the bill died are unchecked against the official record.'),
    },
    'ct-2026-sb5': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Corrected: the governor\'s official bill notification lists SB 5 as Public Act 26-15, signed May 27, 2026 (the alternative June 2 date '
                 'was removed). Its formal title is "An Act Concerning Online Safety"; "CART Act" is the name used by the legislature\'s AI Caucus '
                 '(Ropes & Gray). The vote counts, full sponsor list and provisions rest on secondary summaries, so Medium.'),
        'unconfirmed': ['The complete sponsor list.', 'The Senate 32-4 and House 131-17 votes, from the roll calls.',
                        'Every provision and start date, against the enacted text.'],
        'extra_sources': [{'title': 'Ropes & Gray: Connecticut enacts sweeping AI law covering employment, healthcare and online safety',
                           'url': 'https://www.ropesgray.com/en/insights/alerts/2026/06/connecticut-enacts-sweeping-ai-law-covering-employment-healthcare-and-online-safety'}],
        'apply': set_fields(title='An Act Concerning Online Safety (the "CART Act")',
                            statusNote='Passed the Senate 32-4 and the House 131-17; signed May 27, 2026.'),
    },
    'ct-2027-duff-moratorium': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in WFSB\'s Oct. 22, 2026 report: Duff proposes to "pause new data centers until the state sets rules for power use, '
                 'electricity costs, and environmental protections"; it also reports East Lyme\'s local ban. No statement of his own was found, so '
                 'Medium.'),
        'unconfirmed': ['A statement of his own placing the bill in the 2027 session.', 'Whether the bill has been filed.'],
        'apply': set_fields(summary=('Senate Majority Leader Bob Duff proposes to pause new data centers until the state sets rules for power use, '
                                     'electricity costs and environmental protections, with a bill planned for the 2027 session. Some towns, such as '
                                     'East Lyme, have passed local bans.')),
    },
    'eu-ai-act': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed on EUR-Lex\'s official summary of Regulation (EU) 2024/1689: a risk-based framework with requirements for high-risk AI '
                 'systems, phased application and enforcement by national authorities. The summary reflects the 2026 amendment that moved the '
                 'high-risk dates (added).'),
        'extra_sources': [{'title': 'EUR-Lex: Regulation (EU) 2024/1689 (Artificial Intelligence Act)', 'url': 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj'}],
        'apply': set_fields(statusNote='In force since Aug. 1, 2024; obligations apply in phases, and a 2026 amendment moved the dates for high-risk systems.'),
    },
    'fr-nuclear-ai-pledge': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: the Élysée\'s AI Action Summit document (Feb. 2025) describes a France-UAE AI campus of up to one gigawatt, but '
                 'not a gigawatt of nuclear power set aside for AI; that rests on TechRadar\'s pre-summit report and is now attributed to it. '
                 'Macron\'s March 2026 remark linking nuclear plants to new data centers was not found in an opened source.'),
        'unconfirmed': ['A pledge reserving one gigawatt of nuclear power for AI.',
                        'Macron\'s March 2026 statement linking nuclear plants to opening data centers.'],
        'apply': set_fields(summary=('Before the February 2025 AI Action Summit, France was reported to be pledging a gigawatt of nuclear power for AI '
                                     'computing (TechRadar); the Élysée\'s summit document lists a France-UAE AI campus of up to one gigawatt. In March '
                                     '2026 President Macron reportedly said France\'s nuclear plants let it open data centers and grow its computing '
                                     'capacity.')),
    },
}
