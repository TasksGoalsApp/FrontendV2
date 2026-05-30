# Architecture

## System shape today

Daily Dojo is a **microservices** system: independent Spring Boot apps, each owning its
own MySQL database, fronted by a single-page React app. Authentication is a shared
**JWT** that every service validates locally (no central auth call per request).

```
                         ┌──────────────────────────────┐
                         │  React SPA (Vite, :5173)       │
                         │  features: auth, tasks, ...    │
                         └───────────────┬────────────────┘
                                         │ Bearer JWT
              ┌──────────────────────────┼───────────────────────────┐
              │                          │                           │
       ┌──────▼──────┐          ┌────────▼────────┐         ┌────────▼────────┐
       │ user-service│          │  task-service   │         │  goal-service   │
       │   :8081     │          │    :8082        │         │    :8083        │
       │ MySQL 3307  │          │  MySQL 3308     │         │  MySQL 3309     │
       └─────────────┘          └─────────────────┘         └─────────────────┘
              │                          │                           │
              │  issues JWT              │  (future) publishes events│
              └──────────────────────────┴──────────────┬────────────┘
                                                         │
                                              ┌──────────▼──────────┐
                                              │ RabbitMQ (topic)     │
                                              └──────────┬──────────┘
                                                         │ consumes
                                              ┌──────────▼──────────┐
                                              │ notification-service │
                                              │   :8084  ──▶ SMTP    │
                                              └─────────────────────┘
```

> **Planned:** a Spring Cloud Gateway at `:8080` becomes the only port the browser
> talks to. See `gateway/README.md` and `adr/0003-api-gateway.md`.

## Services

| Service              | Owns                          | Port  | DB port | Auth                          | State        |
| -------------------- | ----------------------------- | ----- | ------- | ----------------------------- | ------------ |
| user-service         | users, roles, login, JWT      | 8081  | 3307    | issues tokens; resource server| Working      |
| task-service         | tasks, subtasks               | 8082* | 3308    | resource server               | JWT bug      |
| goal-service         | goals, progress, categories   | 8083* | 3309    | resource server               | JWT bug      |
| notification-service | email + RabbitMQ consumers    | 8084* | —       | none yet                      | Scaffolded   |
| habit-service        | habits, streaks               | 8085* | TBD     | resource server               | Empty        |

\* These services currently do **not** set `server.port` and all default to `8080`.
The ports above are the agreed targets — see `INTEGRATION_FIXES.md` §3.

## Layering (backend)

Each service follows the same clean-ish layering. Keep it consistent:

```
controller/      REST endpoints, @RolesAllowed, reads JWT claims
business/        interfaces (ICreateTask) + Impl/ (CreateTaskImpl)
   rules/        pure domain rules (e.g. GoalStatusResolver, TaskScheduleValidator)
domain/          DTOs: *Request / *Response, domain models, enums
   *Convertor     entity ↔ domain mapping
repository/      JPA entities + Spring Data repositories
exception/       GlobalExceptionHandler + typed exceptions
security/        SecurityConfig (resource server), JWT plumbing
```

The user-service additionally owns token *issuance* (`JwtUtil`, `LoginImpl`) and a
custom `JwtAuthenticationFilter`.

## Frontend

```
src/
  app/            App, router (public / auth / protected route groups)
  shared/         api clients (axios + interceptors), ui/ (shadcn), layouts
  features/
    auth/         login, register, token utils, jwt-decode
    tasks/        calendar view, hooks, api
    profile/
    home/
```

`shared/lib/base-api-client.ts` attaches the Bearer token via an axios request
interceptor and has a (currently disabled) 401 handler. Per-service axios instances
are created in `shared/lib/api-client.ts`.

## Data ownership

- **No shared database.** A service never queries another's tables. `user_id` is a
  foreign concept carried in the JWT and stored as a plain column elsewhere — there is
  intentionally no FK from `tasks.user_id` to the users table (different DB).
- **Eventual consistency** for cross-cutting concerns (notifications) via RabbitMQ.

## Event model (notification-service)

A topic exchange with routing keys already defined in `RabbitMQConfig`:

| Routing key          | Queue                 | Emitted by (future) |
| -------------------- | --------------------- | ------------------- |
| `task.due_soon`      | task-due              | task-service        |
| `task.overdue`       | task-overdue          | task-service        |
| `goal.milestone`     | goal-milestone        | goal-service        |
| `goal.deadline`      | goal-deadline         | goal-service        |
| `habit.streak_risk`  | habit-streak-risk     | habit-service       |
| `habit.milestone`    | habit-milestone       | habit-service       |
| `digest.#`           | digest                | a scheduler         |

The consumers and event DTOs exist; **no service publishes these events yet**, and the
broker connection config is missing from the notification service's
`application.properties`. Wiring publishers is a Phase 3 task.

## Cross-cutting concerns status

| Concern            | Now                                   | Target                          |
| ------------------ | ------------------------------------- | ------------------------------- |
| AuthN              | shared HS256 JWT                      | keep; rotate secret via env     |
| AuthZ              | `@RolesAllowed`, role in JWT          | fix casing; add ownership checks|
| CORS               | `*` on every service                  | single policy at the gateway    |
| Config             | hardcoded in `application.properties` | env vars / Spring profiles      |
| Observability      | actuator + micrometer (user only)     | all services + Prometheus       |
| API gateway        | none                                  | Spring Cloud Gateway `:8080`    |
| Service discovery  | hardcoded ports                       | fine at this scale; revisit later|
