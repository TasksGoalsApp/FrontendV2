/**
 * Backend service base URLs. Until the gateway lands (ADR-0003) the SPA talks to each
 * service on its own port (docs/API_CONTRACTS.md §2). Override per service via `.env`
 * (`VITE_USER_API`, `VITE_TASK_API`, `VITE_GOAL_API`) — see `.env.example`.
 */
const trim = (url: string) => url.replace(/\/+$/, '')

export const API = {
  user: trim(import.meta.env.VITE_USER_API ?? 'http://localhost:8081'),
  task: trim(import.meta.env.VITE_TASK_API ?? 'http://localhost:8082'),
  goal: trim(import.meta.env.VITE_GOAL_API ?? 'http://localhost:8083'),
} as const
