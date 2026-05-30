import type { KeyboardEvent } from 'react'
import { Check, Flame } from 'lucide-react'

import { cn } from '@/lib/utils'
import { CatIcon } from '@/shared/components/cat-icon'
import { completionRate, currentStreak, isDoneToday } from '../lib/streak'
import type { Habit } from '../types'
import { StreakGrid } from './streak-grid'

export function HabitCard({
  habit,
  selected,
  onSelect,
  onToggleToday,
}: {
  habit: Habit
  selected: boolean
  onSelect: (id: string) => void
  onToggleToday: (id: string) => void
}) {
  const streak = currentStreak(habit.history)
  const done = isDoneToday(habit.history)
  const rate = completionRate(habit.history)
  const cadence = habit.cadence === 'daily' ? 'Daily' : 'Weekly'

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(habit.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      data-selected={selected}
      onClick={() => onSelect(habit.id)}
      onKeyDown={onKeyDown}
      className="group flex cursor-pointer flex-col gap-3.5 rounded-2xl border border-border p-4 outline-none transition-colors hover:border-foreground/20 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring data-[selected=true]:border-foreground/25 data-[selected=true]:bg-secondary"
    >
      <div className="flex items-center gap-3">
        <CatIcon icon={habit.icon} color={habit.color} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{habit.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {habit.categoryLabel} · {cadence}
          </span>
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleToday(habit.id)
          }}
          aria-pressed={done}
          aria-label={
            done
              ? `Mark ${habit.name} not done today`
              : `Mark ${habit.name} done today`
          }
          className={cn(
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            done
              ? 'border-transparent bg-[var(--green-soft)] text-status-done'
              : 'border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground'
          )}
        >
          {done ? (
            <Check className="size-[18px]" />
          ) : (
            <span className="size-[18px] rounded-full border-[1.5px] border-current opacity-50" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
          <Flame
            className={cn(
              'size-4',
              streak > 0 ? 'text-status-warning' : 'text-muted-foreground'
            )}
          />
          {streak} day{streak === 1 ? '' : 's'}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{rate}%</span>
      </div>

      <StreakGrid history={habit.history} color={habit.color} days={14} />
    </div>
  )
}
