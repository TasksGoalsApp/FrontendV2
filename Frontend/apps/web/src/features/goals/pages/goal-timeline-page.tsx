import { useMemo, useState, type ReactNode } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { categoryByKey, resolveCategoryKey } from '@/shared/categories'
import {
  CreateEditDialog,
  formatGoalDate,
  looseDateToInput,
  nowTimeLabel,
  type DialogMode,
  type GoalFormValues,
} from '@/shared/create-edit'
import { SummaryStrip } from '@/shared/components/summary-strip'
import { ThemeToggle } from '@/shared/theme/theme-toggle'
import { GoalDetail } from '../components/goal-detail'
import { GoalRow } from '../components/goal-row'
import { ALL_GOALS, SUMMARY_CELLS } from '../data'
import type { Goal } from '../types'

let goalSeq = 0
function nextGoalId() {
  return `g-${Date.now().toString(36)}-${goalSeq++}`
}

/**
 * Bridge the shared form values to the local Goal shape (and back for edit).
 * Progress (pct/series) isn't user-entered — new goals start flat; edits keep
 * the existing samples. Becomes the create/update mutation map in step (c).
 */
function goalFromValues(values: GoalFormValues, existing?: Goal): Goal {
  const category = categoryByKey(values.categoryKey)
  return {
    id: existing?.id ?? nextGoalId(),
    time: existing?.time ?? nowTimeLabel(),
    icon: category.icon,
    color: category.color,
    title: values.title,
    sub: category.label,
    due: formatGoalDate(values.end),
    target: values.target,
    status: values.status,
    start: formatGoalDate(values.start),
    end: formatGoalDate(values.end),
    pct: existing?.pct ?? 0,
    series: existing?.series ?? [0, 0, 0, 0, 0, 0, 0, 0, 0],
  }
}

function valuesFromGoal(goal: Goal): Partial<GoalFormValues> {
  return {
    title: goal.title,
    categoryKey: resolveCategoryKey(goal.sub, goal.color),
    target: goal.target,
    start: looseDateToInput(goal.start),
    end: looseDateToInput(goal.end),
    status: goal.status,
  }
}

const GRID = 'grid-cols-[64px_minmax(0,1fr)] sm:grid-cols-[86px_minmax(0,1fr)_118px_116px]'

export function GoalTimelinePage() {
  const [goals, setGoals] = useState<Goal[]>(ALL_GOALS)
  const [selected, setSelected] = useState('android')
  const [query, setQuery] = useState('')
  const [dialog, setDialog] = useState<{
    open: boolean
    mode: DialogMode
    editId?: string
  }>({ open: false, mode: 'create' })

  const q = query.trim().toLowerCase()
  const inProgress = useMemo(
    () =>
      goals.filter(
        (g) => g.status === 'Active' && g.title.toLowerCase().includes(q)
      ),
    [goals, q]
  )
  const done = useMemo(
    () =>
      goals.filter(
        (g) => g.status === 'Completed' && g.title.toLowerCase().includes(q)
      ),
    [goals, q]
  )

  const goal = goals.find((g) => g.id === selected) ?? goals[0]

  const editingGoal = dialog.editId
    ? goals.find((g) => g.id === dialog.editId)
    : undefined
  const dialogInitial =
    dialog.mode === 'edit' && editingGoal ? valuesFromGoal(editingGoal) : undefined

  function handleDialogSubmit(values: GoalFormValues) {
    if (dialog.mode === 'edit' && editingGoal) {
      setGoals((prev) =>
        prev.map((g) => (g.id === editingGoal.id ? goalFromValues(values, g) : g))
      )
      toast.success('Goal updated', { description: values.title })
    } else {
      const created = goalFromValues(values)
      setGoals((prev) => [created, ...prev])
      setSelected(created.id)
      toast.success('Goal added', { description: values.title })
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
      <main className="dd-scroll flex min-w-0 flex-1 flex-col overflow-y-auto px-4 py-[26px] sm:px-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[26px] font-bold tracking-[-0.025em] sm:text-[30px]">
            Goal Timeline
          </h1>
          <div className="flex items-center gap-[10px]">
            <div className="flex w-[160px] items-center gap-2 rounded-[11px] border border-border bg-secondary px-[13px] py-[10px] sm:w-[220px]">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search goal"
                aria-label="Search goal"
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
              />
            </div>
            <ThemeToggle className="size-10 rounded-[11px]" />
            <Button
              onClick={() => setDialog({ open: true, mode: 'create' })}
              aria-label="Add goal"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add Goal</span>
            </Button>
          </div>
        </div>

        <SummaryStrip cells={SUMMARY_CELLS} />

        <div
          className={`mb-2 grid ${GRID} gap-3 border-b border-border px-4 pb-3`}
        >
          <span className="text-xs text-muted-foreground">Date created</span>
          <span className="text-xs text-muted-foreground">Goal name</span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            Due date
          </span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            Goal target
          </span>
        </div>

        <SectionLabel>On progress</SectionLabel>
        <div className="mb-[18px] flex flex-col gap-0.5">
          {inProgress.map((g) => (
            <GoalRow
              key={g.id}
              goal={g}
              selected={selected === g.id}
              onSelect={setSelected}
            />
          ))}
          {inProgress.length === 0 && <EmptyRow />}
        </div>

        <SectionLabel>Goal done</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {done.map((g) => (
            <GoalRow
              key={g.id}
              goal={g}
              selected={selected === g.id}
              onSelect={setSelected}
            />
          ))}
          {done.length === 0 && <EmptyRow />}
        </div>
      </main>

      <GoalDetail
        goal={goal}
        onEdit={() => setDialog({ open: true, mode: 'edit', editId: goal.id })}
      />

      <CreateEditDialog
        kind="goal"
        mode={dialog.mode}
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        initial={dialogInitial}
        onSubmit={handleDialogSubmit}
      />
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 pb-3 pt-[10px] text-[19px] font-bold tracking-[-0.01em]">
      {children}
    </div>
  )
}

function EmptyRow() {
  return (
    <div className="px-4 py-6 text-[13px] text-muted-foreground">
      No goals match your search.
    </div>
  )
}
