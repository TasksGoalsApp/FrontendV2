import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { setUnauthorizedHandler } from '@/shared/api/client'
import {
  clearToken,
  readUser,
  setToken,
  type AuthUser,
} from '@/shared/api/token'
import * as authApi from './api/auth-api'
import type { RegisterPayload } from './api/auth-api'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  /** Dev-only: start a decode-only demo session to preview the (still-mock) screens
   *  without a backend. No-ops outside `import.meta.env.DEV`. */
  enterDemo: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** A decode-only JWT (unsigned — `jwt-decode` never verifies the signature). DEV only. */
function makeDemoToken(): string {
  const b64url = (o: object) =>
    btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const now = Math.floor(Date.now() / 1000)
  const header = b64url({ alg: 'HS256', typ: 'JWT' })
  const payload = b64url({
    sub: 'demo',
    id: 1,
    roles: ['CUSTOMER'],
    iat: now,
    exp: now + 60 * 60 * 8, // 8h demo session
  })
  return `${header}.${payload}.demo-not-verified`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(() => readUser())

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    navigate('/login')
  }, [navigate])

  // A 401 from any API call drops the session and bounces to /login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      navigate('/login')
    })
    return () => setUnauthorizedHandler(null)
  }, [navigate])

  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.login({ username, password })
    setToken(res.accessToken)
    const next = readUser(res.accessToken)
    if (!next) throw new Error('The server returned an invalid token.')
    setUser(next)
  }, [])

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authApi.register(payload)
      // Smooth first run: log in immediately with the new credentials.
      await login(payload.username, payload.password)
    },
    [login]
  )

  const enterDemo = useCallback(() => {
    if (!import.meta.env.DEV) return
    const token = makeDemoToken()
    setToken(token)
    setUser(readUser(token))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, register, logout, enterDemo }),
    [user, login, register, logout, enterDemo]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
