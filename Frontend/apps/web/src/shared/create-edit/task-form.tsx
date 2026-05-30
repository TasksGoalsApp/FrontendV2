import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { DEFAULT_CATEGORY_KEY } from '@/shared/categories'
import {
  CategorySelect,
  Field,
  FormFooter,
  Segmented,
  TextArea,
  TextInput,
} from '@/shared/components/form-controls'
import { taskSchema, type TaskFormValues } from './schemas'

const PRIORITY_OPTIONS: readonly {
  value: TaskFormValues['priority']
  label: string
  dot: string
}[] = [
  { value: 'low', label: 'Low', dot: 'bg-status-muted' },
  { value: 'medium', label: 'Medium', dot: 'bg-status-progress' },
  { value: 'high', label: 'High', dot: 'bg-status-warning' },
  { value: 'urgent', label: 'Urgent', dot: 'bg-status-blocked' },
]

const STATUS_OPTIONS: readonly {
  value: TaskFormValues['status']
  label: string
}[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

const EMPTY: TaskFormValues = {
  title: '',
  categoryKey: DEFAULT_CATEGORY_KEY,
  due: '',
  time: '',
  priority: 'medium',
  status: 'todo',
  notes: '',
}

export function TaskForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<TaskFormValues>
  submitLabel: string
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { ...EMPTY, ...initial },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[18px]"
      noValidate
    >
      <Field label="Task name" htmlFor="task-title" error={errors.title?.message}>
        <TextInput
          id="task-title"
          autoFocus
          placeholder="e.g. Draft the launch post"
          invalid={!!errors.title}
          {...register('title')}
        />
      </Field>

      <Field label="Category" error={errors.categoryKey?.message}>
        <Controller
          control={control}
          name="categoryKey"
          render={({ field }) => (
            <CategorySelect value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Due date" htmlFor="task-due" error={errors.due?.message}>
          <TextInput
            id="task-due"
            type="date"
            invalid={!!errors.due}
            {...register('due')}
          />
        </Field>
        <Field
          label="Time"
          htmlFor="task-time"
          error={errors.time?.message}
          hint="Optional"
        >
          <TextInput
            id="task-time"
            type="time"
            invalid={!!errors.time}
            {...register('time')}
          />
        </Field>
      </div>

      <Field label="Priority">
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <Segmented
              ariaLabel="Priority"
              value={field.value}
              onChange={field.onChange}
              options={PRIORITY_OPTIONS}
            />
          )}
        />
      </Field>

      <Field label="Status">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Segmented
              ariaLabel="Status"
              value={field.value}
              onChange={field.onChange}
              options={STATUS_OPTIONS}
            />
          )}
        />
      </Field>

      <Field
        label="Notes"
        htmlFor="task-notes"
        error={errors.notes?.message}
        hint="Optional"
      >
        <TextArea
          id="task-notes"
          placeholder="Add any detail you don't want to forget…"
          invalid={!!errors.notes}
          {...register('notes')}
        />
      </Field>

      <FormFooter
        onCancel={onCancel}
        submitLabel={submitLabel}
        submitting={isSubmitting}
      />
    </form>
  )
}
