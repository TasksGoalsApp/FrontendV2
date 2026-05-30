import type { LucideIcon } from 'lucide-react'

import type { CategoryColor } from '@/shared/components/cat-icon'

export type GoalCategory = CategoryColor
export type GoalStatus = 'Active' | 'Completed'

export interface Goal {
  id: string
  time: string
  icon: LucideIcon
  color: GoalCategory
  title: string
  sub: string
  due: string
  target: string
  status: GoalStatus
  start: string
  end: string
  pct: number
  /** Daily progress samples (Sun–Sat) feeding the detail sparkline. */
  series: number[]
}
