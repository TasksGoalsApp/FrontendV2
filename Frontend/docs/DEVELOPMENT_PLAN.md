# Development Plan

A phased roadmap from "almost-working prototype" to the product vision. Each phase has
a goal, the work, and a **done when** bar. Work the phases in order; don't pull vision
features forward until the foundation holds.

## The honest starting point

What exists: a personal **task / goal / habit** tracker built as microservices, plus an
early React frontend (auth + a task calendar). Habits is an empty stub. Notifications is
scaffolded but inert. The three back-end services don't currently talk to a logged-in
user because of a JWT contract mismatch.

What the vision describes (Jira/Confluence docs+tickets, Tempo/Everhour time logging,
n8n automation) is a **team productivity suite** — a much larger product than what's
built. The plan below grows the personal core into that, but treats the team/automation
layer as later phases earned by a solid foundation, not the next sprint.

> **DECIDED (ADR-0004): personal-first, team-ready.** Build single-user features now,
> but leave a team seam open (scope-based access, server-side ownership checks, optional
> nullable `workspace_id`) so multi-user slots in later without a rewrite. The rest of
> this note is kept for context.
>
> are you building a *personal*
> productivity app (one user, their tasks/goals/habits) or a *team* tool (shared
> projects, tickets, time reports)? Almost every data-model decision downstream depends
> on this. The plan assumes **personal-first, team-ready** — single-user features now,
> but with a `workspace`/`project` seam left open so multi-user can be added without a
> rewrite. Decide explicitly and record it as ADR-0004.

---

## Phase 0 — Make it run together (½–1 week)

**Goal:** a freshly cloned repo where `make up` + four `bootRun`s + `make web` gives a
logged-in user who can create and see a task.

- Apply `INTEGRATION_FIXES.md` items 1–3 (JWT claim, role casing, ports).
- Adopt this monorepo: drop services into `services/`, frontend into `apps/web`.
- Externalize the JWT secret (fix §5) and rotate it.
- Wire the frontend `.env` to the new ports; enable the 401 handler (fix §7).
- Write a `README` run-through and verify it on a clean machine.

**Done when:** register → login → create task → see it on the calendar, end to end,
with no manual DB poking.

---

## Phase 1 — Solidify the core domain (1–2 weeks)

**Goal:** tasks, goals, and habits are real, tested features in both backend and UI.

