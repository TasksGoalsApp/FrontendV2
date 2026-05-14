export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskScheduleType = 'DAY' | 'WEEK' | 'RANDOM';

export interface SubTask {
  sub_task_id: number;
  task_id: number;
  sub_task_title: string;
  sub_task_description?: string;
  completed?: boolean;
}

export interface Task {
  task_id: number;
  userId: number;
  task_title: string;
  task_description: string;
  task_status: TaskStatus;
  task_priority: TaskPriority;
  schedule_type: TaskScheduleType;
  start_date: string; // LocalDate -> "YYYY-MM-DD"
  end_date: string;   // LocalDate -> "YYYY-MM-DD"
  start_time: string; // LocalTime -> "HH:mm:ss"
  end_time: string;   // LocalTime -> "HH:mm:ss"
  subTasksList: SubTask[];
}