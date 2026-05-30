import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { categoryByKey, resolveCategoryKey } from '@/shared/categories'
import {
  CreateEditDialog,
  fromDateInput,
  toDateInput,
  type DialogMode,
  type TaskFormValues,
} from '@/shared/create-edit'
import { ThemeToggle } from '@/shared/theme/theme-toggle'
import { ListView } from '../components/list-view'
import { MonthView } from '../components/month-view'
import { TaskDetail } from '../components/task-detail'
import { WeekView } from '../components/week-view'
import { TASKS } from '../data'
import { startOfDay } from '../lib/dates'
import type { Task, TaskStatus, TaskView } from '../types'

let taskSeq = 0
function nextTaskId() {
  return `k-${Date.now().toString(36)}-${taskSeq++}`
}

/**
 * Bridge the shared form values to the local Task shape (and back for edit).
 * When the backend lands (step c) this becomes the create/update mutation map.
 */
function taskFromValues(values: TaskFormValues, existing?: Task): Task {
  const category = categoryByKey(values.categoryKey)
  return {
    id: existing?.id ?? nextTaskId(),
    title: values.title,
    category: category.color,
    categoryLabel: category.label,
    icon: category.icon,
    due: fromDateInput(values.due),
    time: values.time || undefined,
    status: values.status,
    priority: values.priority,
    notes: values.notes.trim() || undefined,
  }
}

function valuesFromTask(task: Task): Partial<TaskFormValues> {
  return {
    title: task.title,
    categoryKey: resolveCategoryKey(task.categoryLabel, task.category),
    due: toDateInput(task.due),
    time: task.time ?? '',
    priority: task.priority,
    status: task.status,
    notes: task.notes ?? '',
  }
}

const VIEWS: { key: TaskView; label: string }[] = [
  { key: 'list', label: 'List' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
]

const FILTERS: { key: 'all' | TaskStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
]

export function TasksPage() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [tasks, setTasks] = useState(TASKS)
  const [view, setView] = useState<TaskView>('list')
  const [filter, setFilter] = useState<'all' | TaskStatus>('all')
  const [selected, setSelected] = useState(TASKS[0].id)

  const visible = useMemo(
    () => (filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)),
    [tasks, filter]
  )

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      )
    )
  }

  function openFromCalendar(id: string) {
    setSelected(id)
    setView('list')
  }

  const selectedTask = tasks.find((t) => t.id === selected) ?? tasks[0]

  const [dialog, setDialog] = useState<{
    open: boolean
    mode: DialogMode
    editId?: string
  }>({ open: false, mode: 'create' })

  const editingTask = dialog.editId
    ? tasks.find((t) => t.id === dialog.editId)
    : undefined
  const dialogInitial =
    dialog.mode === 'edit' && editingTask
      ? valuesFromTask(editingTask)
      : { due: toDateInput(today) }

  function handleDialogSubmit(values: TaskFormValues) {
    if (dialog.mode === 'edit' && editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? taskFromValues(values, t) : t))
      )
      toast.success('Task updated', { description: values.title })
    } else {
      const task = taskFromValues(values)
      setTasks((prev) => [task, ...prev])
      setSelected(task.id)
      toast.success('Task added', { description: values.title })
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
      <main className="dd-scroll flex min-w-0 flex-1 flex-col overflow-y-auto px-4 py-[26px] sm:px-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[26px] font-bold tracking-[-0.025em] sm:text-[30px]">
            Tasks
          </h1>
          <div className="flex items-center gap-[10px]">
            <div className="flex gap-1 rounded-[11px] bg-secondary p-1">
              {VIEWS.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setView(v.key)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors',
                    view === v.key
                      ? 'bg-card text-foreground shadow-[var(--shadow-card)] dark:bg-popover'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <ThemeToggle className="size-10 rounded-[11px]" />
            <Button
              onClick={() => setDialog({ open: true, mode: 'create' })}
              aria-label="Add task"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add task</span>
            </Button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors',
                filter === f.key
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {view === 'list' && (
          <ListView
            tasks={visible}
            today={today}
            selected={selected}
            onSelect={setSelected}
            onToggle={toggle}
          />
        )}
        {view === 'week' && (
          <WeekView tasks={visible} today={today} onOpen={openFromCalendar} />
        )}
        {view === 'month' && (
          <MonthView tasks={visible} today={today} onOpen={openFromCalendar} />
        )}
      </main>

      {view === 'list' && (
        <TaskDetail
          task={selectedTask}
          today={today}
          onToggle={() => toggle(selectedTask.id)}
          onEdit={() =>
            setDialog({ open: true, mode: 'edit', editId: selectedTask.id })
          }
        />
      )}

      <CreateEditDialog
        kind="task"
        mode={dialog.mode}
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        initial={dialogInitial}
        onSubmit={handleDialogSubmit}
      />
    </div>
  )
}
