import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, CircleCheck, Flame, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { categoryByKey } from '@/shared/categories'
import {
  CreateEditDialog,
  todayInput,
  type TaskFormValues,
} from '@/shared/create-edit'
import { CatIcon } from '@/shared/components/cat-icon'
import { Sparkline } from '@/shared/components/sparkline'
import { SummaryStrip } from '@/shared/components/summary-strip'
import { ThemeToggle } from '@/shared/theme/theme-toggle'
import { FOCUS_GOALS, TODAY_HABITS, TODAY_TASKS, USER } from '../data'
import type { TaskItem } from '../types'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const TODAY_LABEL = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

let todaySeq = 0
function nextTodayId() {
  return `t-${Date.now().toString(36)}-${todaySeq++}`
}

/** Map the shared task form onto Today's lighter TaskItem shape. */
function todayTaskFromValues(values: TaskFormValues): TaskItem {
  const category = categoryByKey(values.categoryKey)
  return {
    id: nextTodayId(),
    time: values.time,
    title: values.title,
    tag: category.label,
    icon: category.icon,
    color: category.color,
    done: values.status === 'done',
  }
}

export function TodayPage() {
  const [tasks, setTasks] = useState(TODAY_TASKS)
  const [habits, setHabits] = useState(TODAY_HABITS)
  const [createOpen, setCreateOpen] = useState(false)

  function addTask(values: TaskFormValues) {
    setTasks((prev) => [todayTaskFromValues(values), ...prev])
    toast.success('Task added', { description: values.title })
  }

  const tasksLeft = tasks.filter((t) => !t.done).length
  const habitsDone = habits.filter((h) => h.done).length

  const cells = [
    {
      label: 'Today',
      value: tasksLeft === 0 ? 'All done' : `${tasksLeft} tasks left`,
    },
    { label: 'Active goals', value: `${FOCUS_GOALS.length} goals` },
    { label: 'Habits', value: `${habitsDone} of ${habits.length}` },
    { label: 'Day streak', value: '12 days' },
  ]

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }
  function toggleHabit(id: string) {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    )
  }

  return (
    <main className="dd-scroll flex min-w-0 flex-1 flex-col overflow-y-auto px-4 py-[26px] sm:px-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.025em] sm:text-[30px]">
            {greeting()}, {USER.first}
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {TODAY_LABEL} ·{' '}
            {tasksLeft === 0
              ? "you're all caught up"
              : `${tasksLeft} ${tasksLeft === 1 ? 'task' : 'tasks'} to go`}
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <ThemeToggle className="size-10 rounded-[11px]" />
          <Button onClick={() => setCreateOpen(true)} aria-label="Add task">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add task</span>
          </Button>
        </div>
      </div>

      <SummaryStrip cells={cells} />

      {/* Today's tasks */}
      <Section
        title="Today's tasks"
        aside={
          <span
            className={
              tasksLeft === 0
                ? 'text-[13px] font-semibold text-status-done'
                : 'text-[13px] text-muted-foreground'
            }
          >
            {tasksLeft === 0 ? 'All done' : `${tasksLeft} left`}
          </span>
        }
      >
        <div className="flex flex-col gap-0.5">
          {tasks.map((t) => (
            <TaskRow key={t.id} item={t} onToggle={() => toggleTask(t.id)} />
          ))}
        </div>
        {tasksLeft === 0 && (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-[var(--green-soft)] px-3 py-2.5 text-[13px] font-medium text-status-done">
            <CircleCheck className="size-4 shrink-0" />
            You&rsquo;ve cleared today&rsquo;s tasks. Nice work.
          </div>
        )}
      </Section>

      {/* Active goals */}
      <Section
        title="Active goals"
        aside={
          <Link
            to="/goals"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground outline-none hover:underline focus-visible:underline"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {FOCUS_GOALS.map((g) => (
            <Link
              key={g.id}
              to="/goals"
              className="flex flex-col gap-3 rounded-2xl border border-border p-4 outline-none transition-colors hover:border-foreground/20 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center gap-3">
                <CatIcon icon={g.icon} color={g.color} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {g.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {g.category}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-sm font-bold">
                  {g.pct}%
                </span>
              </div>
              <Sparkline data={g.series} height={44} />
            </Link>
          ))}
        </div>
      </Section>

      {/* Habit check-ins */}
      <Section
        title="Habit check-ins"
        aside={
          <Link
            to="/habits"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground outline-none hover:underline focus-visible:underline"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        }
      >
        <div className="flex flex-wrap gap-2">
          {habits.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => toggleHabit(h.id)}
              aria-pressed={h.done}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                h.done
                  ? 'border-transparent bg-[var(--green-soft)] text-status-done'
                  : 'border-border bg-secondary text-foreground hover:border-foreground/20'
              )}
            >
              {h.done ? (
                <Check className="size-4 shrink-0" />
              ) : (
                <span className="size-4 shrink-0 rounded-full border-[1.5px] border-current opacity-50" />
              )}
              {h.name}
              <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <Flame className="size-3 text-status-warning" />
                {h.streak}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <CreateEditDialog
        kind="task"
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={{ due: todayInput() }}
        onSubmit={addTask}
      />
    </main>
  )
}

function TaskRow({
  item,
  onToggle,
}: {
  item: (typeof TODAY_TASKS)[number]
  onToggle: () => void
}) {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={item.done}
      onClick={onToggle}
      onKeyDown={onKeyDown}
      className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Checkbox
        checked={item.done}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none"
      />
      <CatIcon icon={item.icon} color={item.color} className="size-[30px]" />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-sm font-medium',
            item.done && 'text-muted-foreground line-through'
          )}
        >
          {item.title}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {item.tag}
        </span>
      </span>
      <span className="shrink-0 font-mono text-[12px] text-muted-foreground">
        {item.time}
      </span>
    </div>
  )
}

function Section({
  title,
  aside,
  children,
}: {
  title: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="pt-[14px]">
      <div className="flex items-center justify-between px-1 pb-3">
        <h2 className="text-[19px] font-bold tracking-[-0.01em]">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}
