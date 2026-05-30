import { cn } from '@/lib/utils'
import { addDays, isSameDay, startOfDay, startOfWeek } from '../lib/dates'
import type { Task } from '../types'
import { TaskChip } from './task-chip'

export function WeekView({
  tasks,
  today,
  onOpen,
}: {
  tasks: Task[]
  today: Date
  onOpen: (id: string) => void
}) {
  const start = startOfWeek(today)
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const t0 = startOfDay(today)

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {days.map((day) => {
        const items = tasks.filter((t) => isSameDay(t.due, day))
        const isToday = isSameDay(day, today)
        return (
          <div
            key={day.toISOString()}
            className={cn(
              'flex min-h-[176px] flex-col rounded-xl border p-2',
              isToday ? 'border-brand-lime bg-secondary/40' : 'border-border'
            )}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <span
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-wide',
                  isToday ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span
                className={cn(
                  'text-sm font-bold',
                  isToday &&
                    'flex size-6 items-center justify-center rounded-full bg-brand-lime text-brand-lime-foreground'
                )}
              >
                {day.getDate()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {items.map((t) => (
                <TaskChip
                  key={t.id}
                  task={t}
                  overdue={startOfDay(t.due) < t0 && t.status !== 'done'}
                  onClick={() => onOpen(t.id)}
                />
              ))}
              {items.length === 0 && (
                <span className="px-1.5 py-1 text-[11px] text-muted-foreground/60">
                  No tasks
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
