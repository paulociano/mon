# License status and third-party policy

## Current repository license

As of 2026-10-05, MON uses an explicit proprietary repository license in `/LICENSE`.

The repository is public for visibility and collaboration, but it is **not open source under an OSI-approved license**. Public visibility must not be interpreted as permission to redistribute, commercialize or publish derivative versions.

Any future move to open source, source-available terms broader than the current license, or dual licensing requires an explicit owner decision and a reviewed license change.

## Product legal documents

The pre-production baseline lives in:
- `legal/TERMS-OF-USE.md`;
- `legal/PRIVACY-POLICY.md`;
- `legal/DATA-RETENTION.md`;
- `legal/SUBPROCESSORS.md`;
- `legal/AGE-AND-CHILD-SAFETY.md`;
- `compliance/`.

Documents marked as baseline or draft are operational controls, not legal certification. Production remains gated by `compliance/RELEASE-GATES.md`.

## Runtime third-party code

Before adding a third-party runtime dependency, review maintenance, security history, license compatibility, transitive dependency footprint, data flow and runtime cost.

## CI dependencies

GitHub Actions are third-party executable code. Actions should be pinned to immutable commit SHAs and updated through reviewed dependency PRs.

## Formal compliance tooling

Introduce SBOM/license scanners such as ScanCode, ORT, FOSSology, Syft or CycloneDX when the repository accumulates enough third-party code or packaged artifacts to justify that operational cost.
