# Integration Fixes

Concrete, current bugs that stop the services working together, ordered by leverage.
Each has the symptom, the root cause, and the fix. These are the first work items in
Phase 0 of the development plan.

> **Resolved 2026-05-30 (step c):** §1 (claim `id`), §2 (role `CUSTOMER` casing + the
> `chk_user_role_role` constraint + a `LoginImpl` token-role bug found en route), and
> §3 (per-service `server.port`) are fixed in `services/`; `scripts/contract-check.sh`
> passes. §4–7 remain open.

---

## 1. JWT user-id claim mismatch  — **breaks all task/goal calls**

**Symptom:** a logged-in user gets a 500 (or null userId) on every task/goal request.

**Root cause:** the user-service issues the claim as `id`:

```java
// user-service JwtUtil.generateToken
.claim("id", userId)
```

but task-service and goal-service read `userId`:

```java
// task/goal controllers
long userId = Long.parseLong(jwt.getClaimAsString("userId"));   // claim doesn't exist → NPE
```

**Fix:** standardize on `id` (see `API_CONTRACTS.md` §1). In every task/goal controller:

```java
Long userId = ((Number) jwt.getClaim("id")).longValue();
```

Remove all `getClaimAsString("userId")` usages. `scripts/contract-check.sh` greps for
the stale pattern.

---

## 2. Role casing mismatch  — **403 even with a valid token**

**Symptom:** authenticated requests to task/goal return 403 Forbidden.

**Root cause:** the token carries `roles: ["CUSTOMER"]` (from the `Role` enum), which
Spring maps to authority `ROLE_CUSTOMER`. But the controllers require:

```java
@RolesAllowed({"Customer"})   // → needs ROLE_Customer, never granted
```

There is also a third casing in the DB constraint (`'Customer','Admin'`).

**Fix:** one casing everywhere — UPPERCASE.
- Controllers: `@RolesAllowed({"CUSTOMER"})`.
- DB constraint `chk_user_role_role`: allow `('CUSTOMER','ADMIN')`.
- Whatever writes `user_role` rows must write `CUSTOMER`/`ADMIN`.

---

## 3. Port collisions  — **only one of task/goal/notification can run**

**Symptom:** starting a second service fails with "port 8080 already in use".

**Root cause:** task, goal, and notification services don't set `server.port`, so all
default to `8080`.

**Fix:** add to each `application.properties`:

```properties
# task-service
server.port=8082
# goal-service
server.port=8083
# notification-service
server.port=8084
```

(user-service already sets `8081`.) Update the frontend `.env` accordingly until the
gateway lands.

---

## 4. Notification service can't reach RabbitMQ  — **broker config missing**

**Symptom:** notification-service fails to start or silently drops events; the
`@Value("${rabbitmq.exchange}")` etc. resolve to nothing.

**Root cause:** `notification-service/src/main/resources/application.properties` only
contains `spring.application.name`. The exchange/queue names and the broker connection
are unset.

**Fix:** add broker + queue config:

```properties
server.port=8084
spring.rabbitmq.host=${RABBITMQ_HOST:localhost}
spring.rabbitmq.port=5672
spring.rabbitmq.username=${RABBITMQ_USER:guest}
spring.rabbitmq.password=${RABBITMQ_PASSWORD:guest}

rabbitmq.exchange=notifications
rabbitmq.queues.task-due=task-due
rabbitmq.queues.task-overdue=task-overdue
rabbitmq.queues.habit-streak-risk=habit-streak-risk
rabbitmq.queues.habit-milestone=habit-milestone
rabbitmq.queues.goal-milestone=goal-milestone
rabbitmq.queues.goal-deadline=goal-deadline
rabbitmq.queues.digest=digest

spring.mail.host=${MAIL_HOST:localhost}
spring.mail.port=${MAIL_PORT:1025}
```

No service publishes events yet — that's Phase 3. For now this just lets the consumer
boot cleanly against the `rabbitmq` + `mailhog` containers.

---

## 5. Hardcoded, shared JWT secret in source  — **security smell**

**Symptom:** the same `jwt.secret=sOkb...` is committed in three `application.properties`.

**Fix:** externalize it. Same value across services, but from the environment:

```properties
jwt.secret=${JWT_SECRET}
jwt.expiration-ms=${JWT_EXPIRATION_MS:36000000}
```

Generate a real one with `openssl rand -base64 32`, put it in `.env`, and rotate the
committed one (treat it as compromised since it's in git history).

---

## 6. CORS wildcard with credentials  — **inconsistent and unsafe**

**Symptom:** works in dev, will bite later; `allowCredentials(true)` with `*` origin is
invalid per spec in some setups.

**Fix:** when the gateway lands, set CORS once there and lock origins to the SPA
(`http://localhost:5173` in dev, the real domain in prod). Remove `@CrossOrigin("*")`
from individual controllers.

---

## 7. Frontend resilience gaps  — **silent auth failures**

**Symptom:** an expired token logs a console warning but leaves the user on a broken page.

**Fix:** enable the 401 handler in `base-api-client.ts` (clear token + redirect to
`/login`), and surface task/goal errors with a toast (`sonner` is already installed)
instead of bare text.

---

## Suggested order

1 → 2 → 3 (get the three services talking to a real logged-in user) → 7 (make the
frontend usable) → 5 (secret) → 4 → 6 (gateway-time). Items 1–3 together are roughly a
half-day and unblock everything else.
