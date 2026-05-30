import {
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDot,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { TaskStatus } from '../types'

const META: Record<
  TaskStatus | 'overdue',
  { label: string; cls: string; Icon: LucideIcon }
> = {
  todo: { label: 'To do', cls: 'text-status-muted', Icon: Circle },
  in_progress: { label: 'In progress', cls: 'text-status-progress', Icon: CircleDot },
  done: { label: 'Done', cls: 'text-status-done', Icon: CircleCheck },
  overdue: { label: 'Overdue', cls: 'text-status-blocked', Icon: CircleAlert },
}

export function StatusBadge({
  status,
  overdue,
  className,
}: {
  status: TaskStatus
  overdue?: boolean
  className?: string
}) {
  const key = overdue && status !== 'done' ? 'overdue' : status
  const { label, cls, Icon } = META[key]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[13px] font-medium',
        cls,
        className
      )}
    >
      <Icon className="size-[15px] shrink-0" />
      {label}
    </span>
  )
}
