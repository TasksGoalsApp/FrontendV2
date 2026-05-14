import { useEffect, useState } from 'react';
import { getTasksByUser } from '../api/getTasks';
import type { Task } from '../types/tasks.type';

export function useTasks(userId: number) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!userId) return;

    async function loadTasks() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getTasksByUser(userId);
        setTasks(data);
      } catch {
        setErrorMessage('Failed to load tasks.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, [userId]);

  return { tasks, isLoading, errorMessage };
}