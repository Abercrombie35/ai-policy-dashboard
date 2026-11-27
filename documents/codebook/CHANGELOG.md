# Codebook changelog (AIPD-204)

The codebook is `src/data/codebook.json`. The Methodology page shows it, and the dataset downloads include it. Every
record's coding uses the version listed here. The validator rejects any value that is not in the codebook.

## 1.0-rc1 (Nov. 27, 2026): release candidate

This is the scheme as it is used across Michigan, Texas, Connecticut and California, and France (2027). It is not yet
frozen as 1.0.

**Before 1.0 is frozen:**
- **Human review (AIPD-202):** a person reviews every AI-drafted code.
- **Reliability test (AIPD-203):** two coders independently code at least 20% of records, and Krippendorff's alpha
  is computed for each dimension.

Rules where agreement is low will be revised, and the changes recorded below as 1.0. No category is planned to be
removed. Records coded under the release candidate keep their codes unless the reliability test changes a rule.

## Changes since the pilot draft (0.1-draft, Nov. 12, 2026)

The pilot draft came from section 5 of the project proposal and was tried out on Michigan and Texas. It had:
- the six coding dimensions: regulatory orientation, level of government, instruments, issue areas, specificity and
  evidence type;
- six label types, four confidence levels, nine item kinds and seven bill statuses.

### Added

- **Election results as a separate label (Nov. 12):**
  - `resultLabel` ("Election result") with result statuses Unofficial and Certified.
  - Vote counts are never mixed with candidates' positions.
- **What is said vs. what is proposed (Nov. 12):**
  - Two tracks: "What is said" and "What is proposed".
  - A new item kind, `action` ("Actions and votes").
- **Party-line questions (Nov. 12):** six policy questions, each with stance values, for the deviation analysis:
  - federal preemption of state AI laws;
  - AI data center buildout;
  - AI chip sales to China;
  - binding rules on AI developers;
  - child safety and deepfakes;
  - workers and AI.
- **Two policy areas (Nov. 12):** "Data centers" and "Everything else in AI", used to split every view.
- **Bill status "Announced (not yet filed)" (Nov. 16):** for bills a lawmaker has announced but not filed, such as
  Connecticut's planned 2027 moratorium.
- **Policy categories (Nov. 16):** sixteen categories for grouping proposals, eight for data centers and eight for
  everything else in AI:
  - data centers: moratoriums and bans, electricity costs and grid, tax breaks, siting and local control, water and
    environment, disclosure and studies, security, permitting and faster buildout;
  - everything else: comprehensive AI laws, child safety, deepfakes, chips and China, preemption, consumer
    protection, workers, innovation.
- **Finer categories, applied to statements too (Nov. 16):**
  - Five more: investment and jobs; frontier and high-risk AI safety; privacy and surveillance; **copyright and
    creators**; national security and defense.
  - Categories now classify what candidates say as well as what they propose.
- **France (Nov. 19):**
  - **Digital sovereignty and European champions**, a category needed for European candidates.
  - Four **blocs** (left, centre, right, far right), which take the place of U.S. parties for races abroad.
- **Certification statuses (Nov. 27):** Certified, Canvass complete and Not yet certified. They track where each
  state's official canvass stands (AIPD-108).

### Changed

- The version moved from `0.1-draft` to `1.0-rc1` (Nov. 27, 2026).

### Removed

- Nothing has been removed since the pilot draft.
