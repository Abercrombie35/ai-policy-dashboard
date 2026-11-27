# Decisions for batch 11, claim by claim.

EO = {'title': 'The White House: Ensuring a National Policy Framework for Artificial Intelligence (executive order, Dec. 11, 2025)',
      'url': 'https://www.whitehouse.gov/presidential-actions/2025/12/eliminating-state-law-obstruction-of-national-artificial-intelligence-policy/'}

DECISIONS = {
    'pl-r-harmful#0': {
        'result': 'corrected', 'confidence': 'high',
        'note': ('Confirmed in the enacted law (Public Law 119-12, May 19, 2025). Corrected the detail: the crime covers knowingly publishing '
                 'non-consensual intimate images, including AI-generated ones, under conditions set in the law; covered platforms must set up a '
                 'notice-and-removal process within a year and remove such images within 48 hours of a valid request. The law is now the source.'),
        'apply': set_fields(
            summary=('Trump signed the Take It Down Act (Public Law 119-12), making it a federal crime to knowingly publish non-consensual intimate '
                     'images, including AI-generated ones, and requiring covered platforms to remove them within 48 hours of a valid request '
                     '(platforms had a year to set up the process).'),
            source={'title': 'GovInfo: Public Law 119-12, TAKE IT DOWN Act (May 19, 2025)',
                    'url': 'https://www.govinfo.gov/content/pkg/PLAW-119publ12/pdf/PLAW-119publ12.pdf'}),
    },
    'pl-r-harmful#1': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Corrected on the order\'s text: the child-safety carve-out applies to the federal preemption law the order recommends, not to its '
                 'separate litigation and funding measures. No line was quoted, so Medium. The order is now the source.'),
        'apply': set_fields(
            summary=('The federal preemption law the order recommends would leave state child-safety laws in place; the carve-out does not apply to '
                     'the order\'s litigation and funding measures.'),
            source=EO),
    },
    'pl-r-preemption#0': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed on the order\'s text (Dec. 11, 2025): "the Attorney General shall establish an AI Litigation Task Force", with '
                 'funding-related measures and a recommended federal preemption law with specified exceptions. The order is now the source.'),
        'apply': set_fields(source=EO),
    },
    'pl-r-preemption#1': {
        'result': 'confirmed', 'confidence': 'high',
        'note': 'Confirmed: the cited address opens the order\'s official text on whitehouse.gov, dated Dec. 11, 2025.',
    },
    'pl-r-safety#0': {
        'result': 'confirmed', 'confidence': 'high',
        'note': ('Confirmed in the White House announcement of July 23, 2025: "The Plan identifies over 90 Federal policy actions" across three '
                 'pillars (innovation, infrastructure, international leadership), with an emphasis on removing regulatory barriers. The '
                 'announcement is now the source.'),
        'apply': set_fields(
            summary=('"Winning the AI Race: America\'s AI Action Plan" sets out more than 90 federal actions focused on innovation, infrastructure '
                     'and international leadership, with an emphasis on removing regulatory barriers.'),
            source={'title': 'The White House: White House unveils America\'s AI Action Plan (July 23, 2025)',
                    'url': 'https://www.whitehouse.gov/releases/2025/07/white-house-unveils-americas-ai-action-plan/'}),
    },
    'pl-r-safety#1': {
        'result': 'not-confirmed', 'confidence': 'low',
        'note': ('Not confirmed: the pact\'s own text was not found, and the Foley analysis that is cited could not establish that it has no penalties, '
                 'disclosure duty or enforcement role, or the administration\'s position on every binding safety mandate.'),
    },
    'pl-r-workers#1': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed in Bloomberg Law\'s report of July 23, 2025: the plan "includes extensive plans for worker retraining and up-skilling, '
                 'but is silent on worker protections." News coverage, so Medium; the report is now the source.'),
        'apply': set_fields(
            summary=('Bloomberg Law noted the plan "includes extensive plans for worker retraining and up-skilling, but is silent on worker '
                     'protections."'),
            source={'title': 'Bloomberg Law: Trump AI plan ditches worker protections, keeps training focus (July 23, 2025)',
                    'url': 'https://news.bloomberglaw.com/financial-accounting/trump-ai-plan-ditches-worker-protections-keeps-training-focus'}),
    },
    'tx-89r-hb149': {
        'result': 'confirmed', 'confidence': 'medium',
        'note': ('Confirmed on Texas Legislature Online: Capriglione\'s HB 149 was signed June 22, 2025 and took effect Jan. 1, 2026, with its banned '
                 'uses and state agencies\' disclosure duty. That it narrowed an earlier, broader impact-assessment proposal (HB 1709) rests on news '
                 'reports, so Medium; the summary now attributes it.'),
        'unconfirmed': ['That HB 149 replaced an earlier, broader impact-assessment proposal (HB 1709).'],
        'extra_sources': [{'title': 'Texas Legislature Online: HB 149 bill summary', 'url': 'https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=HB149&LegSess=89R'}],
        'apply': set_fields(summary=('Bans a short list of AI uses, including AI-generated child sexual abuse material and government social scoring, '
                                     'and requires Texas state agencies to disclose AI use to consumers. News reports describe it as a narrowed '
                                     'successor to an earlier proposal (HB 1709) that would have required impact assessments for high-risk AI.')),
    },
    'tx-90r-sb293': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: the introduced text confirms Sen. Joan Huffman\'s bill to repeal the data center sales and use tax exemptions. '
                 'The 23 Senate authors, the filing date and HB 167\'s author could not be checked: both bill histories would not open.'),
    },
    'tx-90r-sb33': {
        'result': 'corrected', 'confidence': 'medium',
        'note': ('Confirmed on the Senate\'s author report for Sen. Judith Zaffirini: all three bills were filed Nov. 9, 2026. Corrected from the '
                 'official captions: SB 35 has ERCOT share information on large-load customers with the Texas Water Development Board (not a '
                 'reporting duty on data centers), and SB 36 concerns eligibility for certain state and local incentive programs. The bills\' full '
                 'requirements were not checked, so Medium.'),
        'unconfirmed': ['The full requirements and exceptions in SB 35 and SB 36.'],
        'apply': set_fields(
            title='Data center electricity costs, large-load information sharing and incentive eligibility',
            summary=('SB 33: data centers may not raise electricity costs for Texas residents. SB 35: ERCOT shares information on large-load '
                     'customers, such as data centers, with the Texas Water Development Board. SB 36: limits data centers\' eligibility for certain '
                     'state and local incentive programs.'),
            source={'title': 'Texas Legislature Online: bills authored by Sen. Judith Zaffirini, 90th Legislature',
                    'url': 'https://capitol.texas.gov/reports/report.aspx?Code=A1700&ID=author&LegSess=90R'}),
    },
    'us-grid-savings-act': {
        'result': 'corrected', 'confidence': 'high',
        'note': ('Confirmed in Sen. Martin Heinrich\'s release of Sept. 17, 2026: S. 5199, the GRID Savings Act, would make large new loads such as AI '
                 'data centers pay the cost of connecting them, and Sen. Bernie Moreno blocked his unanimous-consent request. Corrected: the bill '
                 'number (S. 5199) and its status. No later action was confirmed.'),
        'unconfirmed': ['Any formal action after Sept. 17, 2026.'],
        'apply': set_fields(
            billNumber='S. 5199',
            statusDate='2026-09-17',
            statusNote='Heinrich asked for unanimous consent to pass it on Sept. 17, 2026; Sen. Bernie Moreno (R) objected. No later action confirmed.',
            summary=('Would require large new electricity users such as AI data centers to pay the cost of the grid upgrades needed to connect them, '
                     'rather than other ratepayers.'),
            source={'title': 'Sen. Martin Heinrich: Heinrich offers his GRID Savings Act to force AI data centers to pay for grid upgrades (Sept. 17, 2026)',
                    'url': 'https://www.heinrich.senate.gov/newsroom/press-releases/heinrich-offers-his-grid-savings-act-to-force-ai-data-centers-to-pay-for-grid-upgrades-highlights-how-husted-backed-bill-falls-short'}),
    },
    'us-hr3447': {
        'result': 'partly-confirmed', 'confidence': 'low',
        'note': ('Partly confirmed: the introduced text confirms the chip security and location-verification requirements. The 42-0 committee vote '
                 '(Mar. 26, 2026), its inclusion in the Senate\'s FY2027 NDAA and its current status were not checked on official records.'),
    },
}
