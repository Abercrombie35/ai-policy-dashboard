# Decisions for batch 02, claim by claim, after reading ChatGPT's findings.
# High = primary source with verbatim wording and a confirmed date (a month is
# enough for documents dated only by month). Medium = substance confirmed but
# part rests on a news report, or the date is not confirmed.

DECISIONS = {
    'cr-fr-retailleau-1': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected from his party\'s 56-page plan (Les Républicains, July 2026): about €23 billion gross over five years in total, including about €11.6 billion of new AI investment; the €5 billion figure is the public-administration programme. He had estimated about €25 billion in a July 7 interview. The plan ties sovereign data center capacity to France\'s low-carbon nuclear fleet, so that link is now confirmed.',
        'apply': chain(set_fields(
            text=('His 56-page AI plan (July 2026) costs about €23 billion gross over five years, including about €11.6 billion of new AI '
                  'investment (he had estimated about €25 billion in a July 7 interview). About €5 billion goes to AI in public '
                  'administration: a single assistant for the public ("Marianne"), secure AI assistants for civil servants, 125,000 staff '
                  'redeployed and 125,000 retirements left unfilled. It ties sovereign data center capacity to France\'s low-carbon nuclear '
                  'fleet, favouring sites near existing plants.'),
            publishedDate='2026-07',
            source={'title': 'Les Républicains: L\'IA au service des Français, progrès, souveraineté, vigilance (July 2026)',
                    'url': 'https://republicains.fr/wp-content/uploads/2026/07/LR_IA.pdf'}),
            headline('cr-fr-retailleau-1', '€23 billion AI plan: AI across the state, data centers by nuclear plants')),
    },
    'cr-mi-gov-james-4': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected: he spoke on Oct. 29, 2026 in Bay County (WNEM interview), naming five concerns: local control, water, electricity bills, pollution, and building on brownfields rather than farmland. The phrase "five-part moratorium" was not found and is removed. The quote is confirmed in a news interview, so Medium.',
        'apply': set_fields(
            text=('At an Oct. 29 campaign stop in Bay County, said: "No new data centers until we have a plan to protect our communities," '
                  'naming five concerns: local control, water, electricity bills, pollution, and building on brownfields rather than farmland.'),
            publishedDate='2026-10-29'),
    },
    'cr-mi-sen-rogers-1': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected to two documented statements: his campaign\'s Mar. 20, 2026 endorsement of the White House AI framework, and a Mar. 27 statement to Michigan Advance with the full "competitive for new AI-supported jobs" quotation. Faster permits are Michigan Advance\'s description, not his words, and "for months" is removed.',
        'unconfirmed': ['Faster permits in his own words (Michigan Advance\'s description)'],
        'extra_sources': [{'title': 'Michigan Advance: McMorrow releases plan for Michigan data centers (Mar. 27, 2026, with Rogers\'s statement)',
                           'url': 'https://michiganadvance.com/2026/03/27/mallory-mcmorrow-releases-plan-for-michigan-data-centers-done-right-with-a-focus-on-green-energy/'}],
        'apply': set_fields(
            text=('Endorsed the White House AI framework on Mar. 20, 2026, saying a consistent national framework would "supercharge '
                  'innovation" and "shield communities from higher electric bills". In a Mar. 27 statement to Michigan Advance, said Michigan '
                  'must be "competitive for new AI-supported jobs and investments ... while setting a responsible framework for safety and '
                  'data privacy"; the paper described him as backing faster permits.'),
            publishedDate='2026-03-20', dateNote='Statements of Mar. 20 and Mar. 27, 2026', sortDate=None,
            source={'title': 'Rogers for Senate: Rogers applauds White House AI framework (Mar. 20, 2026)',
                    'url': 'https://rogersforsenate.com/news/rogers-applauds-white-house-ai-framework-that-establishes-global-leadership-and-protects-kids-online'}),
    },
    'ct-2026-sb245': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Confirmed on the legislature\'s record, with the dates made precise: introduced Feb. 19, 2026; last action Mar. 23 (referred to the Finance, Revenue and Bonding Committee); it died when the session ended May 6.',
        'apply': set_fields(
            statusNote='Introduced Feb. 19, 2026; referred to the Finance, Revenue and Bonding Committee on Mar. 23 (last action); died when the session ended May 6.',
            summary=('Would have stopped new applications from July 1, 2026 to the 2021 program offering sales, use and property tax '
                     'exemptions of up to 30 years for data center investments, while keeping existing agreements.'),
            source={'title': 'Connecticut General Assembly: SB 245 (2026) bill history', 'url': 'https://www.cga.ct.gov/2026/cbs/S/pdf/SB-0245.pdf'}),
    },
    'eu-digital-omnibus-ai': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected from the regulation itself: transparency duties did change in part (systems generating synthetic content already on the market before Aug. 2, 2026 have until Dec. 2, 2026 to meet Article 50(2)); the general-purpose AI model timetable is unchanged; the new bans apply from Dec. 2, 2026. Dated July 8, in force July 27, 2026.',
        'apply': set_fields(
            summary=('Delays high-risk AI Act duties (stand-alone systems to Dec. 2, 2027; AI in regulated products to Aug. 2, 2028), bans AI '
                     'systems that generate non-consensual intimate images or child sexual abuse material (from Dec. 2, 2026), and simplifies '
                     'rules for smaller firms. Systems generating synthetic content that were on the market before Aug. 2, 2026 get until '
                     'Dec. 2, 2026 to meet the labelling duty; the timetable for general-purpose AI models is unchanged.'),
            statusNote='Final Council approval June 29, 2026; regulation dated July 8; in force July 27, 2026.',
            source={'title': 'EUR-Lex: Regulation (EU) 2026/1744 (Digital Omnibus on AI)', 'url': 'https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A32026R1744'}),
    },
    'fr-ppl-centres-donnees': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed on the National Assembly\'s record: adopted by the Senate Mar. 25, 2026, filed in the Assembly Mar. 26 as text no. 2584 and referred to its Economic Affairs Committee, with no later examination.',
        'apply': set_fields(
            statusNote=('Adopted by the Senate Mar. 25, 2026; filed in the National Assembly Mar. 26 (text no. 2584) and referred to its '
                        'Economic Affairs Committee, with no later examination. Its "major national interest" article mirrors the May 26, 2026 '
                        'simplification law, which already lets qualifying data centers get that status.'),
            source={'title': 'Assemblée nationale: Proposition de loi visant à encadrer l\'implantation des centres de données (dossier)',
                    'url': 'https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N51569'}),
    },
    # Race-level claim: the race file is updated separately (Ruffin withdrew).
    'fr-president-2027#candidates': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected: François Ruffin withdrew his candidacy on Nov. 22, 2026 (his own announcement); his campaign ran under Debout!. Marine Le Pen is the RN candidate and Jordan Bardella her intended prime minister (Aug. 29). The other parties are confirmed: Philippe (Horizons), Attal (Renaissance), Retailleau (LR), Mélenchon (LFI), Tondelier (Les Écologistes).',
        'unconfirmed': [],
    },
    'mi-sb757-760': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected from the Senate\'s analysis: each bill has its own sponsor (SB 757 Camilleri, SB 758 Hertel, SB 759 Chang, SB 760 Polehanki, all Democrats); SB 760 creates a civil action with a presumption of causation when a chatbot encourages a minor\'s harmful conduct. The listed harms (self-harm, harm to others, disordered eating, drug or alcohol use) are confirmed. All four passed the Senate Apr. 29; no House vote as of Nov. 26.',
        'apply': set_fields(
            sponsors=[{'name': 'Darrin Camilleri', 'party': 'Democratic', 'role': 'SB 757', 'linkedCandidateId': None},
                      {'name': 'Kevin Hertel', 'party': 'Democratic', 'role': 'SB 758', 'linkedCandidateId': None},
                      {'name': 'Stephanie Chang', 'party': 'Democratic', 'role': 'SB 759', 'linkedCandidateId': None},
                      {'name': 'Dayna Polehanki', 'party': 'Democratic', 'role': 'SB 760', 'linkedCandidateId': None}],
            statusNote='All four passed the Senate on Apr. 29, 2026 and went to the House Communications and Technology Committee; no House vote as of Nov. 26.',
            summary=('Would limit minors\' access to AI chatbots and addictive social media feeds. SB 760 would bar chatbot products for minors '
                     'unless they cannot encourage suicide, self-harm, harm to others, disordered eating or drug or alcohol use, and would let '
                     'families sue, with a presumption that the chatbot caused the harm.'),
            source={'title': 'Michigan Senate Fiscal Agency: SB 757-760, summary as passed by the Senate',
                    'url': 'https://legislature.mi.gov/documents/2025-2026/billanalysis/senate/htm/2025-SFA-0757-C.htm'}),
    },
    'pl-d-chips#0': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in Schumer\'s own press conference transcript (Sept. 23, 2026), which now serves as the source.',
        'apply': set_fields(source={'title': 'Senate Democrats: Transcript, Schumer press conference ahead of Trump-Xi meeting (Sept. 23, 2026)',
                                    'url': 'https://www.democrats.senate.gov/news/press-releases/transcript-at-a-press-conference-ahead-of-trump-xi-meeting-leader-schumer-demands-trump-block-chinese-access-to-american-ai-chips-and-manufacturing'}),
    },
    'pl-d-data-centers#2': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected: in Sept. 30, 2026 floor remarks Schumer said Senate Democrats want to make it "mandatory for data centers to cover their own costs by law"; after the election (Nov. 5) he named data center power costs a priority for the next Congress (Reuters, Nov. 6). The claim that Democrats stop short of binding limits was not found and is removed.',
        'unconfirmed': ['A primary transcript of the Nov. 5 remarks (reported by Reuters)'],
        'extra_sources': [{'title': 'Reuters: Democrats planning flood of AI bills when they take control of Congress (Nov. 6, 2026)',
                           'url': 'https://www.reuters.com/business/media-telecom/democrats-planning-flood-ai-bills-when-they-take-control-congress-2026-11-06/'}],
        'apply': set_fields(
            date='2026-09-30',
            summary=('Schumer: Senate Democrats want to make it "mandatory for data centers to cover their own costs by law" (Sept. 30 floor '
                     'remarks); after the election he named data center power costs a priority for the next Congress (Reuters, Nov. 6).'),
            source={'title': 'Senate Democrats: Schumer floor remarks urging Republicans to take real action on AI (Sept. 30, 2026)',
                    'url': 'https://www.democrats.senate.gov/news/press-releases/leader-schumer-floor-remarks-urging-senate-republicans-to-join-democrats-to-take-real-action-on-ai'}),
    },
    'pl-r-workers#0': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected from the plan itself: under "Empower American Workers in the Age of AI" it recommends that the Labor Department use available discretionary funding for rapid retraining and set up an AI Workforce Research Hub; it does not itself fund retraining or open the hub.',
        'apply': set_fields(
            summary=('The AI Action Plan\'s "Empower American Workers in the Age of AI" section recommends that the Labor Department use '
                     'available discretionary funding for rapid retraining of workers displaced by AI and set up an AI Workforce Research Hub; '
                     'it provides no new money.'),
            source={'title': 'The White House: America\'s AI Action Plan (July 23, 2025)', 'url': 'https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf'}),
    },
    'result-ca-governor-2026': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Updated to the Secretary of State\'s Nov. 26, 2026 results file: Becerra 8,740,676 votes (65.7%), Hilton 4,571,042 (34.3%). Still unofficial: certified results are due by Dec. 11.',
        'unconfirmed': ['Certified results (due by Dec. 11, 2026)'],
        'apply': lambda r, h: (
            r['candidates'][0].update({'votes': 8740676, 'votePct': 65.7}),
            r['candidates'][1].update({'votes': 4571042, 'votePct': 34.3}),
            r.update({'figuresAsOf': 'Unofficial results from the California Secretary of State\'s results file, Nov. 26, 2026. Certified results are due by Dec. 11, 2026.',
                      'source': {'title': 'California Secretary of State: Nov. 3, 2026 general election results file (Nov. 26)', 'url': 'https://media.sos.ca.gov/media/V26GG.txt'}})),
    },
}
