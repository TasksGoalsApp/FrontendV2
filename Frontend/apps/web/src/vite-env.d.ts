/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URLs for the backend services (no trailing slash). Default to the per-service
   * localhost ports from docs/API_CONTRACTS.md §2; override in `.env` (see `.env.example`).
   */
  readonly VITE_USER_API?: string
  readonly VITE_TASK_API?: string
  readonly VITE_GOAL_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
