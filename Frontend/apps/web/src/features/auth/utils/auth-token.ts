import { jwtDecode } from 'jwt-decode';
import { getAccessToken } from './auth-storage';

interface AccessTokenPayload {
  id: number;
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export function getCurrentUserId(): number | null {
  const token = getAccessToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode<AccessTokenPayload>(token);

    return decoded.id;
  } catch (error) {
    console.error('Invalid JWT token', error);
    return null;
  }
}