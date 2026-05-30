import type { ReactNode } from 'react'
import { Calendar, ExternalLink, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CatIcon } from '@/shared/components/cat-icon'
import { PRIORITY_META } from '../data'
import { startOfDay } from '../lib/dates'
import type { Task } from '../types'
import { StatusBadge } from './status-badge'

export function TaskDetail({
  task,
  today,
  onToggle,
  onEdit,
}: {
  task: Task
  today: Date
  onToggle: () => void
  onEdit?: () => void
}) {
  const done = task.status === 'done'
  const overdue = startOfDay(task.due) < startOfDay(today) && !done
  const dueText =
    task.due.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }) + (task.time ? ` · ${task.time}` : '')

  return (
    <aside className="dd-scroll flex w-full shrink-0 flex-col gap-[22px] overflow-y-auto border-t border-border p-[26px] xl:w-[322px] xl:border-l xl:border-t-0">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold tracking-[-0.02em]">Task Detail</h2>
        <button
          type="button"
          title="Open"
          aria-label="Open task in full view"
          className="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          <ExternalLink className="size-[18px]" />
        </button>
      </div>

      <Detail label="Task name" onEdit={onEdit} editLabel="Edit task">
        <span
          className={cn(
            'text-base font-semibold',
            done && 'text-muted-foreground line-through'
          )}
        >
          {task.title}
        </span>
      </Detail>

      <Detail label="Status">
        <StatusBadge
          status={task.status}
          overdue={overdue}
          className="text-base font-semibold"
        />
      </Detail>

      <div className="grid grid-cols-2 gap-4">
        <Detail label="Priority">
          <span className="inline-flex items-center gap-2 text-base font-semibold">
            <span
              className={cn('size-2.5 rounded-full', PRIORITY_META[task.priority].dot)}
            />
            {PRIORITY_META[task.priority].label}
          </span>
        </Detail>
        <Detail label="Due date">
          <span
            className={cn(
              'flex w-full items-center justify-between text-[15px] font-semibold',
              overdue && 'text-status-blocked'
            )}
          >
            {dueText}
            <Calendar className="size-[15px] shrink-0 text-muted-foreground" />
          </span>
        </Detail>
      </div>

      <Detail label="Category">
        <span className="inline-flex items-center gap-2.5 text-base font-semibold">
          <CatIcon icon={task.icon} color={task.category} className="size-[28px]" />
          {task.categoryLabel}
        </span>
      </Detail>

      <div className="border-b border-border pb-[14px]">
        <div className="mb-[7px] text-xs text-muted-foreground">Notes</div>
        <p className="text-[13px] leading-relaxed text-foreground/90">
          {task.notes ?? 'No notes yet.'}
        </p>
      </div>

      <Button
        onClick={onToggle}
        variant={done ? 'outline' : 'default'}
        className="mt-auto w-full rounded-[11px]"
      >
        {done ? 'Reopen task' : 'Mark complete'}
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
