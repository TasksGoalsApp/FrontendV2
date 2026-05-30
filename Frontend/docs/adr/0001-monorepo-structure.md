# ADR 0001 — Orchestration monorepo over scattered repos

- Status: Accepted
- Date: 2026-05-28

## Context
The platform is spread across seven repos (5 services + 2 frontends) with no shared
place for run instructions, contracts, infra, or planning. Onboarding and "run it all"
are painful, and the JWT contract drifted between services unnoticed.

## Decision
Introduce a thin **orchestration monorepo** (this repo). It owns infra
(`docker-compose.infra.yml`), shared docs/contracts, scripts, and the gateway. Service
and frontend source live under `services/` and `apps/` via **git submodules**
(multi-repo team) or **vendored folders** (solo/early). It does NOT absorb the services'
own build tooling.

## Consequences
- One `make up` for all infra; one source of truth for the JWT contract and ports.
- Submodules add a small learning curve; vendoring risks drift from origin repos —
  pick per the team's workflow and note it here.
