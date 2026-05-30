# API Contracts

This is the **single source of truth** for everything that crosses a service boundary:
the JWT, ports, and the REST surface. If you change any of these in code, change it here
in the same commit. `scripts/contract-check.sh` enforces the easy parts.

## 1. The JWT contract (most important)

All services share one HS256 secret and must agree on claim names and role strings.

**Canonical token payload:**

```json
{
  "sub": "<username>",
  "id": 42,
  "roles": ["CUSTOMER"],
  "iat": 1716800000,
  "exp": 1716836000
}
```

> **Status — conformed in code 2026-05-30 (step c).** user / task / goal / notification
> all match the rules below; `scripts/contract-check.sh` passes.

**Rules:**
- The user id claim is named **`id`** (a number). Services read it as a number, not a
  string, via `((Number) jwt.getClaim("id")).longValue()`. *(task/goal previously read
  `userId` as a string — fixed.)*
- The `roles` claim is a **list of strings**. Casing is **UPPERCASE**: `CUSTOMER`,
  `ADMIN` — matching the Java `Role` enum. The token must carry the enum **name**
  (`Role.name()`), not an entity `toString()`. *(user-service `LoginImpl` previously
  embedded the `UserRoleEntity` toString — fixed.)*
- Spring maps each role `R` to authority `ROLE_R`. Therefore controllers must use
  `@RolesAllowed({"CUSTOMER"})` / `@PreAuthorize("hasRole('CUSTOMER')")`, **not**
  `"Customer"`. *(task/goal previously used `"Customer"` — fixed.)*
- The DB `chk_user_role_role` constraint must allow the same casing
  (`'CUSTOMER','ADMIN'`). *(previously `'Customer','Admin'` — fixed.)*

Reading the id claim, the agreed way (works whether the JWT lib boxes it as Integer or Long):

```java
Long userId = ((Number) jwt.getClaim("id")).longValue();
```

## 2. Port map

| Component            | Port  | Base path        |
| -------------------- | ----- | ---------------- |
| API gateway (future) | 8080  | `/api`           |
| user-service         | 8081  | `/user`          |
| task-service         | 8082  | `/tasks`         |
| goal-service         | 8083  | `/goal`          |
| notification-service | 8084  | `/notifications` |
| habit-service        | 8085  | `/habits`        |
| Frontend (Vite)      | 5173  | —                |

DB ports: user `3307`, task `3308`, goal `3309` (each MySQL container maps to `3306`).

## 3. REST surface (current)

### user-service `/user`
| Method | Path              | Auth        | Body / notes                          |
| ------ | ----------------- | ----------- | ------------------------------------- |
| POST   | `/register`       | public      | CreateUserRequest → 201               |
| POST   | `/login`          | public      | LoginRequest → `{accessToken,...}`    |
| GET    | `/me`             | CUSTOMER/ADMIN | reads `id` from JWT                |
| PUT    | `/update`         | CUSTOMER/ADMIN | UpdateUserInfoRequest              |
| DELETE | `/me`             | CUSTOMER    | deletes self                          |
| GET    | `/admin/{userid}` | ADMIN       | fetch any user                        |

### task-service `/tasks`
| Method | Path        | Auth     | Notes                              |
| ------ | ----------- | -------- | ---------------------------------- |
| POST   | `/create`   | CUSTOMER | CreateTaskRequest, userId from JWT |
| PUT    | `/`         | CUSTOMER | UpdateTaskRequest                  |
| GET    | `/user`     | CUSTOMER | all tasks for the JWT user         |

Subtasks live under `SubTaskController` (create/update/delete/list by task).

### goal-service `/goal`
| Method | Path                   | Auth     | Notes                  |
| ------ | ---------------------- | -------- | ---------------------- |
| GET    | `/`                    | CUSTOMER | goals for JWT user     |
| POST   | `/createGoal`          | CUSTOMER | CreateGoalRequest      |
| PUT    | `/updateGoal`          | CUSTOMER | UpdateGoalRequest      |
| PATCH  | `/{goalId}/progress`   | CUSTOMER | UpdateGoalProgressRequest |
| DELETE | `/{goalId}`            | CUSTOMER | ownership-checked      |

### notification-service
| Method | Path  | Auth | Notes                          |
| ------ | ----- | ---- | ------------------------------ |
| POST   | `/`   | none | accepts a Notification → 202   |

> **Naming drift to resolve:** task uses `/create`, `/user`; goal uses `/createGoal`,
> `/updateGoal`. Pick one convention (recommend REST-style: `POST /tasks`,
> `GET /tasks`, `PUT /tasks/{id}`) and apply it behind the gateway's `/api` prefix.
> Track in an ADR before changing, since the frontend depends on these paths.

## 4. Shared enums

```
TaskStatus     = TODO | IN_PROGRESS | DONE | BLOCKED | CANCELED
TaskPriority   = LOW | MEDIUM | HIGH | URGENT
TaskScheduleType = FIXED_TIME | ALL_DAY | WEEK_RANGE
Role           = CUSTOMER | ADMIN
GoalStatus     = (see goal-service domain/Status.java)
GoalCategory   = (see goal-service domain/Category.java)
```

When the frontend mirrors these as TS unions, keep the strings byte-identical.
