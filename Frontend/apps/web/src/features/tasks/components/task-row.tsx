import type { KeyboardEvent } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { CatIcon } from '@/shared/components/cat-icon'
import { PRIORITY_META } from '../data'
import { addDays, isSameDay, startOfDay } from '../lib/dates'
import type { Task } from '../types'
import { StatusBadge } from './status-badge'

function dueLabel(due: Date, today: Date): string {
  if (isSameDay(due, today)) return 'Today'
  if (isSameDay(due, addDays(today, 1))) return 'Tomorrow'
  if (isSameDay(due, addDays(today, -1))) return 'Yesterday'
  return due.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

export function TaskRow({
  task,
  today,
  selected,
  onSelect,
  onToggle,
}: {
  task: Task
  today: Date
  selected: boolean
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}) {
  const done = task.status === 'done'
  const overdue = startOfDay(task.due) < startOfDay(today) && !done

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(task.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      data-selected={selected}
      onClick={() => onSelect(task.id)}
      onKeyDown={onKeyDown}
      className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring data-[selected=true]:bg-secondary data-[selected=true]:ring-1 data-[selected=true]:ring-inset data-[selected=true]:ring-brand-lime"
    >
      <span onClick={(e) => e.stopPropagation()} className="flex">
        <Checkbox
          checked={done}
          onCheckedChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" ${done ? 'not done' : 'done'}`}
        />
      </span>

      <CatIcon icon={task.icon} color={task.category} />

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-sm font-medium',
            done && 'text-muted-foreground line-through'
          )}
        >
          {task.title}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {task.categoryLabel}
          {task.time ? ` · ${task.time}` : ''}
        </span>
      </span>

      <span
        title={`${PRIORITY_META[task.priority].label} priority`}
        className={cn(
          'hidden size-2 shrink-0 rounded-full sm:block',
          PRIORITY_META[task.priority].dot
        )}
      />
      <StatusBadge
        status={task.status}
        overdue={overdue}
        className="hidden w-[112px] shrink-0 md:inline-flex"
      />
      <span
        className={cn(
          'hidden w-[84px] shrink-0 text-right text-[13px] sm:block',
          overdue ? 'font-semibold text-status-blocked' : 'text-muted-foreground'
        )}
      >
        {dueLabel(task.due, today)}
      </span>
    </div>
  )
}
