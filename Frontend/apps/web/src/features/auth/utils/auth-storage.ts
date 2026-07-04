import { STORAGE_KEYS } from '@/shared/constants/storage';
import type { AuthResponse } from '../types/auth.types';

export function saveAuthTokens(auth: AuthResponse) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, auth.accessToken);

  if (auth.idToken) {
    localStorage.setItem(STORAGE_KEYS.ID_TOKEN, auth.idToken);
  }
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ID_TOKEN);
}