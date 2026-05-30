import { useMemo, type ReactNode } from 'react'
import { ClipboardList } from 'lucide-react'

import { cn } from '@/lib/utils'
import { isSameDay, startOfDay } from '../lib/dates'
import type { Task } from '../types'
import { TaskRow } from './task-row'

export function ListView({
  tasks,
  today,
  selected,
  onSelect,
  onToggle,
}: {
  tasks: Task[]
  today: Date
  selected: string
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}) {
  const t0 = startOfDay(today)
  const groups = useMemo(() => {
    const active = tasks.filter((t) => t.status !== 'done')
    return {
      overdue: active.filter((t) => startOfDay(t.due) < t0),
      today: active.filter((t) => isSameDay(t.due, today)),
      upcoming: active.filter((t) => startOfDay(t.due) > t0),
      completed: tasks.filter((t) => t.status === 'done'),
    }
  }, [tasks, today, t0])

  const total =
    groups.overdue.length +
    groups.today.length +
    groups.upcoming.length +
    groups.completed.length

  if (total === 0) return <EmptyState />

  const rows = (items: Task[]) =>
    items.map((t) => (
      <TaskRow
        key={t.id}
        task={t}
        today={today}
        selected={selected === t.id}
        onSelect={onSelect}
        onToggle={onToggle}
      />
    ))

  return (
    <div className="flex flex-col gap-5">
      <Group label="Overdue" count={groups.overdue.length} accent>
        {rows(groups.overdue)}
      </Group>
      <Group label="Today" count={groups.today.length}>
        {rows(groups.today)}
      </Group>
      <Group label="Upcoming" count={groups.upcoming.length}>
        {rows(groups.upcoming)}
      </Group>
      <Group label="Completed" count={groups.completed.length}>
        {rows(groups.completed)}
      </Group>
    </div>
  )
}

function Group({
  label,
  count,
  accent,
  children,
}: {
  label: string
  count: number
  accent?: boolean
  children: ReactNode
}) {
  if (count === 0) return null
  return (
    <section>
      <div className="flex items-center gap-2 px-1 pb-2">
        <h2 className="text-[15px] font-bold tracking-[-0.01em]">{label}</h2>
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
            accent
              ? 'bg-[color-mix(in_oklch,var(--status-blocked)_15%,transparent)] text-status-blocked'
              : 'bg-secondary text-muted-foreground'
          )}
        >
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <ClipboardList className="size-6" />
      </div>
      <div>
        <p className="text-sm font-semibold">No tasks here</p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Nothing matches this filter — try another, or add a task.
        </p>
      </div>
    </div>
  )
}
