# Security Policy

## Supported version

MON is currently developed from the `main` branch. Security fixes should target the current codebase first.

## Reporting a vulnerability

Do not open a public issue for a vulnerability that could expose users, data, credentials, or the integrity of the application.

Use GitHub's private vulnerability reporting when it is available for this repository. If private reporting is not available, contact the repository owner privately before publishing technical details.

Please include:

- affected file or feature;
- reproduction steps;
- impact;
- browser/device context when relevant;
- a minimal proof of concept when safe.

## Security baseline

MON is designed as a static PWA and should keep the runtime dependency surface small. Changes should preserve:

- no secrets committed to the repository;
- no unnecessary third-party runtime scripts or styles;
- least-privilege GitHub Actions permissions;
- deterministic quality checks before merge;
- same-origin service-worker caching;
- explicit review before introducing new external dependencies.
