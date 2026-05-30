import type { LucideIcon } from 'lucide-react'

import type { CategoryColor } from '@/shared/components/cat-icon'

export interface TaskItem {
  id: string
  time: string
  title: string
  tag: string
  icon: LucideIcon
  color: CategoryColor
  done: boolean
}

export interface HabitItem {
  id: string
  name: string
  streak: number
  done: boolean
}

export interface FocusGoal {
  id: string
  title: string
  category: string
  icon: LucideIcon
  color: CategoryColor
  pct: number
  /** Daily progress samples feeding the mini sparkline. */
  series: number[]
}
