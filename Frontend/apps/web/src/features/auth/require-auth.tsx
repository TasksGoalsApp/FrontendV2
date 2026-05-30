import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './auth-context'

/** Route guard for the authenticated app shell — bounces signed-out users to /login. */
export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
