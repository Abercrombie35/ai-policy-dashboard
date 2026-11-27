# Decisions for batch 07, claim by claim.

DECISIONS = {
    'cr-ct-house04-goldstein-1': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('Not confirmed: the Political Emails archive page would not open and no original copy of the campaign email was found, so its '
                 'contents and date have not been read. Earlier search results only showed the archive entry.'),
    },
    'cr-ct-house04-goldstein-2': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: Connecticut Public\'s Oct. 27, 2026 profile opened, and campaign material supports expanding vocational '
                 'training and college transparency, but the "AI-proof" wording and the requirement to disclose graduate salaries by degree were '
                 'not found in an opened source.'),
    },
    'cr-ct-house04-himes-3': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the CBS transcript of Face the Nation (Nov. 15, 2026): "Nvidia could sell them to Megaspeed, Megaspeed gives them to '
                 'China." He presented the diversion as a possibility to investigate and questioned the Commerce Department\'s role in stopping it.'),
    },
    'cr-fr-melenchon-1': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the Reporterre interview as republished on his own site (July 22, 2026): asked about a moratorium and a slowdown, he '
                 'answered "Oui, avec plusieurs précautions inscrites dans la loi que nous préparons" (yes, with several safeguards written into the '
                 'bill we are preparing), and proposed a moratorium on data centers serving foreign private companies subject to U.S. law. His '
                 'site is now the source.'),
        'apply': set_fields(source={'title': 'Jean-Luc Mélenchon: Interview with Reporterre (July 22, 2026)',
                                    'url': 'https://melenchon.fr/2026/07/22/une-nouvelle-gauche-daction-a-surgi-elle-est-faite-dinsoumis-et-de-verts-tous-ecologistes-interview-reporterre/'}),
    },
    'cr-fr-philippe-2': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: his campaign programme makes European digital sovereignty, including in AI, a priority ("Édouard Philippe veut '
                 'faire de l\'Europe une puissance souveraine du numérique"). His June 2026 VivaTech appearance was not confirmed, and "an early '
                 'credibility test" is Ecostylia\'s reading, which the outlet says lacked a full transcript; the text now attributes it.'),
        'unconfirmed': ['His June 2026 VivaTech appearance and what he said there.',
                        'That the appearance was an early credibility test of his campaign (Ecostylia\'s reading).'],
        'apply': chain(
            set_fields(text=('His campaign programme aims to make Europe a sovereign digital power, including in AI. At VivaTech in June 2026 he '
                             'reportedly made AI sovereignty a central theme, which Ecostylia called an early credibility test of his campaign.')),
            headline('cr-fr-philippe-2', 'Make Europe a sovereign digital power, including in AI')),
    },
    'cr-mi-gov-benson-2': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: her campaign\'s news page carries the announcement "Jocelyn Benson Calls for Moratorium on Data Centers in New '
                 '\'Michigan First\' Ad", but not its text. The Sept. 13 launch, the ad\'s wording on tax breaks and electric bills, and whether it '
                 'set a duration rest on news reports that were not reopened.'),
    },
    'cr-mi-gov-james-1': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Corrected: the House Clerk records him voting yes on H.R. 1 on May 22, 2025. The bill\'s 10-year moratorium barred state and local '
                 'enforcement of AI regulations; whether it reached data center rules is Michigan Advance\'s reading, and the moratorium was removed '
                 'before the bill became law. The bill text would not open, so the moratorium\'s content rests on the news report (Medium).'),
        'unconfirmed': ['That the moratorium would have covered all state and local regulation of data centers.'],
        'extra_sources': [{'title': 'Michigan Advance: As James pushes local control on data centers, past congressional votes sought to limit just that',
                           'url': 'https://michiganadvance.com/2026/09/02/as-james-pushes-local-control-on-data-centers-past-congressional-votes-sought-to-limit-just-that/'}],
        'apply': chain(
            set_fields(
                text=('As a U.S. representative, voted on May 22, 2025 for the House budget bill (H.R. 1), which carried a 10-year moratorium on state '
                      'and local enforcement of AI regulations; Michigan Advance argues it could have reached data center rules. The moratorium was '
                      'removed before the bill became law.'),
                publishedDate='2025-05-22',
                dateNote='House vote of May 22, 2025, on a broad budget bill, not a standalone AI measure'),
            headline('cr-mi-gov-james-1', 'Voted for the House bill pausing state AI laws for 10 years')),
    },
    'cr-mi-gov-james-2': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: on Face the Nation (Aug. 30, 2026, CBS transcript) he backed local control and protections for communities: '
                 '"Our electricity bills can\'t go up. We must protect our water. We have to prevent pollution." His campaign\'s Aug. 1 statement '
                 'backing a moratorium (Detroit News) would not open.'),
        'unconfirmed': ['The campaign\'s Aug. 1, 2026 statement backing a moratorium on new data centers.'],
        'apply': set_fields(
            text=('His campaign said he supported a moratorium on new data centers until a local-control standard and protections for the '
                  'environment and electricity bills were in place. On Face the Nation (Aug. 30) he said: "Our electricity bills can\'t go up. '
                  'We must protect our water. We have to prevent pollution."'),
            dateNote='Campaign statement of Aug. 1, 2026; interview of Aug. 30'),
    },
    'cr-mi-sen-elsayed-2': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed on the campaign\'s announcement of June 29, 2026: "AI Under Democracy" contains 22 policy proposals built on democratic '
                 'ownership and governance of AI, public control and protecting workers.'),
        'apply': set_fields(publishedDate='2026-06-29'),
    },
    'cr-mi-sen-elsayed-3': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('Not confirmed: The Washington Post page opened without readable text and no campaign platform setting out the October proposal was '
                 'found, so the freeze\'s scope and conditions are unchecked.'),
    },
    'cr-mi-sen-rogers-2': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in E&E News, which quotes his call for a one-year Michigan pause "until we establish a fair, transparent approval process '
                 'that puts local communities first" and his opposition to a national ban; his campaign\'s later Fox & Friends post confirms his '
                 'support for a moratorium and local control. The Aug. 20 date rests on news reports, so Medium. The Hill would not open; E&E News '
                 'is now the source.'),
        'unconfirmed': ['The Aug. 20, 2026 date from a primary record.'],
        'extra_sources': [{'title': 'Rogers for Senate: Rogers on Fox & Friends', 'url': 'https://rogersforsenate.com/news/rogers-on-fox-amp-friends-listen-to-the-people-who-know-abdul'}],
        'apply': set_fields(source={'title': 'E&E News: Republican Mike Rogers backs Michigan data center moratorium',
                                    'url': 'https://www.eenews.net/articles/republican-mike-rogers-backs-michigan-data-center-moratorium/'}),
    },
    'cr-tx-gov-abbott-1': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed on Texas Legislature Online: signed June 22, 2025, effective Jan. 1, 2026. The enrolled text sets out the prohibited AI '
                 'uses, the limits on government social scoring and state agencies\' duty to disclose AI use.'),
        'extra_sources': [{'title': 'Texas Legislature Online: HB 149, enrolled text', 'url': 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.HTM'}],
    },
}
