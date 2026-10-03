# Quality engineering research — 50 GitHub repositories

Date: 2026-10-03

This review prioritized repositories with high GitHub star counts, while still requiring relevance to MON, active maintenance and a concrete engineering practice worth reusing. Stars are a prioritization signal, not a substitute for technical fit.

## Decision summary

MON is a static PWA with a deliberately small dependency surface. The review therefore favors adopting principles and lightweight repository controls instead of installing large toolchains that would increase complexity without proportional benefit.

Applied now:

- layered deterministic CI checks;
- pinned GitHub Action revision;
- least-privilege workflow permissions;
- automated GitHub Actions dependency updates;
- security reporting policy;
- contribution and dependency-introduction policy;
- CODEOWNERS;
- static accessibility contracts;
- repository hygiene and secret/conflict-marker checks;
- explicit license-status documentation.

Deferred until the project actually needs them:

- browser E2E framework;
- component workshop;
- dependency vulnerability/SBOM scanners;
- release automation;
- full license-compliance scanner.

## 50 repositories reviewed

| # | Repository | Stars* | Main lesson for MON | Decision |
|---|---|---:|---|---|
| 1 | microsoft/playwright | 97k | Cross-browser behavioral verification | Later, when critical browser journeys justify E2E |
| 2 | storybookjs/storybook | 91k | Isolated UI contracts and visual review | Later, if a reusable component system emerges |
| 3 | prettier/prettier | 52k | Deterministic formatting reduces review noise | Principle adopted; no formatter dependency yet |
| 4 | cypress-io/cypress | 51k | Browser-level regression testing | Later; Playwright would be evaluated first |
| 5 | jestjs/jest | 45k | Fast automated test feedback | Existing native Node tests already cover current needs |
| 6 | aquasecurity/trivy | 38k | Security scanning across code and dependencies | Later if dependencies/containers grow |
| 7 | GoogleChrome/lighthouse | 31k | Performance/accessibility budgets | Adopted via repository performance/a11y contracts |
| 8 | eslint/eslint | 28k | Static bug finding and code conventions | Principle adopted; current syntax/contracts remain lighter |
| 9 | biomejs/biome | 26k | Unified fast lint/format tooling | Strong candidate if formatting/lint debt grows |
| 10 | semantic-release/semantic-release | 24k | Automated release discipline | Not needed before formal releases |
| 11 | oxc-project/oxc | 23k | High-performance JS tooling | Reference only for current scale |
| 12 | mochajs/mocha | 23k | Simple reliable JS testing | Native Node assertions are sufficient today |
| 13 | renovatebot/renovate | 23k | Automated dependency maintenance | Concept adopted using native Dependabot for Actions |
| 14 | conventional-changelog/commitlint | 19k | Commit-message consistency | Defer until multi-contributor workflow warrants it |
| 15 | mswjs/msw | 18k | Stable API mocking | Not relevant while MON has no API dependency |
| 16 | vitest-dev/vitest | 17k | Fast modern unit testing | Candidate if module/test complexity grows |
| 17 | semgrep/semgrep | 17k | Pattern-based security/static analysis | Principle adopted with focused zero-dependency checks |
| 18 | pre-commit/pre-commit | 16k | Shift checks left before CI | Defer; CI is currently enough |
| 19 | anchore/grype | 13k | Vulnerability scanning | Later if package/container surface grows |
| 20 | changesets/changesets | 12k | Explicit version/change intent | Not needed for a single static app yet |
| 21 | stylelint/stylelint | 12k | CSS correctness and consistency | Candidate as stylesheet complexity continues to grow |
| 22 | google/osv-scanner | 11k | Dependency vulnerability checks | Later when package manifests exist |
| 23 | reviewdog/reviewdog | 9.6k | Surface automated findings in PR review | Useful later with more linters |
| 24 | anchore/syft | 9.6k | SBOM generation | Later when third-party dependency inventory is nontrivial |
| 25 | GoogleChrome/web-vitals | 8.6k | User-centric performance metrics | Concept already reflected in performance work |
| 26 | dequelabs/axe-core | 7.6k | Automated accessibility rules | Strong future browser-test candidate |
| 27 | sigstore/cosign | 6.3k | Artifact signing/provenance | Not needed without packaged releases |
| 28 | kucherenko/jscpd | 6.3k | Duplication detection | Candidate if codebase duplication becomes measurable |
| 29 | dependabot/dependabot-core | 5.8k | Automated dependency updates | Applied through GitHub Dependabot |
| 30 | ossf/scorecard | 5.7k | Open-source security posture | Applied concepts: pin Actions, least privilege, ownership |
| 31 | dubzzz/fast-check | 5.2k | Property-based testing | Useful for future scheduling/progression invariants |
| 32 | sitespeedio/sitespeed.io | 5.0k | Repeatable real-browser performance testing | Later for deployed performance monitoring |
| 33 | pa11y/pa11y | 4.6k | Automated accessibility CI | Later; current static contracts added now |
| 34 | commitizen-tools/commitizen | 3.5k | Structured commits/releases | Defer until contributor count grows |
| 35 | testing-library/dom-testing-library | 3.3k | Test user-visible behavior instead of internals | Method adopted for future UI tests |
| 36 | aboutcode-org/scancode-toolkit | 2.6k | License/copyright/dependency inventory | Later if third-party code expands |
| 37 | oxsecurity/megalinter | 2.6k | Broad repo lint orchestration | Too broad/heavy for MON today |
| 38 | testcontainers/testcontainers-node | 2.6k | Real dependency integration tests | Not relevant without backend services |
| 39 | oss-review-toolkit/ort | 2.1k | Automated OSS compliance workflow | Later if dependency/license surface grows |
| 40 | slsa-framework/slsa | 1.9k | Build provenance and supply-chain levels | Reference for future packaged releases |
| 41 | fossas/fossa-cli | 1.5k | License/vulnerability dependency analysis | Later if dependencies grow |
| 42 | SonarSource/SonarJS | 1.3k | JS static analysis/maintainability | Reference; avoid extra service/toolchain now |
| 43 | step-security/harden-runner | 1.3k | CI runner hardening | Valuable later if workflow gains network/build complexity |
| 44 | fossology/fossology | 1.0k | License compliance workflow | Too heavy for current dependency-free architecture |
| 45 | licensee/licensee | 911 | Detect repository license | Used conceptually to make license status explicit |
| 46 | fsfe/reuse-tool | 589 | Machine-readable licensing per file | Later if MON is intentionally published under an OSS license |
| 47 | CycloneDX/cyclonedx-cli | 547 | SBOM validation/transform | Later with dependency inventory |
| 48 | google/licenseclassifier | 350 | License text classification | Reference only |
| 49 | spdx/tools-java | 100 | SPDX document tooling | Reference for future formal compliance |
| 50 | aboutcode-org/aboutcode-toolkit | 100 | Provenance and attribution metadata | Reference for future third-party inventory |

\* Star counts are approximate snapshots observed during the review on 2026-10-03 and can change.

## Engineering standard adopted for MON

A change is considered healthy when it preserves five layers:

1. **Behavior** — relevant deterministic tests pass.
2. **Repository integrity** — no syntax errors, missing local assets or merge-conflict residue.
3. **Experience** — accessibility and performance contracts remain inside budget.
4. **Security** — CI stays least-privilege, Actions are pinned, secrets and unsafe execution patterns are rejected.
5. **Governance** — ownership, contribution rules, dependency policy and license status are explicit.

The architecture stays intentionally lightweight. A popular tool is added only when it solves a problem the current zero/minimal-dependency checks cannot solve economically.
