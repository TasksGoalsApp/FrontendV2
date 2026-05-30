# ADR 0003 — Spring Cloud Gateway as the single browser entrypoint

- Status: Proposed
- Date: 2026-05-28

## Context
The SPA calls each service on its own port with `CORS *`. This leaks topology to the
browser, multiplies CORS config, and leaves no place for rate limiting, auth pre-checks,
or correlation logging.

## Decision
Add a Spring Cloud Gateway at `:8080`. Route `/api/**` to services, enforce one CORS
policy locked to the SPA origin, pre-validate JWT signatures, inject correlation IDs.
Stay on the Spring stack rather than Nginx to reuse the team's language and JWT library.

## Consequences
- The SPA only knows `:8080`; services can move/renumber freely behind it.
- One more service to run and deploy; mitigated by `make` + compose.
- Enables future cross-cutting features (rate limiting via Redis, request auditing).
