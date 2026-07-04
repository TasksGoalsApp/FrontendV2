import { userServiceClient } from "@/shared/lib/api-client";
import type {LoginRequest, AuthResponse} from "../types/auth.types";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await userServiceClient.post('/login', data);
  return response.data;
}
