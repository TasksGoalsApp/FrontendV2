import type { KeyboardEvent } from 'react'

import { CatIcon } from '@/shared/components/cat-icon'

import type { Goal } from '../types'

const MUTED =
  'text-muted-foreground group-data-[selected=true]:text-primary-foreground/70 dark:group-data-[selected=true]:text-muted-foreground'

export function GoalRow({
  goal,
  selected,
  onSelect,
}: {
  goal: Goal
  selected: boolean
  onSelect: (id: string) => void
}) {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(goal.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      data-selected={selected}
      onClick={() => onSelect(goal.id)}
      onKeyDown={onKeyDown}
      className="group grid cursor-pointer grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded-xl px-4 py-3 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground sm:grid-cols-[86px_minmax(0,1fr)_118px_116px] dark:data-[selected=true]:bg-secondary dark:data-[selected=true]:text-foreground dark:data-[selected=true]:shadow-[inset_0_0_0_1.5px_var(--brand-lime)]"
    >
      <span className={`font-mono text-[13px] ${MUTED}`}>{goal.time}</span>

      <span className="flex min-w-0 items-center gap-3">
        <CatIcon icon={goal.icon} color={goal.color} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {goal.title}
          </span>
          <span className={`block text-xs ${MUTED}`}>{goal.sub}</span>
        </span>
      </span>

      {/* Due date + target collapse on the narrowest layout to keep rows readable. */}
      <span className="hidden text-[13px] font-medium sm:block">{goal.due}</span>
      <span className={`hidden text-[13px] sm:block ${MUTED}`}>{goal.target}</span>
    </div>
  )
}
