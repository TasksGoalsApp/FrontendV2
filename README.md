# Daily Dojo — Platform Monorepo

A self-hosted productivity platform for individuals and small teams. It blends ideas
from Jira/Confluence (work + documentation), Tempo/Everhour (time tracking), and n8n
(automation) into a single, calmer product.

This repository is the **orchestration layer**: it ties together the existing
microservices, the frontend, shared contracts, infrastructure, and all planning docs
so the whole system can be developed, run, and reasoned about as one thing.

> **New here? Read [`CLAUDE.md`](./CLAUDE.md) first**, then
> [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and
> [`docs/DEVELOPMENT_PLAN.md`](./docs/DEVELOPMENT_PLAN.md).

---

## What's in the box

```
daily-dojo-platform/
├── CLAUDE.md                  # Context + working agreement for Claude Code
├── README.md                  # You are here
├── Makefile                   # One-word commands: make up / make down / make logs
├── docker-compose.infra.yml   # All databases + RabbitMQ + Mailhog + Adminer
├── .env.example               # Copy to .env and adjust
│
├── apps/                      # Frontends (drop FrontendV2 here as apps/web)
├── services/                  # Spring Boot microservices (user, task, goal, ...)
├── gateway/                   # API gateway plan (single entrypoint for the SPA)
├── packages/design-system/    # Shared UI: Shadcn + Radix Colors + Lucide tokens
├── infra/                     # DB init scripts, future infra-as-code
├── scripts/                   # dev-up, seed, contract-check helpers
└── docs/                      # Plans, audits, ADRs, contracts
    ├── DEVELOPMENT_PLAN.md     # Phased roadmap (start here for "what next")
    ├── ARCHITECTURE.md         # System overview + service map
    ├── API_CONTRACTS.md        # The shared truth between services (JWT, ports, DTOs)
    ├── INTEGRATION_FIXES.md    # Concrete bugs found in the current code + fixes
    ├── UX_AUDIT.md             # UX/UI audit of the current frontends
    ├── DESIGN_SYSTEM_BRIEF.md  # Brief to feed Claude Design / Claude
    └── adr/                    # Architecture Decision Records
```

The actual service source lives in separate repos today. See
[`services/README.md`](./services/README.md) and [`apps/README.md`](./apps/README.md)
for the two supported layouts (git submodules or vendored folders).

---

## Quick start (infrastructure only)

You can stand up every datastore the platform needs with one command, before touching
any service code.

```bash
cp .env.example .env
make up          # starts MySQL x3, RabbitMQ, Mailhog, Adminer
make ps          # see what's running
make down        # stop everything
```

| Service        | URL / Port              | Notes                              |
| -------------- | ----------------------- | ---------------------------------- |
| User DB        | `localhost:3307`        | MySQL — `UserDataSet`              |
| Task DB        | `localhost:3308`        | MySQL — `task_service_db`          |
| Goal DB        | `localhost:3309`        | MySQL — `goals_db`                 |
| RabbitMQ       | `localhost:5672`        | AMQP for the notification service  |
| RabbitMQ UI    | `localhost:15672`       | guest / guest                      |
| Mailhog (SMTP) | `localhost:1025`        | catches notification emails        |
| Mailhog UI     | `localhost:8025`        | read caught emails in the browser  |
| Adminer        | `localhost:8888`        | lightweight DB browser             |

---

## Running the full stack (after wiring services in)

```bash
make up              # infra
make user            # ./gradlew bootRun in services/user-service
make task            # services/task-service
make goal            # services/goal-service
make notification    # services/notification-service
make web             # apps/web  (Vite dev server on :5173)
```

See the `Makefile` for the exact commands and [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
for the port map.

---

## Status at a glance

| Area                 | State        | Where                                   |
| -------------------- | ------------ | --------------------------------------- |
| User service (auth)  | Working      | JWT login/register, roles               |
| Task service         | Built        | CRUD + subtasks; **JWT claim bug**      |
| Goal service         | Built        | CRUD + progress; **JWT claim bug**      |
| Notification service | Scaffolded   | RabbitMQ wiring, no publishers yet      |
| Habit service        | Empty        | README only                             |
| Frontend (V2)        | Early        | Auth + Tasks calendar + Profile         |
| API gateway          | Not built    | Planned — see `gateway/`                |
| Time tracking        | Not built    | Vision feature                          |
| Docs / wiki          | Not built    | Vision feature                          |
| Automation (n8n-ish) | Not built    | Vision feature                          |

The **JWT claim bug** breaks every authenticated call from the frontend to Task/Goal
today. It is the single highest-leverage fix. Full write-up:
[`docs/INTEGRATION_FIXES.md`](./docs/INTEGRATION_FIXES.md).
