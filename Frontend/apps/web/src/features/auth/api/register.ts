import { userServiceClient } from "@/shared/lib/api-client";
import type { RegisterRequest } from "../types/auth.types";

export async function register(data: RegisterRequest) {
  const response = await userServiceClient.post("/register", data);
  return response.data;
}