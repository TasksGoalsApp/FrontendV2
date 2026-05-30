import type { ReactNode } from 'react'
import {
  Calendar,
  CircleCheck,
  CircleDot,
  ExternalLink,
  Pencil,
} from 'lucide-react'

import { Sparkline } from '@/shared/components/sparkline'

import type { Goal } from '../types'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function GoalDetail({
  goal,
  onEdit,
}: {
  goal: Goal
  onEdit?: () => void
}) {
  const done = goal.status === 'Completed'

  return (
    <aside className="dd-scroll flex w-full shrink-0 flex-col gap-[22px] overflow-y-auto border-t border-border p-[26px] xl:w-[322px] xl:border-l xl:border-t-0">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold tracking-[-0.02em]">Goal Detail</h2>
        <button
          type="button"
          title="Open"
          aria-label="Open goal in full view"
          className="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          <ExternalLink className="size-[18px]" />
        </button>
      </div>

      <Detail label="Goal name" onEdit={onEdit} editLabel="Edit goal">
        <span className="text-base font-semibold">{goal.title}</span>
      </Detail>

      <Detail label="Status">
        <span className="inline-flex items-center gap-[7px] text-base font-semibold">
          {done ? (
            <CircleCheck className="size-4 text-status-done" />
          ) : (
            <CircleDot className="size-4 text-status-progress" />
          )}
          {goal.status}
        </span>
      </Detail>

      <div className="grid grid-cols-2 gap-4">
        <Detail label="Start date">
          <DateVal value={goal.start} />
        </Detail>
        <Detail label="Due date">
          <DateVal value={goal.end} />
        </Detail>
      </div>

      <Detail label="Goal target">
        <span className="text-base font-semibold">{goal.target}</span>
      </Detail>

      <div className="border-t border-border pt-[18px]">
        <div className="mb-2 text-xs text-muted-foreground">Progress</div>
        <div className="mb-[10px] text-lg font-bold tracking-[-0.02em]">
          {goal.title}
        </div>
        <div className="mb-[14px] flex gap-2">
          <span className="rounded-full bg-[var(--lime-soft)] px-[10px] py-1 font-mono text-xs font-bold text-brand-lime-foreground">
            {goal.pct}%
          </span>
          <span className="rounded-full bg-[var(--lime-soft)] px-[10px] py-1 text-xs font-semibold text-brand-lime-foreground">
            {goal.sub}
          </span>
        </div>
        <Sparkline data={goal.series} />
        <div className="mt-2 flex justify-between">
          {DAYS.map((d) => (
            <span key={d} className="text-[11px] text-muted-foreground">
              {d}
            </span>
          ))}
        </div>
      </div>
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

function DateVal({ value }: { value: string }) {
  return (
    <span className="flex w-full items-center justify-between text-[15px] font-semibold">
      {value}
      <Calendar className="size-[15px] text-muted-foreground" />
    </span>
  )
}
