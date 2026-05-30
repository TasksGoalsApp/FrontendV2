import { apiFetch } from '@/shared/api/client'
import { API } from '@/shared/api/config'

/** user-service `POST /user/login` (docs/API_CONTRACTS.md §3) — note: username, not email. */
export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  idToken?: string | null
  tokenType: string
  expiresIn: number
}

/** user-service `POST /user/register` → CreateUserRequest. */
export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
  /** LocalDate, 'yyyy-mm-dd'. */
  dateOfBirth: string
}

export interface RegisterResponse {
  id: number
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(`${API.user}/user/login`, {
    method: 'POST',
    body: payload,
    auth: false,
  })
}

export function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>(`${API.user}/user/register`, {
    method: 'POST',
    body: payload,
    auth: false,
  })
}
