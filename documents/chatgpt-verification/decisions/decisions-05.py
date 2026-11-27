# Decisions for batch 05, claim by claim.

GOV_0930_2026 = {'title': 'Office of the Governor of California: Governor Newsom signs more first-in-the-nation AI worker protections (Sept. 30, 2026)',
                 'url': 'https://www.gov.ca.gov/2026/09/30/californias-nation-leading-ai-framework-just-got-stronger-governor-newsom-signs-more-first-in-the-nation-worker-protections-and-more/'}
GOV_UPDATE_101325 = {'title': 'Office of the Governor of California: Legislative update 10.13.25 (signed and vetoed bills)',
                     'url': 'https://www.gov.ca.gov/2025/10/13/governor-newsom-issues-legislative-update-10-13-25/'}


def sponsor(name, party='Democratic', role='sponsor'):
    return [{'name': name, 'party': party, 'role': role, 'linkedCandidateId': None}]


DECISIONS = {
    'pl-d-data-centers#1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in the NOTUS report (Sept. 3, 2026): "Jeffries and other House Democratic leaders remain skeptical of a ban", '
                 'and it quotes Jeffries on rising electricity and water bills. No transcript of his remarks was found, so the evidence rests on news reporting.'),
        'apply': set_fields(summary=('Jeffries and other House Democratic leaders remain skeptical of a data center ban (NOTUS); '
                                     'Jeffries framed the issue around rising electricity and water bills.')),
    },
    'pl-d-preemption#0': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('ChatGPT opened The American Prospect article this evidence cited and the quote is not in it. Earlier search results attribute the '
                 'remark to Jeffries in a Dec. 5, 2025 Demand Progress release (also reported by Common Dreams), which is now cited instead, '
                 'but neither that page nor a transcript or recording has been opened, so the quote is not confirmed.'),
        'unconfirmed': ['The quotation attributed to Jeffries.', 'The Dec. 5, 2025 date.',
                        'The question and context in which he declined to take a position.'],
        'apply': set_fields(source={'title': 'Demand Progress: Poll: voters want Jeffries, Schumer to fight AI deregulation (Dec. 5, 2025)',
                                    'url': 'https://www.demandprogress.org/poll-voters-want-jeffries-schumer-to-fight-ai-deregulation'}),
    },
    'us-ratepayer-protection-act': {
        'result': 'corrected', 'confidence': 'high',
        'note': ('Confirmed on official records: the House passed H.R. 9340 417-3 on Sept. 16, 2026 (House Clerk), and Senate cloture on the motion '
                 'to proceed failed 57-43 on Sept. 30 (Senate roll call 254). Rep. Gabe Evans\'s release confirms Rep. Kathy Castor\'s role, Sen. Jon '
                 'Husted\'s Senate companion and the cost-recovery standards. Corrected: the Senate companion\'s number (S. 5028), the Sept. 17 '
                 'unanimous consent attempt and the "toothless messaging bill" quote could not be confirmed and were removed.'),
        'unconfirmed': ['The Senate companion\'s bill number (S. 5028).', 'Any Senate action after Sept. 30, 2026.'],
        'extra_sources': [
            {'title': 'Office of the Clerk, U.S. House: Roll call 312, H.R. 9340 (Sept. 16, 2026)',
             'url': 'https://clerk.house.gov/Votes/2026312?BillNum=H.R.9340'},
            {'title': 'Rep. Gabe Evans: Bipartisan Ratepayer Protection Act passes House',
             'url': 'https://gabeevans.house.gov/media/press-releases/congressman-gabe-evans-bipartisan-ratepayer-protection-act-passes-house'}],
        'apply': set_fields(
            billNumber='H.R. 9340',
            sponsors=[{'name': 'Gabe Evans', 'party': 'Republican', 'role': 'House sponsor', 'linkedCandidateId': None},
                      {'name': 'Kathy Castor', 'party': 'Democratic', 'role': 'House cosponsor', 'linkedCandidateId': None},
                      {'name': 'Jon Husted', 'party': 'Republican', 'role': 'Senate companion sponsor', 'linkedCandidateId': None}],
            statusNote='Passed the House 417-3 on Sept. 16, 2026; Senate cloture on the motion to proceed failed 57-43 on Sept. 30.',
            summary=('Would have state utility regulators consider standards for making data centers pay for new generation and grid upgrades. '
                     'Passed the House with bipartisan support; blocked in the Senate when cloture on the motion to proceed failed.'),
            source={'title': 'Rep. Gabe Evans: Bipartisan Ratepayer Protection Act passes House',
                    'url': 'https://gabeevans.house.gov/media/press-releases/congressman-gabe-evans-bipartisan-ratepayer-protection-act-passes-house'}),
    },
    'ca-2024-sb1047': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in Gov. Newsom\'s veto message of Sept. 29, 2024 ("I am returning Senate Bill 1047 without my signature"); the governor\'s '
                 'legislative update of the same day names Sen. Scott Wiener (D) as author.'),
        'extra_sources': [{'title': 'Office of the Governor of California: Legislative update 9.29.24',
                           'url': 'https://www.gov.ca.gov/2024/09/29/governor-newsom-issues-legislative-update-9-29-24/'}],
        'apply': set_fields(statusDate='2024-09-29',
                            source={'title': 'Office of the Governor of California: Veto message for SB 1047 (Sept. 29, 2024)',
                                    'url': 'https://www.gov.ca.gov/wp-content/uploads/2024/09/SB-1047-Veto-Message.pdf'}),
    },
    'ca-2025-ab1064': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in the governor\'s legislative update of Oct. 13, 2025, which lists AB 1064 by Assemblymember Rebecca Bauer-Kahan (D) '
                 'among vetoed bills; author added. The bill text and veto message would not open, so the precise restrictions are not '
                 'confirmed and confidence is Medium.'),
        'unconfirmed': ['The precise restrictions and exceptions in the final bill.'],
        'apply': set_fields(sponsors=sponsor('Rebecca Bauer-Kahan'), sponsorsNote=None, statusDate='2025-10-13', source=GOV_UPDATE_101325),
    },
    'ca-2025-sb243': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Corrected: New York enacted AI companion safeguards first (signed May 9, 2025), so "first state law" was removed. The governor\'s '
                 'Oct. 13, 2025 release confirms the signing, the disclosure that interactions are AI-generated and break reminders for minors, and '
                 'names Sen. Steve Padilla (D) as author. The Jan. 1, 2026 effective date is not in the opened sources, so Medium.'),
        'unconfirmed': ['The Jan. 1, 2026 effective date and any later implementation deadlines.'],
        'extra_sources': [{'title': 'Governor of New York: Governor Hochul signs legislation establishing AI companion safeguards (May 9, 2025)',
                           'url': 'https://www.governor.ny.gov/news/governor-hochul-signs-legislation-expanding-historic-empire-ai-consortium-and-establishing'}],
        'apply': set_fields(
            sponsors=sponsor('Steve Padilla'), sponsorsNote=None,
            summary=('Requires safeguards for AI companion chatbots: disclosure that users are talking to AI, break reminders for minors and '
                     'protocols for suicidal ideation. In force from Jan. 1, 2026. New York enacted similar safeguards earlier, in May 2025.'),
            source={'title': 'Office of the Governor of California: Governor Newsom signs bills to protect children online (Oct. 13, 2025)',
                    'url': 'https://www.gov.ca.gov/2025/10/13/governor-newsom-signs-bills-to-further-strengthen-californias-leadership-in-protecting-children-online/'}),
    },
    'ca-2025-sb53': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in the governor\'s Sept. 29, 2025 signing release: public frontier safety frameworks, incident reporting to the Office of '
                 'Emergency Services, whistleblower protections and the CalCompute consortium. The Jan. 1, 2026 effective date is not in the '
                 'opened sources, so Medium.'),
        'unconfirmed': ['The Jan. 1, 2026 effective date and any separate implementation deadlines.'],
        'apply': set_fields(source={'title': 'Office of the Governor of California: Governor Newsom signs SB 53 (Sept. 29, 2025)',
                                    'url': 'https://www.gov.ca.gov/2025/09/29/governor-newsom-signs-sb-53-advancing-californias-world-leading-artificial-intelligence-industry/'}),
    },
    'ca-2025-sb57': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in Sen. Steve Padilla\'s Oct. 11, 2025 release: signed into law, requiring a study of whether data center load growth shifts '
                 'costs to other ratepayers, due by 2027. The chapter number (647) and how the bill was narrowed from a tariff rest on CalMatters '
                 'reporting, so Medium.'),
        'unconfirmed': ['Chapter number 647.', 'The exact statutory reporting deadline.',
                        'The amendment history showing how the original tariff proposal was narrowed.'],
    },
    'ca-2025-sb7': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the governor\'s legislative update of Oct. 13, 2025, which lists SB 7 by Sen. Jerry McNerney (D) among vetoed bills; '
                 'author added. McNerney\'s Sept. 30, 2026 release confirms the narrower SB 947 was enacted.'),
        'extra_sources': [{'title': 'Sen. Jerry McNerney: Newsom signs No Robo Bosses Act of 2026 (Sept. 30, 2026)',
                           'url': 'https://sd05.senate.ca.gov/news/newsom-signs-mcnerneys-no-robo-bosses-act-2026-requiring-human-oversight-ai-workplace'}],
        'apply': set_fields(sponsors=sponsor('Jerry McNerney'), sponsorsNote=None, statusDate='2025-10-13', source=GOV_UPDATE_101325),
    },
    'ca-2026-ab1331': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the governor\'s Sept. 30, 2026 signing release, which names Assemblymember Sade Elhawary (D) as author (added) and '
                 'describes the workplace surveillance limits, including restrictions on surveillance in workplace bathrooms.'),
        'apply': set_fields(sponsors=sponsor('Sade Elhawary'), sponsorsNote=None,
                            summary='Limits employers\' use of AI-powered workplace surveillance, including restrictions on surveillance in workplace bathrooms.',
                            source=GOV_0930_2026),
    },
    'ca-2026-ab1577': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the governor\'s Sept. 21, 2026 signing release and the Senate\'s final 2026 legislative summary: Chapter 434 requires '
                 'data centers to report energy use and operating information to the Energy Commission and permitting agencies.'),
        'extra_sources': [{'title': 'California Senate: Summary of significant legislation, 2026 (final)',
                           'url': 'https://sfa.senate.ca.gov/system/files/2026-11/sig-leg-2026-final.pdf'}],
        'apply': set_fields(statusNote='Signed Sept. 21, 2026 (Chapter 434).',
                            summary=('Requires data centers to report energy use and operating information to the Energy Commission and permitting '
                                     'agencies, with their effect on electricity demand covered in the state\'s Integrated Energy Policy Report.')),
    },
    'ca-2026-ab1883': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: the governor\'s Sept. 30, 2026 signing release confirms the law on workplace surveillance tools and names '
                 'Assemblymember Isaac Bryan (D) as author (added). The limits on neural data and on predicting workers\' emotional states '
                 'could not be checked: the bill text would not open.'),
        'unconfirmed': ['The precise limits on collecting neural data.', 'The precise limits on predicting workers\' emotional states.'],
        'apply': set_fields(sponsors=sponsor('Isaac Bryan'), sponsorsNote=None, source=GOV_0930_2026),
    },
}
