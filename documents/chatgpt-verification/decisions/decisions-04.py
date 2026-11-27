# Decisions for batch 04, claim by claim.

DECISIONS = {
    'cr-fr-ruffin-1': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected from the Assembly\'s record: the resolution (no. 3293) was registered on Oct. 13, 2026, not Oct. 8, and is co-signed by individual Ecologist and Communist deputies rather than endorsed by their groups as such. Ruffin withdrew from the presidential race on Nov. 22.',
        'apply': set_fields(
            text=('Filed a resolution in the National Assembly (registered Oct. 13, 2026) calling for a five-year moratorium on "non-sovereign" '
                  'data center projects (foreign developers or end users), co-signed by individual Ecologist and Communist deputies. It also '
                  'attacks the reduced electricity tax that data centers pay.'),
            publishedDate='2026-10-13',
            source={'title': 'Assemblée nationale: Proposition de résolution n° 3293 (moratorium on non-sovereign data centers)',
                    'url': 'https://www.assemblee-nationale.fr/dyn/opendata/PNREANR5L17B3293.pdf'}),
    },
    'cr-mi-gov-benson-1': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in her written testimony to the Senate Rules Committee (Mar. 12, 2024): AI would "amplify and expand exponentially" election disinformation tactics.',
    },
    'cr-mi-gov-james-3': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected attribution: in the Oct. 6 debate he said "My moratorium is local led, not Lansing led" (WDIV); "The moratorium should be imposed on Lansing, not the people" was said to reporters afterwards (Bridge Michigan). Both rest on news reports, so Medium.',
        'extra_sources': [{'title': 'WDIV: Benson, James offer contrasting visions in first Michigan governor debate (Oct. 7, 2026)',
                           'url': 'https://gmg-wdiv-prod.cdn.arcpublishing.com/news/local/2026/10/07/benson-james-offer-contrasting-visions-in-first-michigan-governor-debate/'}],
        'apply': chain(set_fields(
            text=('In the Oct. 6 debate said communities should decide on data centers ("My moratorium is local led, not Lansing led"); '
                  'afterwards he told reporters "The moratorium should be imposed on Lansing, not the people" and ruled out a statewide moratorium.'),
            source={'title': 'Bridge Michigan: Fact check, John James and Jocelyn Benson debate data centers, tariffs and more',
                    'url': 'https://bridgemi.com/michigan-politics/fact-check-john-james-jocelyn-benson-debate-data-centers-tariffs-more/'}),
            headline('cr-mi-gov-james-3', '"My moratorium is local led, not Lansing led"')),
    },
    'cr-mi-sen-elsayed-1': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected: his Jan. 8, 2026 "terms of engagement" (campaign page) require data centers to pay for their own energy, use closed-loop cooling and face penalties if promised local jobs do not appear; the call for federal standards and backing for local and state moratoriums came later (FOX 2 interview, Sept. 15; WCMU, Oct. 1), from news reports, so Medium.',
        'extra_sources': [{'title': 'WCMU: Rogers and El-Sayed disagree on many issues, except data center moratoriums (Oct. 1, 2026)',
                           'url': 'https://www.wcmu.org/local-regional-news/2026-10-01/rogers-and-el-sayed-disagree-on-many-issues-except-data-center-moratoriums'}],
        'apply': set_fields(
            text=('His Jan. 8, 2026 "terms of engagement" for data centers say they "must pay for their own energy demand" (costs cannot be '
                  'passed on to ratepayers), use closed-loop cooling and face penalties if promised local jobs do not appear. By September he '
                  'was calling for federal standards and backing local and state moratoriums until then.'),
            dateNote='Platform of Jan. 8, 2026; federal standards and moratoriums from Sept.-Oct. 2026',
            source={'title': 'El-Sayed campaign: Terms of engagement for data centers (Jan. 8, 2026)', 'url': 'https://abdulforsenate.com/2026/01/datacenters/'}),
    },
    'cr-tx-gov-abbott-2': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Confirmed in his Aug. 3, 2026 letter to the Public Utility Commission and ERCOT. Corrected the criticism: Public Citizen said the pause had no deadline and that projects generating their own power could bypass it; no source said it left out mid-size projects.',
        'extra_sources': [{'title': 'Public Citizen: Abbott\'s latest data center declaration is a faux pause (Aug. 3, 2026)',
                           'url': 'https://www.citizen.org/news/abbotts-latest-data-center-declaration-is-a-faux-pause/'}],
        'apply': set_fields(
            text=('Told state regulators and the grid operator ERCOT, in an Aug. 3, 2026 letter, to stop approving new data center grid '
                  'connections until all data centers in the queue have been verified and audited for electricity and water use. Critics '
                  '(Public Citizen) said the pause had no deadline and that projects generating their own power could bypass it.'),
            publishedDate='2026-08-03',
            source={'title': 'Office of the Texas Governor: letter to the PUC chairman and ERCOT CEO on data centers (Aug. 3, 2026)',
                    'url': 'https://gov.texas.gov/uploads/files/press/Thomas_Gleeson_Pablo_Vegas_Data_Centers_Directive_Letter_to_PUCT_ERCOT_August_2026_.pdf'}),
    },
    'cr-tx-sen-paxton-2': {
        'result': 'corrected', 'confidence': 'medium',
        'note': 'Corrected the date to Aug. 24, 2026, when the Texas Tribune reported the plan (Aug. 25 was a later report). The plan\'s content is confirmed in contemporaneous reporting; his own post would not open, so Medium.',
        'apply': set_fields(
            publishedDate='2026-08-24',
            source={'title': 'Texas Tribune: Paxton promises to ban Chinese technology and chatbots that endanger children in data center platform (Aug. 24, 2026)',
                    'url': 'https://www.texastribune.org/2026/08/24/ken-paxton-james-talarico-data-centers-senate-texas/'}),
    },
    'cr-tx-sen-talarico-3': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': 'Confirmed in the Texas Tribune\'s direct quotation from his July 22, 2026 Austin news conference (federal minimum standards, local approval, developers paying grid costs); the video would not open, so Medium.',
    },
    'ct-2026-hb5926': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed on the legislature\'s bill history: Rep. Brandon Chafee\'s 2025 bill was referred to the Energy and Technology Committee on Jan. 22, 2025 and expired when the session adjourned June 4, 2025.',
        'apply': set_fields(
            summary='Would add a surcharge on electricity used by data centers to offset the public-benefits charge on household bills.',
            source={'title': 'Connecticut General Assembly: HB 5926 (2025) bill history', 'url': 'https://cga.ct.gov/2025/cbs/H/pdf/HB-5926.pdf'}),
    },
    'ct-sb1292': {
        'result': 'corrected', 'confidence': 'high',
        'note': 'Corrected the end date: after the committee\'s 24-0 vote (Mar. 18, 2025) the bill reached the Senate calendar on Apr. 7 (Calendar No. 303) and expired without a floor vote when the session adjourned June 4, 2025.',
        'apply': set_fields(
            statusDate='2025-06-04',
            statusNote=('Turned into a study of energy efficiency standards for AI data centers and approved by the Energy and Technology '
                        'Committee 24-0 on Mar. 18, 2025; placed on the Senate calendar Apr. 7 and expired without a floor vote when the session '
                        'adjourned June 4, 2025.'),
            source={'title': 'Connecticut General Assembly: SB 1292 (2025) bill history', 'url': 'https://www.cga.ct.gov/2025/cbs/S/pdf/SB-1292.pdf'}),
    },
    'fr-pjl-simplification': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed on the Senate\'s legislative record: Law no. 2026-403 of May 26, 2026 (Journal officiel, May 27), after the Constitutional Council\'s May 21 ruling; its Article 35 extends fast-track siting and grid connection to qualifying data centers designated by decree and allows permits to be refused in water-stressed areas.',
        'apply': set_fields(
            billNumber='Law no. 2026-403 of May 26, 2026',
            summary=('Among many simplification measures, lets data centers that meet set conditions be designated projects of major national '
                     'interest by decree, which speeds up siting and grid connection (Article 35), while allowing permits to be refused in '
                     'water-stressed areas.'),
            source={'title': 'Sénat: Simplification de la vie économique, dossier législatif', 'url': 'https://www.senat.fr/dossier-legislatif/pjl23-550.html'}),
    },
    'mi-hb4047-4048': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed on the official public acts: HB 4047 (Rep. Matt Bierlein, R) created civil remedies and criminal penalties for non-consensual intimate deepfakes; HB 4048 (Rep. Penelope Tsernoglou, D) added sentencing guidelines; both took effect Aug. 26, 2025.',
        'apply': set_fields(
            sponsors=[{'name': 'Matt Bierlein', 'party': 'Republican', 'role': 'HB 4047', 'linkedCandidateId': None},
                      {'name': 'Penelope Tsernoglou', 'party': 'Democratic', 'role': 'HB 4048', 'linkedCandidateId': None}],
            statusNote='Signed and effective Aug. 26, 2025 (Public Acts 11 and 12 of 2025).',
            summary='Add a civil cause of action and criminal penalties for non-consensual intimate deepfakes (HB 4047), with sentencing guidelines (HB 4048).',
            source={'title': 'Michigan Legislature: Public Act 11 of 2025 (HB 4047)', 'url': 'https://legislature.mi.gov/documents/2025-2026/publicact/pdf/2025-PA-0011.pdf'}),
    },
    'pl-d-chips#1': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed in the Senate Democrats\' release of Schumer\'s Nov. 10, 2026 floor remarks, which now serves as the source.',
        'apply': set_fields(source={'title': 'Senate Democrats: Schumer floor remarks on Trump\'s defense of Nvidia CEO Jensen Huang (Nov. 10, 2026)',
                                    'url': 'https://www.democrats.senate.gov/newsroom/press-releases/leader-schumer-floor-remarks-on-trumps-troubling-defense-of-nvidia-ceo-jensen-huang-at-the-cost-of-american-national-security'}),
    },
}
