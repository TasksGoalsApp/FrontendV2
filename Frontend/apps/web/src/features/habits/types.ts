import type { LucideIcon } from 'lucide-react'

import type { CategoryColor } from '@/shared/components/cat-icon'

export type HabitCadence = 'daily' | 'weekly'

export interface Habit {
  id: string
  name: string
  color: CategoryColor
  categoryLabel: string
  icon: LucideIcon
  cadence: HabitCadence
  /** Best streak ever reached — kept because the rolling `history` window forgets it. */
  best: number
  /**
   * Completion log, oldest → newest; the last entry is today. The current streak
   * and "done today" are derived from this, so it's the single source of truth.
   */
  history: boolean[]
}
