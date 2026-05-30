import type { ReactNode } from 'react'
import {
  Award,
  CircleAlert,
  CircleCheck,
  CircleDot,
  ExternalLink,
  Flame,
  Pencil,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CatIcon } from '@/shared/components/cat-icon'
import { Sparkline } from '@/shared/components/sparkline'
import {
  completionRate,
  currentStreak,
  isDoneToday,
  rollingTrend,
} from '../lib/streak'
import type { Habit } from '../types'
import { StreakGrid } from './streak-grid'

export function HabitDetail({
  habit,
  onToggleToday,
  onEdit,
}: {
  habit: Habit
  onToggleToday: () => void
  onEdit?: () => void
}) {
  const streak = currentStreak(habit.history)
  const done = isDoneToday(habit.history)
  const rate = completionRate(habit.history)
  const cadence = habit.cadence === 'daily' ? 'Daily' : 'Weekly'

  return (
    <aside className="dd-scroll flex w-full shrink-0 flex-col gap-[22px] overflow-y-auto border-t border-border p-[26px] xl:w-[322px] xl:border-l xl:border-t-0">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold tracking-[-0.02em]">Habit Detail</h2>
        <button
          type="button"
          title="Open"
          aria-label="Open habit in full view"
          className="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          <ExternalLink className="size-[18px]" />
        </button>
      </div>

      <Detail label="Habit name" onEdit={onEdit} editLabel="Edit habit">
        <span className="text-base font-semibold">{habit.name}</span>
      </Detail>

      <Detail label="Today">
        {done ? (
          <span className="inline-flex items-center gap-[7px] text-base font-semibold text-status-done">
            <CircleCheck className="size-4" />
            Completed today
          </span>
        ) : streak > 0 ? (
          <span className="inline-flex items-center gap-[7px] text-base font-semibold text-status-warning">
            <CircleAlert className="size-4" />
            Streak at risk
          </span>
        ) : (
          <span className="inline-flex items-center gap-[7px] text-base font-semibold text-muted-foreground">
            <CircleDot className="size-4" />
            Not done yet
          </span>
        )}
      </Detail>

      <div className="grid grid-cols-2 gap-4">
        <Detail label="Current streak">
          <span className="inline-flex items-center gap-2 text-base font-semibold">
            <Flame
              className={cn(
                'size-[18px]',
                streak > 0 ? 'text-status-warning' : 'text-muted-foreground'
              )}
            />
            {streak} day{streak === 1 ? '' : 's'}
          </span>
        </Detail>
        <Detail label="Best streak">
          <span className="inline-flex items-center gap-2 text-base font-semibold">
            <Award className="size-[18px] text-muted-foreground" />
            {habit.best} day{habit.best === 1 ? '' : 's'}
          </span>
        </Detail>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Detail label="Cadence">
          <span className="text-base font-semibold">{cadence}</span>
        </Detail>
        <Detail label="Category">
          <span className="inline-flex items-center gap-2.5 text-base font-semibold">
            <CatIcon icon={habit.icon} color={habit.color} className="size-[28px]" />
            {habit.categoryLabel}
          </span>
        </Detail>
      </div>

      <div className="border-t border-border pt-[18px]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Last 21 days</span>
          <span className="rounded-full bg-[var(--lime-soft)] px-[10px] py-1 font-mono text-xs font-bold text-brand-lime-foreground">
            {rate}%
          </span>
        </div>
        <Sparkline data={rollingTrend(habit.history)} height={56} />
        <StreakGrid
          history={habit.history}
          color={habit.color}
          className="mt-3"
        />
      </div>

      <Button
        onClick={onToggleToday}
        variant={done ? 'outline' : 'default'}
        className="mt-auto w-full rounded-[11px]"
      >
        {done ? 'Undo today' : 'Mark done today'}
      </Button>
    </aside>
  )
}

function Detail({
  label,
  onEdit,
  editLabel,
  children,
}: {
  label: string
  onEdit?: () => void
  editLabel?: string
  children: ReactNode
}) {
  return (
    <div className="border-b border-border pb-[14px]">
      <div className="flex items-center justify-between">
        <div className="mb-[7px] text-xs text-muted-foreground">{label}</div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={editLabel ?? `Edit ${label.toLowerCase()}`}
            className="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
          >
            <Pencil className="size-[14px]" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
