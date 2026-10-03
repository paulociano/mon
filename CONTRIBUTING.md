# Contributing to MON

MON favors small, reviewable changes and a low-dependency architecture.

## Before changing code

1. Understand the user-visible behavior being changed.
2. Prefer extending an existing module over adding a new dependency.
3. Keep the initial load light and lazy-load noncritical experiences.
4. Preserve offline/PWA behavior.
5. Treat accessibility, performance and security as release criteria.

## Local verification

Run all JavaScript syntax checks:

```bash
find . -type f \( -name "*.js" -o -name "*.mjs" \) -not -path "./.git/*" -print0 | xargs -0 -n1 node --check
```

Then run the repository checks used by GitHub Actions:

```bash
node scripts/verify.mjs
node scripts/test-review-scheduler.mjs
node scripts/test-content-packs.mjs
node scripts/test-learning-methods.mjs
node scripts/test-adaptive-methods.mjs
node scripts/test-mastery-graph.mjs
node scripts/test-mastery-progression.mjs
node scripts/test-n5-scale.mjs
node scripts/test-home-polish.mjs
node scripts/test-performance-budget.mjs
node scripts/test-feature-split.mjs
node scripts/test-lazy-experiences.mjs
node scripts/test-dataset-split.mjs
node scripts/test-repository-quality.mjs
```

## Pull requests

A PR should explain what changed, why, how it was verified, and any impact on performance, accessibility, PWA caching or user data.

## Dependencies

New dependencies should only be introduced when they materially reduce complexity or risk and should be reviewed for maintenance, license, security and bundle impact.
