# ADR 0004 — Personal-first, team-ready data model

- Status: Accepted
- Date: 2026-05-28

## Context
The product inspirations (Jira/Confluence, Tempo, n8n) are team tools, but the build and
the near-term users are single-person. We want to ship the personal product fast without
making team features a future rewrite.

## Decision
Build **single-user features now**, but leave a **team seam** open so multi-user can be
added later additively. Concretely:

1. **Scope, not just owner.** Treat every task/goal/habit as belonging to a *scope*, not
   directly to a user. For now the scope is an implicit "personal workspace" = the user.
   In code, never inline `resource.userId == jwt.id`; route every read/write through an
   access check `canAccess(principal, resource)` and a repository method
   `findAccessibleBy(principal)`. Today both resolve to "owner == me"; later they resolve
   to "I'm a member of the resource's workspace."
2. **Keep the JWT generic.** It carries `id` and `roles` (per ADR-0002). Do NOT bake
   single-user assumptions into endpoints. A `workspaceId` / memberships claim can be
   added later without breaking the contract.
3. **Schema: add a nullable seam, don't build the org.** Optionally add a nullable
   `workspace_id` column to task/goal/habit tables now (defaulting to the user's personal
   workspace id = their user id). Cheap to add, avoids a later backfill migration.
4. **Server-side ownership checks are mandatory from day one.** A user may only mutate
   their own resources — enforced in the service, not just by filtering `user_id`. This
   is the same check that becomes membership-based later, so writing it now is free
   forward-compatibility (and closes a current security gap).

## What we explicitly do NOT build yet
Organizations, teams, invitations, per-workspace roles, permission matrices, sharing UI,
shared projects. All deferred to Phase 5 (gated on this ADR).

## Consequences
- The personal app ships on schedule; team features slot in by changing two functions
  (`canAccess`, `findAccessibleBy`) and adding membership tables — not by rewriting
  controllers or the token.
- Slightly more discipline now (access goes through a seam, not inline comparisons).
- The nullable `workspace_id` is dead weight until Phase 5; acceptable insurance.