- **Habit service:** build it for real (it's an empty stub). Mirror the task/goal
  layering. Domain: habit, cadence (daily/weekly), streak, completion log. Endpoints:
  create / list / mark-done / streak. Its own MySQL (`:3310`), init script, ADR if the
  model is non-obvious.
- **Frontend feature parity:** add `features/goals` and `features/habits` to V2, using
  the old `daily-dojo-site` prototype as the *visual* reference (it already has
  GoalCard, HabitCard, AddGoalDialog, etc. — port the UX, not the Supabase code).
- **Forms & validation:** adopt `react-hook-form` + `zod` (already proven in the old
  prototype) for create/edit dialogs.
- **Server state:** adopt **TanStack Query** for fetching/caching/mutations instead of
  hand-rolled `useEffect` + `useState` hooks. Standardize loading/empty/error states.
- **Tests:** a unit test per `business/Impl`; one happy-path integration test per
  service (H2 is already a test dependency).

**Done when:** a user can fully manage tasks, goals, and habits from the UI; each
service has meaningful test coverage; CI runs the tests.

---

## Phase 2 — The gateway and a real shell (1 week)

**Goal:** one entrypoint, one CORS policy, a navigation shell that feels like a product.

- Build the **Spring Cloud Gateway** (`gateway/`, ADR-0003): route `/api/**` to
  services, single CORS policy locked to the SPA origin, correlation-ID + access logs.
- Point the SPA at `VITE_API_BASE_URL=/api` only.
- Frontend **app shell**: persistent sidebar nav (Tasks / Goals / Habits / Profile),
  command palette (`cmdk`), theme toggle, user menu — see `UX_AUDIT.md`.
- Apply the design system (see Phase 2.5).

**Done when:** the browser only ever talks to `:8080`; the app has a coherent shell and
navigation; light/dark works.

---

## Phase 2.5 — Design system (parallel, ~1 week)

**Goal:** a consistent, themeable UI foundation. Runs alongside Phase 1–2.

> **STARTED (2026-05-29): the lime "Modern Minimal" system is live.** The design direction
> landed as a **lime/chartreuse** accent on achromatic neutrals with an inverting neutral
> CTA — *not* the earlier blue tweakcn theme. `DESIGN_SYSTEM_BRIEF.md` has been realigned to
> match. What's done: the clean OKLCH token file (`apps/web/src/index.css`, replacing the old
> two-system mix), self-hosted Inter + JetBrains Mono, light/dark via next-themes, the base
> shadcn primitives (Button/Checkbox/Avatar/Label), and the **Sign-up/Login** + **Goal
> Timeline** screens built against it. What remains: extract a reusable AppShell, build out
> the rest of the primitive + composition inventory (see the brief's §5), and adopt the
> status/categorical tokens app-wide as Tasks/Habits screens arrive.

- ~~Execute `DESIGN_SYSTEM_BRIEF.md`: install the token set (shadcn + OKLCH), standardize
  on **Lucide**, wire light/dark.~~ **Done** — lime OKLCH tokens, not the blue theme.
- ~~Replace the current mixed `index.css` (two overlapping token systems) with one clean
  token file.~~ **Done.**
- Build out the rest of the component inventory the app needs (see the brief's §5).
- Status/categorical colors are defined as direct OKLCH tokens (Radix-informed for
  accessibility), not imported as Radix 12-step scales — keep new statuses consistent.

**Done when:** every screen is built from the shared components and reads only from
design tokens; flipping the theme changes nothing but colors.

---

## Phase 3 — Notifications & reminders (1–2 weeks)

**Goal:** the inert notification service starts doing something useful.

- Fix the broker config (fix §4); bring up `rabbitmq` + `mailhog`.
- **Publishers:** task-service publishes `task.due_soon` / `task.overdue`;
  goal-service publishes `goal.deadline` / `goal.milestone`; habit-service publishes
  streak events. Add `spring-boot-starter-amqp` to those services.
- A scheduler emits the daily/weekly `digest.#` events.
- In-app notification center in the SPA (consume a `/api/notifications` feed) plus
  email via Mailhog in dev.

**Done when:** creating a task due tomorrow produces a "due soon" email in Mailhog and
an in-app notification.

---

## Phase 4 — Time tracking (the Tempo/Everhour idea) (2–3 weeks)

**Goal:** log time against tasks; see where it went.

- New **time-service** (`:8086`, own DB): a `time_entry` model (task ref, user, start,
  end/duration, note). Endpoints: start/stop timer, manual entry, list/aggregate.
- UI: a timer on each task card, a "timesheet" week view, simple reports (time per
  task/goal/day).
- This is where the personal-vs-team decision bites: team reporting needs a shared
  project model first.

**Done when:** a user can track time on a task and see a weekly total.

---

## Phase 5 — Work items & docs (the Jira/Confluence idea) (3–4 weeks)

**Goal:** richer work items and linked documentation. **Only attempt after deciding
team scope (ADR-0004).** This phase likely introduces `workspace` and `project`
concepts, comments, attachments, and a lightweight markdown wiki. Treat it as its own
mini-project with its own plan.

---

## Phase 6 — Automation (the n8n idea) (research spike first)

**Goal:** user-defined "when X then Y" rules (e.g. "when a task is overdue, create a
follow-up and notify me"). Start with a **time-boxed spike**: do you build a small
internal rules engine on top of the existing RabbitMQ events, or embed/integrate an
existing engine? Don't commit to a build until the spike answers that. The event
backbone from Phase 3 is the natural foundation.

---

## Cross-cutting, all phases

- **CI/CD:** the repos already have `gradle.yml` workflows — extend to run tests on
  every service and lint the frontend. Add a contract-check step (`scripts/contract-check.sh`).
- **Observability:** add actuator + micrometer to every service (user-service already
  has it); a Prometheus + Grafana compose profile later.
- **Security pass** before any public deployment: rotate the secret, lock CORS, add
  ownership checks (a user can only mutate their own tasks/goals — verify this is
  enforced server-side, not just by `user_id` filtering), rate-limit auth endpoints.
- **ADRs:** record every structural decision in `docs/adr/`.

## Rough sequencing

```
Wk 1     2     3     4     5     6     7     8     9    10   ...
P0 ▓
P1     ▓▓▓▓
P2.5     ▓▓▓▓        (parallel)
P2           ▓▓
P3              ▓▓▓▓
P4                      ▓▓▓▓▓▓
P5/P6                              ▓▓▓▓▓▓▓▓  (scope-gated)
```

## Decisions to lock before Phase 1

1. ~~Personal vs team scope~~ — **DECIDED in ADR-0004: personal-first, team-ready.**
2. **REST naming convention** (ADR-0005) — fix the `/create` vs `/createGoal` drift now,
   while only one frontend depends on it.
3. **Server state library** — confirm TanStack Query.
4. **Repo layout** — submodules vs vendored (ADR-0001 documents the choice).
