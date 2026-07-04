
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  accessToken: string;
  idToken: string | null;
  tokenType: string;
  expiresIn: number;
}