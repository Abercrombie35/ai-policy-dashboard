# Decisions for batch 12, claim by claim.
#
# After the import, the tracking parameter on the Sanders release link ("?trk=...") was stripped from the
# us-s4214 check's sources in verification.json.

DECISIONS = {
    'us-hr6875': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: the House Foreign Affairs Committee\'s announcement confirms Chairman Brian Mast (R) introduced the AI OVERWATCH '
                 'Act, for congressional oversight of advanced-chip exports (sponsor added). The 42-2 committee vote on Jan. 21, 2026, its inclusion '
                 'in the Senate FY2027 NDAA and its current status were not checked on Congress.gov, which would not open.'),
        'unconfirmed': ['The 42-2 committee vote on Jan. 21, 2026.', 'Inclusion in the Senate FY2027 NDAA.', 'Current status.'],
        'apply': set_fields(sponsors=[{'name': 'Brian Mast', 'party': 'Republican', 'role': 'sponsor', 'linkedCandidateId': None}], sponsorsNote=None),
    },
    'us-hr8170': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('Not confirmed: the Congress.gov page and bill text gave no usable content, so the sponsors, the 36-8 committee vote, the export-control '
                 'requirements, NDAA inclusion and status are unchecked against the official record.'),
    },
    'us-hr9442': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: Rep. Alexandria Ocasio-Cortez\'s announcement confirms she introduced the House version of the AI Data Center '
                 'Moratorium Act. The June 24 date, the bill number, the cosponsor count, the committee referrals and its status were not checked: '
                 'the Congress.gov page would not open.'),
    },
    'us-s4214': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: Sen. Bernie Sanders\'s Mar. 25, 2026 release confirms the AI Data Center Moratorium Act, announced with '
                 'Rep. Ocasio-Cortez. The bill number, the Commerce Committee referral, how far it limits upgrades to existing facilities and its '
                 'status were not checked: the Congress.gov page would not open.'),
    },
    'us-states-right-to-regulate-ai': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Confirmed in Sen. Ed Markey\'s release: he introduced the States\' Right to Regulate AI Act on Dec. 17, 2025 (date made precise) to '
                 'stop the December 2025 executive order targeting state AI laws from being carried out. The bill number (reported as S. 3557) and '
                 'status were not checked on Congress.gov, so Medium; the release is now the source.'),
        'unconfirmed': ['The Senate bill number (reported as S. 3557).', 'Current status.'],
        'apply': set_fields(
            statusDate='2025-12-17',
            statusNote='Introduced Dec. 17, 2025; reported as S. 3557, a number not yet confirmed on Congress.gov.',
            summary='Would stop the December 2025 executive order targeting state AI laws from being carried out.',
            source={'title': 'Sen. Ed Markey: Legislation to block Trump\'s executive order blocking state AI regulation (Dec. 17, 2025)',
                    'url': 'https://www.markey.senate.gov/news/press-releases/senator-markey-introduces-legislation-to-block-trumps-executive-order-blocking-state-ai-regulation'}),
    },
    'us-take-it-down-act': {
        'result': 'corrected', 'confidence': 'high',
        'note': ('Confirmed in the enacted law: S. 146, Public Law 119-12, signed May 19, 2025. Corrected the bill number and the detail: the crimes '
                 'cover specified knowing publication of, or threats to publish, authentic or AI-forged intimate images, with statutory conditions and '
                 'exceptions; covered platforms must act within 48 hours of a valid removal request, with a year to set up the process. The law is '
                 'now the source.'),
        'apply': set_fields(
            billNumber='S. 146 (Public Law 119-12)',
            statusNote='Signed May 19, 2025 (Public Law 119-12).',
            summary=('Makes it a federal crime to knowingly publish, or threaten to publish, non-consensual intimate images, real or AI-generated, '
                     'with conditions and exceptions set in the law. Covered platforms must remove such images within 48 hours of a valid request; '
                     'they had a year to set up the process.'),
            source={'title': 'GovInfo: Public Law 119-12, TAKE IT DOWN Act (May 19, 2025)',
                    'url': 'https://www.govinfo.gov/content/pkg/PLAW-119publ12/pdf/PLAW-119publ12.pdf'}),
    },
}
