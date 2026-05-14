import { taskServiceClient } from '@/shared/lib/api-client';
import type { Task } from '../types/tasks.type';

export async function getTasksByUser(userId: number): Promise<Task[]> {
  const response = await taskServiceClient.get(`/user/${userId}`);
  return response.data.tasks;
}