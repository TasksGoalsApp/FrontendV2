import { createApiClient } from "./base-api-client";

export const userServiceClient = createApiClient(
  import.meta.env.VITE_USER_SERVICE_URL
);

export const taskServiceClient = createApiClient(
  import.meta.env.VITE_TASK_SERVICE_URL
);