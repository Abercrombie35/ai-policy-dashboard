# Decisions for batch 01, claim by claim, after reading ChatGPT's findings.
# High = primary source with verbatim wording and a confirmed date.
# Medium = substance confirmed in the primary source but the date is not, or
# confirmed only through a news report.

FR_TONDELIER_PROG = {'title': 'Les Écologistes: Pour une prospérité écologique, programme 2027 (July 2026)',
                     'url': 'https://static1.squarespace.com/static/68b9a0c719c7a969b63b8a1a/t/6a967e020e8d32388db78eec/1788247554101/Programme%2B2027.pdf'}

DECISIONS = {
    'cr-fr-tondelier-1': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected attribution and date: the position comes from her party\'s 2027 programme (Les Écologistes, July 2026, p. 82), which calls for impact assessments of data centers and for planning their electricity use nationally and by territory, citing competing uses, drinking water and land. No personal statement by Tondelier on Oct. 5 was found.',
        'apply': chain(set_fields(
            text=('Her party\'s 2027 programme (Les Écologistes, July 2026) calls for assessing the impact of data centers and for planning '
                  'their electricity use nationally and by territory, to anticipate conflicts with other uses, drinking water and land.'),
            kind='position', publishedDate='2026-07', dateNote=None, sortDate=None, source=FR_TONDELIER_PROG,
            stances={'data-centers': 'conditional'}, categories=['dc-water-environment', 'dc-transparency']),
            lambda r, h: r['coding'].update({'specificity': 'concrete-proposal', 'instruments': ['disclosure']}),
            headline('cr-fr-tondelier-1', "Assess data centers' impact; plan their electricity use")),
    },
    'cr-fr-tondelier-2': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected wording and attribution: her party\'s digital policy paper (Les Écologistes, July 2026, p. 27) favors "smaller, specialized models open to inspection" rather than a handful of giant, opaque systems; it does not say "open-source".',
        'apply': chain(set_fields(
            text=('Her party\'s digital policy paper (Les Écologistes, July 2026) favors "smaller, specialized models open to inspection" '
                  'rather than a handful of giant, opaque systems.'),
            publishedDate='2026-07', dateNote=None, sortDate=None,
            source={'title': 'Les Écologistes: Technodiversités, reprendre la main sur le numérique (July 2026)',
                    'url': 'https://lesecologistes.fr/document/3NmF2env1NMUuFuPynpd5t/livretnumerique.pdf'}),
            headline('cr-fr-tondelier-2', 'Smaller, specialized AI models open to inspection')),
    },
    'ca-2026-sb1168': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected: SB 1168 ("Data centers: rate structures", Chapter 440 of 2026) requires the Public Utilities Commission to assess rate structures for the rate impacts of data centers; it does not itself charge data centers more when demand spikes.',
        'apply': set_fields(
            title='Data centers: rate structures',
            summary=('Requires the Public Utilities Commission to assess options for rate structures that address the rate impacts of data '
                     'centers (grid costs, buying power to serve added load, pressure on household rates). It does not itself set prices.'),
            statusNote='Signed Sept. 21, 2026 (Chapter 440 of 2026).',
            source={'title': 'California Senate: Summary of chaptered and vetoed legislation, 2026', 'url': 'https://sfa.senate.ca.gov/system/files/2026-11/sig-leg-2026-final.pdf'}),
    },
    'ca-2026-sb886': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected sponsors: SB 886 is by Sens. Steve Padilla and Jerry McNerney (both D). Signed Sept. 21, 2026 as Chapter 438; takes effect Jan. 1, 2027, with tariffs due by Jan. 1, 2028.',
        'apply': set_fields(
            sponsors=[{'name': 'Steve Padilla', 'party': 'Democratic', 'role': 'author', 'linkedCandidateId': None},
                      {'name': 'Jerry McNerney', 'party': 'Democratic', 'role': 'author', 'linkedCandidateId': None}],
            sponsorsNote=None, statusNote='Signed Sept. 21, 2026 (Chapter 438); takes effect Jan. 1, 2027; tariffs due by Jan. 1, 2028.'),
    },
    'cr-ca-gov-becerra-2': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': 'Confirmed on his campaign\'s AI page, which now serves as the source: data centers powered with clean energy, covering their own energy costs and meeting environmental disclosure rules, in return for policy certainty. The page is undated, so the Aug. 15 date is not confirmed.',
        'unconfirmed': ['Aug. 15, 2026 as the date of the statement'],
        'apply': set_fields(
            text=('His campaign\'s AI plan says data centers should be powered with clean energy, cover the costs of their own energy needs '
                  'and meet environmental disclosure requirements, in return for policy certainty for the industry.'),
            publishedDate=None, dateNote='Campaign AI plan (page undated; reported Aug. 15, 2026)', sortDate='2026-08',
            source={'title': 'Becerra campaign: Artificial Intelligence', 'url': 'https://www.xavierbecerra2026.com/priorities/ai/'}),
    },
    'cr-ca-gov-hilton-2': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected: in interviews (PBS Political Breakdown, Sept. 4, 2026; KQED) Hilton backs more electricity generation so data center demand is "less of an issue" and siting data centers farther from homes; no statement giving localities the decision was found, so that is removed. Easier permits are attributed to him only by a policy analyst.',
        'unconfirmed': ['Easier data center permits in his own words (reported via a policy analyst)'],
        'apply': chain(set_fields(
            text=('Wants more electricity generation so that data center demand "would be less of an issue", and data centers sited farther '
                  'from homes to limit noise. A policy analyst describes his plan as easing data center permits.'),
            publishedDate='2026-09-04', dateNote=None, sortDate=None,
            source={'title': 'PBS (KQED Political Breakdown): Steve Hilton\'s strategy to win over California', 'url': 'https://www.pbs.org/video/steve-hiltons-strategy-to-win-over-california-uxhykl/'}),
            headline('cr-ca-gov-hilton-2', 'More power generation; data centers sited away from homes')),
    },
    'cr-ca-gov-hilton-3': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected to his words in the Sept. 30, 2026 CNN debate: "an immediate pause on AI in the classroom", citing "cognitive stunting", with a call for a thoughtful evaluation. A formal safety review as the condition, and opposition to a particular state AI tool, were not found and are removed.',
        'apply': chain(set_fields(
            text=('In the Sept. 30 debate, called for "an immediate pause on AI in the classroom", citing concerns about "cognitive stunting" '
                  'in children\'s learning, and has called for a thoughtful evaluation.'),
            publishedDate='2026-09-30', dateNote=None, sortDate=None,
            source={'title': 'CNN transcript: California governor debate (Sept. 30, 2026)', 'url': 'https://prod.transcripts.cnn.com/show/skc/date/2026-09-30/segment/01'}),
            headline('cr-ca-gov-hilton-3', 'Immediate pause on AI in classrooms')),
    },
    'cr-ct-house04-himes-2': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in the Brookings transcript of the Oct. 21, 2026 event, which now serves as the source.',
        'apply': set_fields(
            text=('At the same event, said of claims that China and others were stoking opposition to U.S. data centers: "I don\'t know if '
                  'that\'s true, but it has a credible feeling to it."'),
            dateNote='Said at a Brookings event on Oct. 21, 2026.',
            source={'title': 'Brookings: AI on the Ballot, data centers and the 2026 midterms (transcript, Oct. 21, 2026)',
                    'url': 'https://www.brookings.edu/wp-content/uploads/2026/10/aiet_20261021_ai_midterms_transcript.pdf'}),
    },
    'cr-fr-attal-1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': 'Confirmed on his campaign\'s AI programme page, which now serves as the source: mastery of the whole AI chain, AI training as "a new form of literacy", and AI among his four priorities. The page is undated, so the Oct. 5 date is not confirmed.',
        'unconfirmed': ['Oct. 5, 2026 as the date'],
        'apply': set_fields(publishedDate=None, dateNote='Campaign programme page (undated; reported Oct. 5, 2026)', sortDate='2026-10',
                            source={'title': 'Attal campaign: Gabriel Attal et l\'IA, souveraineté et formation', 'url': 'https://attalpresident.fr/programme/intelligence-artificielle'}),
    },
    'cr-fr-bardella-1': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected: only his description of AI as a major question of national sovereignty is kept, as reported by AFP; the claim that the RN has few AI measures focused on taxing Big Tech was not confirmed and is removed. Marine Le Pen, not Bardella, is the RN candidate; Bardella is her intended prime minister (RTL, Aug. 29, 2026).',
        'unconfirmed': ['His wording in a primary source (reported by AFP only)'],
        'extra_sources': [{'title': "Fortuneo (AFP): Guerre de l'IA, souveraineté: la suspension d'Anthropic s'invite dans la présidentielle française",
                           'url': 'https://bourse.fortuneo.fr/actualites-amp/-guerre-de-l-ia-souverainete-la-suspension-d-anthropic-s-invite-dans-la-presidentielle-francaise-5175598'}],
        'apply': chain(set_fields(
            text='Called AI "a major question of national sovereignty", as reported by AFP.',
            publishedDate=None, dateNote='Reported by AFP during the 2026 campaign', sortDate='2026-10',
            source={'title': "Fortuneo (AFP): Guerre de l'IA, souveraineté: la suspension d'Anthropic s'invite dans la présidentielle française",
                    'url': 'https://bourse.fortuneo.fr/actualites-amp/-guerre-de-l-ia-souverainete-la-suspension-d-anthropic-s-invite-dans-la-presidentielle-francaise-5175598'}),
            headline('cr-fr-bardella-1', 'AI is a major question of national sovereignty')),
    },
    'cr-fr-melenchon-2': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected attribution: the public digital and AI hub and the comparison with energy, transport and telecoms come from LFI\'s parliamentary groups (June 1, 2026); Mélenchon\'s own 2027 programme proposes a public cloud of interconnected public data centers.',
        'extra_sources': [{'title': 'Mélenchon 2027 programme, chapter 7', 'url': 'https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre7/'}],
        'apply': chain(set_fields(
            text=('His movement\'s parliamentary groups (June 1, 2026) proposed "a large public hub for digital technology and AI" and '
                  'described data centers, computing and cloud as infrastructure as strategic as energy, transport and telecoms; his own '
                  '2027 programme proposes a public cloud of interconnected public data centers.'),
            publishedDate='2026-06-01', dateNote=None, sortDate=None,
            source={'title': 'La France insoumise: Choose France, Macron transforme la France en colonie numérique des géants de l\'IA (June 1, 2026)',
                    'url': 'https://lafranceinsoumise.fr/2026/06/01/choose-france-macron-transforme-la-france-en-colonie-numerique-des-geants-mondiaux-de-lia/'}),
            headline('cr-fr-melenchon-2', 'A public digital and AI hub; a public cloud of public data centers')),
    },
    'cr-fr-philippe-1': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected to his campaign plan (archived Sept. 26, 2026): a sovereign European AI infrastructure doubling "our" computing capacity in five years, 40,000 to 100,000 engineers a year, a right to retraining for threatened occupations, and support for champions such as Mistral through a "Buy European Tech Act" and joint purchasing by EU member states. Purchasing by French local authorities was not found and is removed.',
        'apply': chain(set_fields(
            text=('AI plan: build a sovereign European AI infrastructure that doubles "our" computing capacity in five years, raise the '
                  'number of engineers trained each year from 40,000 to 100,000, create a right to retraining for threatened occupations, '
                  'and back European champions such as Mistral through a "Buy European Tech Act" and joint purchasing by EU member states.'),
            publishedDate=None, dateNote='In his campaign plan by Sept. 26, 2026 (archived copy)', sortDate='2026-09',
            source={'title': 'Philippe campaign: Pour une France plus conquérante (archived Sept. 26, 2026)',
                    'url': 'https://web.archive.org/web/20260926113413/https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante'}),
            headline('cr-fr-philippe-1', 'Double AI computing power in Europe; 100,000 engineers a year; a right to retraining')),
    },
}
