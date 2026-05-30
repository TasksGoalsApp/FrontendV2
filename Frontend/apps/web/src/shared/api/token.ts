import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'dd.accessToken'

/** The JWT payload our services issue (docs/API_CONTRACTS.md §1). */
export interface AuthClaims {
  sub: string // username
  id: number // the canonical user-id claim (a number)
  roles: string[] // UPPERCASE, e.g. ['CUSTOMER']
  iat?: number
  exp?: number
}

export interface AuthUser {
  id: number
  username: string
  roles: string[]
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Decode the token into a user, reading the contract's `id` claim. Returns null if the
 * token is absent, malformed, missing `id`, or expired — so callers treat all of those
 * as "not signed in".
 */
export function readUser(token: string | null = getToken()): AuthUser | null {
  if (!token) return null
  try {
    const claims = jwtDecode<AuthClaims>(token)
    if (claims.exp && claims.exp * 1000 <= Date.now()) return null
    if (typeof claims.id !== 'number') return null
    return { id: claims.id, username: claims.sub, roles: claims.roles ?? [] }
  } catch {
    return null
  }
}
