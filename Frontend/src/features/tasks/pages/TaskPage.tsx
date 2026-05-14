import TaskCalendar from "../components/TaskCalendar";
import { useTasks } from '../hooks/useTasks';
import { getCurrentUserId } from '@/features/auth/utils/auth-token';

export default function TasksPage() {
  const userId = getCurrentUserId();

  if (!userId) {
    return <p>User not authenticated.</p>;
  }

  const { tasks, isLoading, errorMessage } = useTasks(userId);

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tasks Calendar</h1>
      <TaskCalendar tasks={tasks} />
    </div>
  );
}