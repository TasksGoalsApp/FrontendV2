import { cn } from '@/lib/utils'
import {
  addDays,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from '../lib/dates'
import type { Task } from '../types'
import { TaskChip } from './task-chip'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function MonthView({
  tasks,
  today,
  onOpen,
}: {
  tasks: Task[]
  today: Date
  onOpen: (id: string) => void
}) {
  const monthStart = startOfMonth(today)
  const gridStart = startOfWeek(monthStart)
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  const t0 = startOfDay(today)

  return (
    <div className="dd-scroll overflow-x-auto pb-2">
      <div className="min-w-[720px]">
        <div className="mb-2 grid grid-cols-7 gap-2">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((day) => {
            const inMonth = isSameMonth(day, monthStart)
            const isToday = isSameDay(day, today)
            const items = tasks.filter((t) => isSameDay(t.due, day))
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'flex min-h-[104px] flex-col rounded-xl border p-1.5',
                  isToday ? 'border-brand-lime' : 'border-border',
                  !inMonth && 'opacity-40'
                )}
              >
                <div className="mb-1 flex justify-end">
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      isToday
                        ? 'flex size-5 items-center justify-center rounded-full bg-brand-lime text-brand-lime-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {day.getDate()}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {items.slice(0, 3).map((t) => (
                    <TaskChip
                      key={t.id}
                      task={t}
                      overdue={startOfDay(t.due) < t0 && t.status !== 'done'}
                      onClick={() => onOpen(t.id)}
                    />
                  ))}
                  {items.length > 3 && (
                    <span className="px-1.5 text-[10px] font-medium text-muted-foreground">
                      +{items.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
