import type { Habit } from '../types'

/** How many days of completion history we keep / render in the grid. */
export const HISTORY_DAYS = 21

/**
 * Current streak: consecutive completed days counting back from today. Today not
 * being done *yet* is treated as pending (a grace day), not a broken streak — so
 * a habit you haven't checked off today still shows its live streak until the
 * day ends. Marking today done extends it; an earlier gap ends it.
 */
export function currentStreak(history: boolean[]): number {
  let i = history.length - 1
  if (i >= 0 && !history[i]) i-- // today pending → count from yesterday
  let n = 0
  for (; i >= 0; i--) {
    if (history[i]) n++
    else break
  }
  return n
}

export function isDoneToday(history: boolean[]): boolean {
  return history[history.length - 1] === true
}

/** Completion rate across the kept history, 0–100. */
export function completionRate(history: boolean[]): number {
  if (history.length === 0) return 0
  return Math.round((history.filter(Boolean).length / history.length) * 100)
}

/** Rolling `window`-day completion count for each day — a 0..window trend line. */
export function rollingTrend(history: boolean[], window = 7): number[] {
  return history.map((_, i) => {
    let count = 0
    for (let j = Math.max(0, i - window + 1); j <= i; j++) {
      if (history[j]) count++
    }
    return count
  })
}

/** Flip today's completion and keep `best` up to date. Returns a new Habit. */
export function toggleToday(habit: Habit): Habit {
  const history = habit.history.slice()
  const last = history.length - 1
  history[last] = !history[last]
  return { ...habit, history, best: Math.max(habit.best, currentStreak(history)) }
}

/** A fresh, empty completion log for a brand-new habit. */
export function emptyHistory(): boolean[] {
  return Array.from({ length: HISTORY_DAYS }, () => false)
}
