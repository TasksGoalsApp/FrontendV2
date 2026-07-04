import axios from "axios";
import { STORAGE_KEYS } from "@/shared/constants/storage";

export function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // REQUEST INTERCEPTOR (attach token)
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // RESPONSE INTERCEPTOR (handle errors)
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("Unauthorized request");

        // OPTIONAL (recommended later)
        // localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        // window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  return client;
}