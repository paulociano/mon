# License status and third-party policy

## Current repository license

As of 2026-10-03, this repository does **not** contain an explicit open-source `LICENSE` file.

That absence should be treated as a deliberate decision point, not silently replaced with a license chosen by automation. The repository owner should select a license only after deciding whether MON is intended to be open source, source-available, proprietary, or dual-licensed.

## Runtime third-party code

Before adding a third-party runtime dependency, review maintenance, security history, license compatibility, transitive dependency footprint and runtime cost.

## CI dependencies

GitHub Actions are third-party executable code. Actions should be pinned to immutable commit SHAs and updated through automated dependency PRs.

## Formal compliance tooling

Introduce SBOM/license scanners such as ScanCode, ORT, FOSSology, Syft or CycloneDX when the repository accumulates enough third-party code or packaged artifacts to justify that operational cost.
