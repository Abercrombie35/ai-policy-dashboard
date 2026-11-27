# Coding decisions for Florida (AIPD-109): documents/research/florida-races.json and florida-bills.json.
# Coding, stances and categories are model-drafted (reviewed later under AIPD-202).

def c(orientation, level, instruments, areas, specificity, evidence='reported'):
    return {'regulatoryOrientation': orientation, 'levelOfGovernment': level, 'instruments': instruments,
            'issueAreas': areas, 'specificity': specificity, 'evidenceType': evidence}

BOTH = ['fl-governor-2026', 'fl-senate-2026']
CERT_NOTE = ('The Elections Canvassing Commission was due to certify the results on Nov. 17, 2026; no report confirming that it '
             'did so was found.')

DECISIONS = {
    # Races
    'fl-governor-2026': {'certExpected': None, 'certNote': CERT_NOTE},
    'fl-senate-2026': {'certExpected': None, 'certNote': CERT_NOTE},

    # Governor: Byron Donalds (R) and David Jolly (D)
    'fl-governor-2026#s0': {
        'coding': c('balanced', ['state'], [], ['child-safety'], 'stated-principle'),
        'stances': {'preemption': 'opposes-preemption', 'harmful-content': 'supports-rules'},
        'categories': ['ai-child-safety', 'ai-preemption'],
        'headline': 'Parents and Florida should lead on AI rules'},
    'fl-governor-2026#s1': {
        'coding': c('innovation-first', ['federal', 'preemption'], [], ['innovation-competitiveness'], 'stated-principle'),
        'stances': {'preemption': 'supports-preemption'},
        'categories': ['ai-preemption'],
        'text': ('A Florida Phoenix explainer on the stalled state AI Bill of Rights reported that Donalds thinks AI regulation should be '
                 'left to the federal government, in line with President Trump\'s executive order on state AI laws. This is the outlet\'s '
                 'description, not his own words, and it differs from his remarks in February and the fall.'),
        'headline': 'Reported as favoring federal AI rules (outlet\'s account)'},
    'fl-governor-2026#s2': {
        'coding': c('precautionary', ['state'], ['disclosure'], ['child-safety', 'safety'], 'concrete-proposal'),
        'stances': {'harmful-content': 'supports-rules'},
        'categories': ['ai-child-safety', 'ai-consumer-protection'],
        'headline': 'Backs a Florida AI bill of rights like DeSantis\'s'},
    'fl-governor-2026#s3': {
        'coding': c('balanced', ['federal'], [], ['energy-data-centers'], 'legislative-action', 'bill'),
        'stances': {'data-centers': 'conditional'},
        'categories': ['dc-ratepayer', 'dc-water-environment'],
        'headline': 'Bill: data centers must supply their own power and water'},
    'fl-governor-2026#s4': {
        'coding': c('balanced', ['state'], [], ['energy-data-centers'], 'stated-principle'),
        'stances': {'data-centers': 'conditional'},
        'categories': ['dc-local-control', 'dc-moratorium', 'dc-water-environment', 'dc-ratepayer'],
        'headline': 'No statewide moratorium; local say over siting'},
    'fl-governor-2026#s5': {
        'coding': c('precautionary', ['state'], ['bans'], ['energy-data-centers'], 'concrete-proposal'),
        'stances': {'data-centers': 'pause'},
        'categories': ['dc-moratorium'],
        'headline': 'One-year pause on data center construction'},
    'fl-governor-2026#s6': {
        'coding': c('precautionary', ['state'], ['bans'], ['energy-data-centers'], 'general-rhetoric'),
        'stances': {'data-centers': 'pause'},
        'categories': ['dc-moratorium'],
        'headline': 'A full data center ban should be "on the table"'},
    'fl-governor-2026#s7': {
        'coding': c('precautionary', ['state'], [], ['child-safety'], 'stated-principle'),
        'stances': {'harmful-content': 'supports-rules'},
        'categories': ['ai-child-safety'],
        'headline': '"Pump the brakes" on AI until children are safe'},
    'fl-governor-2026#s8': {
        'coding': c('precautionary', ['state'], [], ['labor', 'child-safety'], 'stated-principle'),
        'stances': {'workers': 'active-protections'},
        'categories': ['ai-workers', 'ai-child-safety'],
        'headline': 'AI should not replace teachers'},
    'fl-governor-2026#p0': {'races': BOTH, 'questionType': 'single'},
    'fl-governor-2026#p1': {'races': BOTH},
    'fl-governor-2026#p2': {'races': BOTH},
    'fl-governor-2026#p3': {'races': ['fl-governor-2026']},
    'fl-governor-2026#p4': {'races': BOTH},

    # Senate special: Ashley Moody (R) and Angie Nixon (D)
    'fl-senate-2026#s0': {
        'coding': c('precautionary', ['federal', 'state'], ['liability'], ['child-safety', 'deepfakes-elections'], 'concrete-proposal'),
        'stances': {'harmful-content': 'supports-rules'},
        'categories': ['ai-child-safety', 'ai-deepfakes'],
        'headline': 'As attorney general, urged Congress to act on AI abuse images'},
    'fl-senate-2026#s1': {
        'coding': c('unclear', ['federal', 'preemption'], [], ['innovation-competitiveness'], 'legislative-action', 'voting-record'),
        'categories': ['ai-preemption'],
        'headline': 'Voted to strip the 10-year ban on state AI laws (99-1)'},
    'fl-senate-2026#s2': {
        'coding': c('balanced', ['state'], [], ['energy-data-centers'], 'stated-principle'),
        'stances': {'data-centers': 'conditional'},
        'categories': ['dc-ratepayer', 'dc-local-control', 'dc-water-environment'],
        'headline': 'Consumers should not pay data center costs; local say'},
    'fl-senate-2026#s3': {
        'coding': c('precautionary', ['federal'], ['bans'], ['energy-data-centers'], 'concrete-proposal'),
        'stances': {'data-centers': 'pause'},
        'categories': ['dc-moratorium', 'dc-economy-jobs'],
        'headline': 'Moratorium on new data centers until safeguards exist'},
    'fl-senate-2026#s4': {
        'coding': c('precautionary', ['federal'], [], ['privacy', 'labor'], 'stated-principle'),
        'stances': {'workers': 'active-protections'},
        'categories': ['ai-privacy-surveillance', 'ai-workers'],
        'headline': 'Tougher AI guardrails on privacy and jobs'},
    # The same three statewide polls are recorded once, under the governor's race, and shown on both races.
    'fl-senate-2026#p0': {'skip': True},
    'fl-senate-2026#p1': {'skip': True},
    'fl-senate-2026#p2': {'skip': True},

    # Bills and executive actions. Co-sponsor names that the research took from general knowledge rather than a
    # source are left out.
    'fl-2026-sb484': {
        'coding': c('balanced', ['state'], ['disclosure'], ['energy-data-centers'], 'legislative-action', 'bill'),
        'categories': ['dc-ratepayer', 'dc-local-control', 'dc-water-environment', 'dc-transparency'],
        'sponsors': [{'name': 'Bryan Ávila', 'party': 'Republican', 'role': 'sponsor'}]},
    'fl-2026-sb1118': {
        'coding': c('innovation-first', ['state'], [], ['energy-data-centers'], 'legislative-action', 'bill'),
        'categories': ['dc-transparency']},
    'fl-2025-hb7031': {
        'coding': c('balanced', ['state'], [], ['energy-data-centers'], 'legislative-action', 'bill'),
        'categories': ['dc-tax-incentives'],
        'sponsors': [], 'sponsorsNote': 'Committee bill (House Ways and Means Committee).'},
    'fl-2026-sb482': {
        'coding': c('precautionary', ['state'], ['disclosure', 'bans'], ['child-safety', 'safety'], 'legislative-action', 'bill'),
        'categories': ['ai-child-safety', 'ai-consumer-protection'],
        'sponsors': [{'name': 'Tom Leek', 'party': 'Republican', 'role': 'sponsor'},
                     {'name': 'Alex Rizo', 'party': 'Republican', 'role': 'sponsor of House companion HB 1395'}]},
    'fl-2026-proclamation-ai-special-session': {
        'coding': c('precautionary', ['state'], [], ['child-safety', 'safety'], 'legislative-action'),
        'categories': ['ai-child-safety', 'ai-consumer-protection']},
    'fl-2026d-sb2d': {
        'coding': c('precautionary', ['state'], ['disclosure', 'bans'], ['child-safety', 'safety'], 'legislative-action', 'bill'),
        'categories': ['ai-child-safety', 'ai-consumer-protection'],
        'sponsors': [], 'sponsorsNote': 'Sponsor to verify (reported as Sen. Jason Brodeur, R).'},
    'fl-2025-desantis-ai-proposal': {
        'coding': c('precautionary', ['state'], ['bans'], ['child-safety', 'deepfakes-elections', 'privacy'], 'concrete-proposal'),
        'categories': ['ai-child-safety', 'ai-deepfakes', 'ai-consumer-protection'],
        'summary': ('Paired an AI consumer-protection package (deepfake and explicit-content protections, parental controls, limits on AI '
                    'use of name, image and likeness, and a ban on "licensed" AI therapy) with a proposal to keep utility customers from '
                    'paying for hyperscale AI data centers and let local governments reject them; the data center half became SB 484.')},
    'fl-2025-desantis-preemption-statement': {
        'coding': c('balanced', ['state', 'preemption'], [], ['innovation-competitiveness'], 'stated-principle'),
        'categories': ['ai-preemption']},
    'fl-2025-hb1161': {
        'coding': c('precautionary', ['state'], ['liability'], ['deepfakes-elections', 'privacy'], 'legislative-action', 'bill'),
        'categories': ['ai-deepfakes'],
        'sponsors': [{'name': 'Wyman Duggan', 'party': 'Republican', 'role': 'sponsor'}]},
    'fl-2026-hb527': {
        'coding': c('precautionary', ['state'], ['disclosure'], ['safety'], 'legislative-action', 'bill'),
        'categories': ['ai-consumer-protection'],
        'sponsors': [{'name': 'Hillary Cassel', 'party': 'Republican', 'role': 'sponsor'}]},
    'fl-2026-hb281': {
        'coding': c('precautionary', ['state'], ['bans'], ['safety'], 'legislative-action', 'bill'),
        'categories': ['ai-consumer-protection'],
        'sponsors': [{'name': 'Christine Hunschofsky', 'party': 'Democratic', 'role': 'sponsor'}]},
    'fl-2026-sb146': {'skip': True},  # confirmed only by bill trackers; no category fits a study of agency AI use
    'us-hr9777': {
        'coding': c('balanced', ['federal'], [], ['energy-data-centers'], 'legislative-action', 'bill'),
        'categories': ['dc-ratepayer', 'dc-water-environment'],
        'linkSponsor': 'Byron Donalds'},
}
