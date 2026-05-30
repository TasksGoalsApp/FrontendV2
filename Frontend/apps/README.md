# apps/

Frontend applications.

```
apps/
└── web/      # the React 19 + Vite + Tailwind v4 + shadcn SPA (FrontendV2)
```

Drop the contents of **FrontendV2/Frontend** here as `apps/web`. It is the live
frontend wired to the microservices. Do **not** bring in the old `daily-dojo-site`
(Supabase) prototype — keep that purely as a design/feature reference.

## Env
`apps/web/.env`:
```
VITE_API_BASE_URL=http://localhost:8080      # the gateway, once it exists
# During early dev (no gateway yet), talk to services directly:
VITE_USER_SERVICE_URL=http://localhost:8081/user
VITE_TASK_SERVICE_URL=http://localhost:8082/tasks
VITE_GOAL_SERVICE_URL=http://localhost:8083/goal
```

## Run
```bash
make web-install
make web        # http://localhost:5173
```
