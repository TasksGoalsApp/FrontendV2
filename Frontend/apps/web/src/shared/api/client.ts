import { toast } from 'sonner'

import { clearToken, getToken } from './token'

/** A failed API call. `status` is 0 for network/CORS/server-unreachable errors. */
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  /** Attach the Bearer token (default true). */
  auth?: boolean
  signal?: AbortSignal
}

let onUnauthorized: (() => void) | null = null

/** The app registers what to do on a 401 (drop auth state + route to /login). */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

/**
 * Thin fetch wrapper for the backend: JSON in/out, Bearer token attach, and a single
 * place to handle 401s (clear token + toast + the registered handler) and unreachable
 * servers. Throws {@link ApiError} on any non-2xx so callers can branch on `status`.
 */
export async function apiFetch<T>(url: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal } = opts

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch {
    throw new ApiError(0, 'Could not reach the server. Is the backend running?')
  }

  if (res.status === 401) {
    clearToken()
    toast.error('Your session expired. Please sign in again.')
    onUnauthorized?.()
    throw new ApiError(401, 'Unauthorized')
  }

  if (!res.ok) {
    throw new ApiError(res.status, await extractError(res))
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

async function extractError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    return data.message ?? data.error ?? `Request failed (${res.status})`
  } catch {
    return `Request failed (${res.status})`
  }
}
