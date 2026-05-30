import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { categoryByKey, resolveCategoryKey } from '@/shared/categories'
import {
  CreateEditDialog,
  type DialogMode,
  type HabitFormValues,
} from '@/shared/create-edit'
import {
  SummaryStrip,
  type SummaryCell,
} from '@/shared/components/summary-strip'
import { ThemeToggle } from '@/shared/theme/theme-toggle'
import { HabitCard } from '../components/habit-card'
import { HabitDetail } from '../components/habit-detail'
import { HABITS } from '../data'
import {
  completionRate,
  currentStreak,
  emptyHistory,
  isDoneToday,
  toggleToday,
} from '../lib/streak'
import type { Habit } from '../types'

let habitSeq = 0
function nextHabitId() {
  return `hb-${Date.now().toString(36)}-${habitSeq++}`
}

/**
 * Bridge the shared form values to the local Habit shape (and back for edit).
 * Streak/history aren't user-entered — a new habit starts with an empty log;
 * edits keep the existing one. Becomes the create/update mutation map in (c).
 */
function habitFromValues(values: HabitFormValues, existing?: Habit): Habit {
  const category = categoryByKey(values.categoryKey)
  return {
    id: existing?.id ?? nextHabitId(),
    name: values.name,
    color: category.color,
    categoryLabel: category.label,
    icon: category.icon,
    cadence: values.cadence,
    best: existing?.best ?? 0,
    history: existing?.history ?? emptyHistory(),
  }
}

function valuesFromHabit(habit: Habit): Partial<HabitFormValues> {
  return {
    name: habit.name,
    categoryKey: resolveCategoryKey(habit.categoryLabel, habit.color),
    cadence: habit.cadence,
  }
}

export function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(HABITS)
  const [selected, setSelected] = useState(HABITS[0].id)
  const [dialog, setDialog] = useState<{
    open: boolean
    mode: DialogMode
    editId?: string
  }>({ open: false, mode: 'create' })

  const selectedHabit = habits.find((h) => h.id === selected) ?? habits[0]

  const summary = useMemo<SummaryCell[]>(() => {
    const doneToday = habits.filter((h) => isDoneToday(h.history)).length
    const longest = habits.reduce((m, h) => Math.max(m, currentStreak(h.history)), 0)
    const avg = habits.length
      ? Math.round(
          habits.reduce((s, h) => s + completionRate(h.history), 0) / habits.length
        )
      : 0
    return [
      { label: 'Active habits', value: String(habits.length) },
      { label: 'Done today', value: `${doneToday} of ${habits.length}` },
      { label: 'Longest streak', value: `${longest} days` },
      { label: 'Avg completion', value: `${avg}%` },
    ]
  }, [habits])

  function handleToggle(id: string) {
    setHabits((prev) => prev.map((h) => (h.id === id ? toggleToday(h) : h)))
  }

  const editingHabit = dialog.editId
    ? habits.find((h) => h.id === dialog.editId)
    : undefined
  const dialogInitial =
    dialog.mode === 'edit' && editingHabit ? valuesFromHabit(editingHabit) : undefined

  function handleDialogSubmit(values: HabitFormValues) {
    if (dialog.mode === 'edit' && editingHabit) {
      setHabits((prev) =>
        prev.map((h) => (h.id === editingHabit.id ? habitFromValues(values, h) : h))
      )
      toast.success('Habit updated', { description: values.name })
    } else {
      const created = habitFromValues(values)
      setHabits((prev) => [created, ...prev])
      setSelected(created.id)
      toast.success('Habit added', { description: values.name })
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
      <main className="dd-scroll flex min-w-0 flex-1 flex-col overflow-y-auto px-4 py-[26px] sm:px-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[26px] font-bold tracking-[-0.025em] sm:text-[30px]">
            Habits
          </h1>
          <div className="flex items-center gap-[10px]">
            <ThemeToggle className="size-10 rounded-[11px]" />
            <Button
              onClick={() => setDialog({ open: true, mode: 'create' })}
              aria-label="Add habit"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add habit</span>
            </Button>
          </div>
        </div>

        <SummaryStrip cells={summary} />

        <div className="grid gap-3 pt-1 sm:grid-cols-2 2xl:grid-cols-3">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              selected={selected === h.id}
              onSelect={setSelected}
              onToggleToday={handleToggle}
            />
          ))}
        </div>
      </main>

      <HabitDetail
        habit={selectedHabit}
        onToggleToday={() => handleToggle(selectedHabit.id)}
        onEdit={() =>
          setDialog({ open: true, mode: 'edit', editId: selectedHabit.id })
        }
      />

      <CreateEditDialog
        kind="habit"
        mode={dialog.mode}
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        initial={dialogInitial}
        onSubmit={handleDialogSubmit}
      />
    </div>
  )
}
