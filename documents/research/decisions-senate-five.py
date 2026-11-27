# Coding decisions for the next five Senate races (AIPD-103): documents/research/senate-five.json.
# Kansas, Maine, Ohio (special), Iowa and Alaska, the highest-ranked untracked races in the published sample (AIPD-102).
# Coding, stances and categories are model-drafted (reviewed later under AIPD-202). Minor candidates appear in the
# results only, as in the other races.

def c(orientation, level, instruments, areas, specificity, evidence='reported'):
    return {'regulatoryOrientation': orientation, 'levelOfGovernment': level, 'instruments': instruments,
            'issueAreas': areas, 'specificity': specificity, 'evidenceType': evidence}

DC = ['energy-data-centers']
INFERRED_RPA = ' His vote is inferred from the tally (all Republicans voted yes) rather than seen by name.'

DECISIONS = {
    # Races
    'ks-senate-2026': {'skipCandidates': ['david-graham'], 'certExpected': None,
                       'certNote': 'The State Board of Canvassers has not yet certified; in 2024 it certified in early December.'},
    'me-senate-2026': {'certExpected': None, 'certNote': 'No state tabulation or certification was found as of Nov. 27, 2026.'},
    'oh-senate-2026': {'skipCandidates': ['bill-redpath', 'gregory-levy'], 'certExpected': None,
                       'certNote': 'Not yet certified; counties had until Nov. 24, 2026 to finish their official canvass.'},
    'ia-senate-2026': {'skipCandidates': ['thomas-laehn'], 'certExpected': None,
                       'certNote': 'The State Board of Canvassers has not yet certified; it certified on Dec. 1 in 2022 and Dec. 2 in 2024.'},
    'ak-senate-2026': {'skipCandidates': ['gerald-heikes', 'dan-j-sullivan'], 'certExpected': None,
                       'certNote': ('The Division of Elections targeted Nov. 25, 2026 for certification; it was not confirmed as of Nov. 27. '
                                    'Peltola won a first-round majority, so no ranked-choice count was needed.')},

    # Kansas: Roger Marshall (R) and Adam Hamilton (D)
    'ks-senate-2026#s0': {'coding': c('balanced', ['state'], ['bans'], DC, 'stated-principle'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-moratorium', 'dc-local-control']},
    'ks-senate-2026#s1': {'coding': c('balanced', ['state'], [], DC, 'stated-principle'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-tax-incentives', 'dc-water-environment']},
    'ks-senate-2026#s2': {'coding': c('balanced', ['federal'], [], DC + ['national-security-china'], 'general-rhetoric'),
                          'stances': {'data-centers': 'conditional'}, 'categories': ['dc-security', 'dc-local-control']},
    'ks-senate-2026#s3': {'coding': c('balanced', ['federal', 'state'], ['funding'], ['labor'], 'legislative-action', 'bill'),
                          'stances': {'workers': 'retraining-led'}, 'categories': ['ai-workers']},
    'ks-senate-2026#s4': {'coding': c('balanced', ['federal'], [], DC, 'legislative-action', 'voting-record'),
                          'stances': {'data-centers': 'conditional'}, 'categories': ['dc-ratepayer'], 'append': INFERRED_RPA},
    'ks-senate-2026#s5': {'coding': c('unclear', ['federal', 'preemption'], [], ['innovation-competitiveness'], 'legislative-action', 'voting-record'),
                          'categories': ['ai-preemption']},
    'ks-senate-2026#s6': {'coding': c('balanced', ['state'], [], DC, 'stated-principle'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-local-control']},
    'ks-senate-2026#s7': {'coding': c('balanced', ['state'], [], DC, 'concrete-proposal'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-ratepayer', 'dc-water-environment']},
    'ks-senate-2026#p0': {'questionType': 'single'},

    # Maine: Susan Collins (R) and Troy Jackson (D)
    'me-senate-2026#s0': {'coding': c('balanced', ['federal', 'preemption', 'state'], [], ['innovation-competitiveness'], 'legislative-action', 'bill'),
                          'stances': {'preemption': 'opposes-preemption'}, 'categories': ['ai-preemption']},
    'me-senate-2026#s1': {'coding': c('balanced', ['federal'], [], DC, 'legislative-action', 'voting-record'),
                          'stances': {'data-centers': 'conditional'}, 'categories': ['dc-ratepayer']},
    'me-senate-2026#s2': {'coding': c('balanced', ['state'], [], DC, 'stated-principle'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-ratepayer', 'dc-water-environment', 'dc-local-control']},
    'me-senate-2026#s3': {'coding': c('balanced', ['federal'], [], ['national-security-china', 'deepfakes-elections'], 'stated-principle'),
                          'categories': ['ai-national-security', 'ai-deepfakes']},
    'me-senate-2026#s4': {'coding': c('precautionary', ['federal'], ['bans'], ['deepfakes-elections'], 'legislative-action', 'bill'),
                          'stances': {'harmful-content': 'supports-rules'}, 'categories': ['ai-deepfakes']},
    'me-senate-2026#s5': {'coding': c('precautionary', ['state'], [], DC, 'concrete-proposal'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-ratepayer']},
    'me-senate-2026#s6': {'coding': c('precautionary', ['state'], ['procurement', 'disclosure'], ['labor'], 'concrete-proposal'),
                          'stances': {'workers': 'active-protections'}, 'categories': ['ai-workers']},
    'me-senate-2026#s7': {'coding': c('precautionary', ['state'], [], DC, 'stated-principle'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-ratepayer', 'dc-water-environment', 'dc-economy-jobs']},
    'me-senate-2026#s8': {'coding': c('precautionary', ['federal'], [], ['safety'], 'general-rhetoric'),
                          'stances': {'safety-rules': 'pause-or-public-control'}, 'categories': ['ai-frontier-safety']},
    'me-senate-2026#s9': {'coding': c('precautionary', ['state'], ['bans'], DC, 'general-rhetoric'), 'stances': {'data-centers': 'pause'},
                          'categories': ['dc-moratorium']},
    'me-senate-2026#p0': {'skip': True},  # only two issues were reported (three needed for a ranking)

    # Ohio special: Jon Husted (R) and Sherrod Brown (D)
    'oh-senate-2026#s0': {'coding': c('balanced', ['federal'], [], DC, 'legislative-action', 'bill'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-ratepayer']},
    'oh-senate-2026#s1': {'coding': c('balanced', ['federal'], [], DC, 'legislative-action', 'voting-record'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-ratepayer']},
    'oh-senate-2026#s2': {'coding': c('balanced', ['state'], [], DC, 'stated-principle'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-local-control', 'dc-ratepayer']},
    'oh-senate-2026#s3': {'coding': c('balanced', ['state'], [], DC, 'stated-principle'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-tax-incentives']},
    'oh-senate-2026#s4': {'coding': c('precautionary', ['federal'], ['disclosure', 'bans'], ['child-safety'], 'legislative-action', 'bill'),
                          'stances': {'harmful-content': 'supports-rules'}, 'categories': ['ai-child-safety']},
    'oh-senate-2026#s5': {'coding': c('precautionary', ['federal'], ['disclosure', 'bans'], ['child-safety'], 'legislative-action', 'bill'),
                          'stances': {'harmful-content': 'supports-rules'}, 'categories': ['ai-child-safety']},
    'oh-senate-2026#s6': {'coding': c('unclear', ['federal', 'preemption'], [], ['innovation-competitiveness'], 'legislative-action', 'voting-record'),
                          'categories': ['ai-preemption']},
    'oh-senate-2026#s7': {'coding': c('innovation-first', ['federal'], [], ['innovation-competitiveness'], 'general-rhetoric'),
                          'categories': ['ai-innovation']},
    'oh-senate-2026#s8': {'coding': c('precautionary', ['state'], [], DC, 'general-rhetoric'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-tax-incentives', 'dc-ratepayer']},
    'oh-senate-2026#s9': {'coding': c('precautionary', ['state'], [], DC, 'concrete-proposal'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-tax-incentives', 'dc-local-control']},
    'oh-senate-2026#s10': {'coding': c('precautionary', ['state', 'federal'], [], DC, 'concrete-proposal'), 'stances': {'data-centers': 'conditional'},
                           'categories': ['dc-ratepayer']},
    'oh-senate-2026#p0': {'skip': True},  # only the top issue was reported

    # Iowa: Ashley Hinson (R) and Josh Turek (D)
    'ia-senate-2026#s0': {'coding': c('balanced', ['federal'], [], ['national-security-china', 'safety'], 'stated-principle'),
                          'stances': {'chip-sales-china': 'restrict-sales'}, 'categories': ['ai-chips-china', 'ai-national-security']},
    'ia-senate-2026#s1': {'skip': True},  # a single unconfirmed search snippet; too thin to state his position
    'ia-senate-2026#p0': {'questionType': 'single'},
    'ia-senate-2026#p1': {'questionType': 'importance-rating', 'aiIssue': 'AI technology',
                          'issues': [{'issue': 'Cost of living', 'pct': 60}, {'issue': 'President Donald Trump', 'pct': 43},
                                     {'issue': 'Immigration', 'pct': 39}, {'issue': 'AI technology', 'pct': 27}]},
    'ia-senate-2026#p2': {'skip': True},  # the same AI figure as the issue question above

    # Alaska: Dan Sullivan (R) and Mary Peltola (D)
    'ak-senate-2026#s0': {'coding': c('balanced', ['federal'], ['bans', 'disclosure'], ['national-security-china'], 'legislative-action', 'bill'),
                          'categories': ['ai-national-security', 'ai-chips-china']},
    'ak-senate-2026#s1': {'coding': c('unclear', ['federal'], [], ['national-security-china'], 'general-rhetoric'),
                          'categories': ['ai-national-security']},
    'ak-senate-2026#s2': {'coding': c('unclear', ['federal', 'preemption'], [], ['innovation-competitiveness'], 'legislative-action', 'voting-record'),
                          'categories': ['ai-preemption']},
    'ak-senate-2026#s3': {'coding': c('innovation-first', ['federal', 'state'], [], DC + ['national-security-china'], 'stated-principle'),
                          'stances': {'data-centers': 'accelerate'}, 'categories': ['dc-economy-jobs', 'dc-security']},
    'ak-senate-2026#s4': {'coding': c('balanced', ['federal'], [], DC, 'legislative-action', 'bill'),
                          'categories': ['dc-local-control']},
    'ak-senate-2026#s5': {'coding': c('balanced', ['state'], [], DC, 'stated-principle'), 'stances': {'data-centers': 'conditional'},
                          'categories': ['dc-ratepayer', 'dc-local-control']},
    'ak-senate-2026#p0': {'skip': True},  # only one issue was reported
}
