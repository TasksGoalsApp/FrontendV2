import { Apple, BookOpen, Brain, Droplets, Dumbbell, NotebookPen } from 'lucide-react'

import type { Habit } from './types'
import { HISTORY_DAYS } from './lib/streak'

/**
 * Deterministic seed history. The `streak` most-recent completed days are filled,
 * the day before them is a miss (so the current streak reads exactly `streak`),
 * and `misses` sprinkle earlier gaps so the grid looks lived-in. With
 * `pendingToday`, today is left unchecked (the streak runs up to yesterday) so
 * the screen has real "mark done today" actions to take.
 */
function seed(
  streak: number,
  {
    misses = [],
    pendingToday = false,
  }: { misses?: number[]; pendingToday?: boolean } = {}
): boolean[] {
  const h = Array.from({ length: HISTORY_DAYS }, () => true)
  misses.forEach((i) => {
    if (i >= 0 && i < HISTORY_DAYS) h[i] = false
  })
  const today = HISTORY_DAYS - 1
  const lastDone = pendingToday ? today - 1 : today
  if (pendingToday) h[today] = false
  const breakIdx = lastDone - streak
  if (breakIdx >= 0) h[breakIdx] = false
  for (let i = Math.max(0, lastDone - streak + 1); i <= lastDone; i++) {
    h[i] = true
  }
  return h
}

export const HABITS: Habit[] = [
  {
    id: 'hb1',
    name: 'Meditate',
    color: 'lime',
    categoryLabel: 'Mindfulness',
    icon: Brain,
    cadence: 'daily',
    best: 18,
    history: seed(12, { misses: [2, 5] }),
  },
  {
    id: 'hb2',
    name: 'Read 20 minutes',
    color: 'periwinkle',
    categoryLabel: 'Learning',
    icon: BookOpen,
    cadence: 'daily',
    best: 14,
    history: seed(7, { misses: [3, 9, 10], pendingToday: true }),
  },
  {
    id: 'hb3',
    name: 'Workout',
    color: 'cyan',
    categoryLabel: 'Fitness',
    icon: Dumbbell,
    cadence: 'daily',
    best: 22,
    history: seed(3, { misses: [4, 8, 12, 15], pendingToday: true }),
  },
  {
    id: 'hb4',
    name: 'Journal',
    color: 'periwinkle',
    categoryLabel: 'Reflection',
    icon: NotebookPen,
    cadence: 'daily',
    best: 21,
    history: seed(21),
  },
  {
    id: 'hb5',
    name: 'No sugar',
    color: 'lime',
    categoryLabel: 'Nutrition',
    icon: Apple,
    cadence: 'weekly',
    best: 11,
    history: seed(5, { misses: [1, 7, 13], pendingToday: true }),
  },
  {
    id: 'hb6',
    name: 'Drink water',
    color: 'cyan',
    categoryLabel: 'Wellness',
    icon: Droplets,
    cadence: 'daily',
    best: 30,
    history: seed(9, { misses: [6] }),
  },
]
