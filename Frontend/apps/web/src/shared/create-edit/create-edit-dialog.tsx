import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GoalForm } from './goal-form'
import { HabitForm } from './habit-form'
import { TaskForm } from './task-form'
import type {
  GoalFormValues,
  HabitFormValues,
  TaskFormValues,
} from './schemas'
import type { DialogMode, EntityKind } from './types'

interface BaseProps {
  mode: DialogMode
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * The shared add-flow. Every "Add" button and every detail-panel edit pencil
 * across Today / Goals / Tasks routes through this one dialog: pick a `kind`
 * and `mode`, hand it the initial values (for edit) and an `onSubmit` that maps
 * the form values into the page's local shape. Discriminated on `kind` so each
 * caller gets a type-checked `initial` / `onSubmit` pair.
 */
type Props =
  | (BaseProps & {
      kind: 'task'
      initial?: Partial<TaskFormValues>
      onSubmit: (values: TaskFormValues) => void
    })
  | (BaseProps & {
      kind: 'goal'
      initial?: Partial<GoalFormValues>
      onSubmit: (values: GoalFormValues) => void
    })
  | (BaseProps & {
      kind: 'habit'
      initial?: Partial<HabitFormValues>
      onSubmit: (values: HabitFormValues) => void
    })

const COPY: Record<
  EntityKind,
  Record<DialogMode, { title: string; description: string; submit: string }>
> = {
  task: {
    create: {
      title: 'New task',
      description: 'Capture something to do and when it’s due.',
      submit: 'Add task',
    },
    edit: {
      title: 'Edit task',
      description: 'Update the details and save your changes.',
      submit: 'Save changes',
    },
  },
  goal: {
    create: {
      title: 'New goal',
      description: 'Set a goal and the target you’re working toward.',
      submit: 'Add goal',
    },
    edit: {
      title: 'Edit goal',
      description: 'Update the details and save your changes.',
      submit: 'Save changes',
    },
  },
  habit: {
    create: {
      title: 'New habit',
      description: 'Add a habit and how often you want to keep it up.',
      submit: 'Add habit',
    },
    edit: {
      title: 'Edit habit',
      description: 'Update the details and save your changes.',
      submit: 'Save changes',
    },
  },
}

export function CreateEditDialog(props: Props) {
  const copy = COPY[props.kind][props.mode]
  const close = () => props.onOpenChange(false)

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        {props.kind === 'task' ? (
          <TaskForm
            key={props.mode}
            initial={props.initial}
            submitLabel={copy.submit}
            onCancel={close}
            onSubmit={(values) => {
              props.onSubmit(values)
              close()
            }}
          />
        ) : props.kind === 'goal' ? (
          <GoalForm
            key={props.mode}
            initial={props.initial}
            showStatus={props.mode === 'edit'}
            submitLabel={copy.submit}
            onCancel={close}
            onSubmit={(values) => {
              props.onSubmit(values)
              close()
            }}
          />
        ) : (
          <HabitForm
            key={props.mode}
            initial={props.initial}
            submitLabel={copy.submit}
            onCancel={close}
            onSubmit={(values) => {
              props.onSubmit(values)
              close()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
