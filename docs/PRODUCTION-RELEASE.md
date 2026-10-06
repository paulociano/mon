# MON — Production Release Contract

## Objective

Production must not be treated as healthy merely because GitHub Pages published a commit. The source commit, quality verification, public-release gates and deployed artifact must be distinguishable.

## Current transition state

The repository historically uses GitHub Pages branch publishing. In that mode, Pages can publish `main` before `MON Quality Gate` finishes.

Until repository administration is changed, **Pages publication is not evidence that the release passed the quality gate**.

## Required repository settings

Before treating deployment as gated production:

1. protect `main`;
2. require pull requests;
3. require the MON Quality Gate jobs before merge;
4. prevent force pushes to `main`;
5. change GitHub Pages source from branch publishing to **GitHub Actions**;
6. make the Pages deploy workflow depend on successful quality verification;
7. keep the source commit SHA visible in release/deployment evidence.

These settings require repository administration and are intentionally not represented as completed by source-code changes alone.

## Public account gate

Run the manual workflow:

`MON Public Release Readiness`

It executes:

`node scripts/check-public-release-readiness.mjs`

The check fails while any unchecked P0 remains in `compliance/RELEASE-GATES.md`.

This is intentionally separate from ordinary development CI. Open legal/operational P0 items should block **public release**, not every development commit.

## Release evidence

A production release should record:

- source commit SHA;
- successful Quality Gate run;
- successful Public Release Readiness run when opening/reopening public account functionality;
- Pages deployment run;
- service-worker cache version;
- schema migration assumptions;
- known rollback limitations.

## Rollback

Static frontend rollback is not enough when a release includes irreversible database or external side effects. Before deployment, classify whether the release changes:

- Supabase schema;
- Auth behavior;
- Edge Functions;
- persisted local save schema;
- service worker/cache lifecycle;
- third-party data flows.

For those changes, document forward-fix/rollback constraints before publication.
