import type { LucideIcon } from 'lucide-react'

import type { CategoryColor } from '@/shared/components/cat-icon'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskView = 'list' | 'week' | 'month'

export interface Task {
  id: string
  title: string
  category: CategoryColor
  categoryLabel: string
  icon: LucideIcon
  /** Due date (day-resolution); `time` carries the optional clock label. */
  due: Date
  time?: string
  status: TaskStatus
  priority: TaskPriority
  notes?: string
}
