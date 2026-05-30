# ADR 0002 — JWT is the inter-service auth contract

- Status: Accepted
- Date: 2026-05-28

## Context
Services validate a shared HS256 JWT locally. Claim names and role casing had drifted
(`id` vs `userId`, `CUSTOMER` vs `Customer`), breaking task/goal auth.

## Decision
Freeze the contract in `docs/API_CONTRACTS.md`: user id claim is `id` (number), roles is
a list of UPPERCASE strings, authorities are `ROLE_<UPPER>`. All services and the
frontend conform. `scripts/contract-check.sh` guards it in CI.

## Consequences
- Predictable auth across services; cheap automated drift detection.
- The shared secret must be externalized (env) and rotated — tracked in INTEGRATION_FIXES §5.
- Symmetric secret means any service can mint tokens; acceptable now, revisit
  (asymmetric RS256, issued only by user-service) if the trust boundary tightens.
