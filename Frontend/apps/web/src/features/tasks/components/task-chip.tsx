import { cn } from '@/shared/lib/utils'
import type { CategoryColor } from '@/shared/components/cat-icon'
import type { Task } from '../types/task.type'

const DOT: Record<CategoryColor, string> = {
  lime: 'bg-brand-lime',
  periwinkle: 'bg-brand-periwinkle',
  cyan: 'bg-brand-cyan',
}

/** Compact task pill used inside the week/month calendar cells. */
export function TaskChip({
  task,
  overdue,
  onClick,
}: {
  task: Task
  overdue?: boolean
  onClick: () => void
}) {
  const done = task.task_status === 'DONE'
  return (
    <button
      type="button"
      onClick={onClick}
      title={task.task_title}
      className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', DOT[task.category])} />
      <span
        className={cn(
          'truncate text-[11px] font-medium',
          done
            ? 'text-muted-foreground line-through'
            : overdue
              ? 'text-status-blocked'
              : 'text-foreground'
        )}
      >
        {task.time ? `${task.time} ` : ''}
        {task.task_title}
      </span>
    </button>
  )
}
