# Decisions for batch 10, claim by claim (all party-line evidence).
#
# After the import, the tracking parameters ChatGPT's links carried (bis.gov "?api_key=...", whitehouse.gov "?trk=...")
# were stripped from the check sources in verification.json; the evidence itself cites the clean links below.

BIS_H200 = {'title': 'Bureau of Industry and Security: Commerce revises license review policy for semiconductors exported to China (Jan. 13, 2026)',
            'url': 'https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china'}
WH_PERMITTING = {'title': 'White House fact sheet: President Trump accelerates federal permitting of data center infrastructure (July 23, 2025)',
                 'url': 'https://www.whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-accelerates-federal-permitting-of-data-center-infrastructure/'}

DECISIONS = {
    'pl-d-harmful#0': {
        'result': 'corrected', 'confidence': 'high',
        'note': ('Confirmed in Sen. Cruz\'s release: the Take It Down Act was introduced by Sens. Ted Cruz (R) and Amy Klobuchar (D). Clarified that '
                 'May 19, 2025 is the date it was signed into law, not introduced.'),
        'apply': set_fields(summary=('The Take It Down Act, introduced by Sens. Ted Cruz (R) and Amy Klobuchar (D), passed the Senate unanimously and '
                                     'was signed into law May 19, 2025.')),
    },
    'pl-d-preemption#1': {
        'result': 'corrected', 'confidence': 'high',
        'note': ('Corrected the date: Sen. Ed Markey\'s release shows he introduced the States\' Right to Regulate AI Act on Dec. 17, 2025, two days '
                 'before the Axios report, with Democratic cosponsors and Sen. Bernie Sanders. Sen. Schatz\'s own action against the order could not '
                 'be confirmed and was removed. Markey\'s release is now the source.'),
        'apply': set_fields(
            date='2025-12-17',
            summary=('Sen. Ed Markey introduced the States\' Right to Regulate AI Act to block Trump\'s executive order against state AI laws, with '
                     'Democratic cosponsors and Sen. Bernie Sanders.'),
            source={'title': 'Sen. Ed Markey: Legislation to block Trump\'s executive order blocking state AI regulation (Dec. 17, 2025)',
                    'url': 'https://www.markey.senate.gov/news/press-releases/senator-markey-introduces-legislation-to-block-trumps-executive-order-blocking-state-ai-regulation'}),
    },
    'pl-d-safety#0': {
        'result': 'corrected', 'confidence': 'high',
        'note': ('Confirmed in Jeffries\' Dec. 9, 2025 release: the commission and its twin aims, American companies continuing "to thrive" and '
                 'protection against AI harms. Corrected: "an aggressive framework" is not in the release and was removed.'),
        'apply': set_fields(summary=('Jeffries created the House Democratic Commission on AI and the Innovation Economy, balancing American companies\' '
                                     'ability to "continue to thrive" with protecting people from AI\'s harms.')),
    },
    'pl-d-safety#1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in the Senate Democrats\' release: Schumer demanded an immediate classified briefing for all senators on frontier-model '
                 'testing, potentially catastrophic risks and safeguards. The release is undated; the September 2026 date rests on news reports, so Medium.'),
        'unconfirmed': ['The release date (September 2026, from news reports).'],
    },
    'pl-d-safety#2': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in Reuters\' Nov. 6, 2026 report on Democrats\' plans, including "requiring independent testing of advanced AI systems and '
                 'clarifying when AI companies can be held liable". No bill text exists yet, so it rests on the report (Medium). Reuters is now the source.'),
        'apply': set_fields(source={'title': 'Reuters: Democrats planning flood of AI bills when they take control of Congress (Nov. 6, 2026)',
                                    'url': 'https://www.reuters.com/business/media-telecom/democrats-planning-flood-ai-bills-when-they-take-control-congress-2026-11-06/'}),
    },
    'pl-d-workers#0': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in Jeffries\' Dec. 9, 2025 release, which sets up the commission and its remit. That no framework had been released by late '
                 'November 2026 cannot be shown from a single source, so Medium.'),
        'unconfirmed': ['That the commission had not released a framework by Nov. 26, 2026.'],
    },
    'pl-r-chips#0': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Corrected: Nvidia\'s July 2025 announcement says the government assured it that H20 export licenses would be granted and that it hoped '
                 'to start deliveries soon; it does not show that sales had resumed. The April 2025 halt was not checked on a government record, so Medium. '
                 'Nvidia\'s announcement is now the source.'),
        'unconfirmed': ['The exact date of the April 2025 restriction, from a government record.'],
        'apply': set_fields(
            summary=('After halting Nvidia H20 exports to China in April 2025, the administration told Nvidia in July 2025 that export licenses would be '
                     'granted; Nvidia said it hoped to start deliveries soon.'),
            source={'title': 'Nvidia: CEO Jensen Huang promotes AI in Washington, D.C. and China (July 2025)', 'url': 'https://blogs.nvidia.com/blog/nvidia-ceo-promotes-ai-in-dc-and-china/'}),
    },
    'pl-r-chips#1': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Confirmed in the Bureau of Industry and Security\'s Jan. 13, 2026 release: license applications for the Nvidia H200, AMD MI325X and '
                 'similar chips are reviewed case by case, following the president\'s Dec. 8, 2025 announcement. Corrected: the 25% share is collected '
                 'through a separate semiconductor tariff, not a fee in the licensing rule (per legal analysis, so Medium); the date is now that of the '
                 'BIS release.'),
        'unconfirmed': ['The rule\'s Jan. 15, 2026 publication or effective date, from the Federal Register.', 'How the 25% share is collected, from a primary record.'],
        'apply': set_fields(
            date='2026-01-13',
            summary=('Commerce began reviewing licenses to export Nvidia H200, AMD MI325X and similar chips to China case by case, carrying out the '
                     'president\'s December 2025 decision; the government\'s 25% share is collected through a separate tariff, not a license fee.'),
            source=BIS_H200),
    },
    'pl-r-data-centers#0': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the White House fact sheet of July 23, 2025: expedited permitting for qualifying data center projects under FAST-41 and '
                 'federal sites, including Defense Department land, for the infrastructure. The fact sheet is now the source.'),
        'apply': set_fields(source=WH_PERMITTING),
    },
    'pl-r-data-centers#1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed on the White House\'s pledge page: companies commit to cover the added power and infrastructure costs of new data centers '
                 'and "will voluntarily negotiate new, separate rate structures"; contemporaneous reports describe it as nonbinding. Its introduction '
                 'in the Feb. 24 State of the Union was not checked against a transcript, so Medium. The pledge page is now the source.'),
        'unconfirmed': ['Its introduction in the Feb. 24, 2026 State of the Union, from a transcript.'],
        'apply': set_fields(
            summary=('Ratepayer Protection Pledge, introduced in the State of the Union: large AI companies commit to cover the added power and grid costs '
                     'of their new data centers and to negotiate separate rate structures. The pledge is voluntary and not binding.'),
            source={'title': 'White House: Ratepayer Protection Pledge (March 2026)', 'url': 'https://www.whitehouse.gov/releases/2026/03/ratepayer-protection-pledge/'}),
    },
    'pl-r-data-centers#2': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in The Spokesman-Review\'s Aug. 31, 2026 report quoting both lines of his post; the original post could not be read, so Medium.'),
    },
    'pl-r-data-centers#3': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in Reuters\' Nov. 9, 2026 report, which quotes his post ("Remember, China will take any Data Center that we don\'t want, and pay '
                 'lots of money for it") and his backing for the permitting bill; the original post could not be read, so Medium. Reuters is now the source.'),
        'apply': set_fields(
            summary=('Trump urged the Senate to pass a permitting bill that he said codifies his Ratepayer Protection Pledge, adding "Remember, China will '
                     'take any Data Center that we don\'t want, and pay lots of money for it."'),
            source={'title': 'Reuters: US Congress gets first post-Blue Wave crack at data centers with permitting bill (Nov. 9, 2026)',
                    'url': 'https://www.reuters.com/legal/litigation/us-congress-gets-first-post-blue-wave-crack-data-centers-with-permitting-bill-2026-11-09/'}),
    },
}
