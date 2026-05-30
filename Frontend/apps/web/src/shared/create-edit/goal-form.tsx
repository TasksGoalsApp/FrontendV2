import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { DEFAULT_CATEGORY_KEY } from '@/shared/categories'
import {
  CategorySelect,
  Field,
  FormFooter,
  Segmented,
  TextInput,
} from '@/shared/components/form-controls'
import { goalSchema, type GoalFormValues } from './schemas'
import { todayInput } from './format'

const STATUS_OPTIONS: readonly {
  value: GoalFormValues['status']
  label: string
}[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' },
]

const EMPTY: GoalFormValues = {
  title: '',
  categoryKey: DEFAULT_CATEGORY_KEY,
  target: '',
  start: todayInput(),
  end: '',
  status: 'Active',
}

export function GoalForm({
  initial,
  submitLabel,
  showStatus,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<GoalFormValues>
  submitLabel: string
  /** Status only makes sense once a goal exists — shown in edit mode. */
  showStatus?: boolean
  onSubmit: (values: GoalFormValues) => void
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: { ...EMPTY, ...initial },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[18px]"
      noValidate
    >
      <Field label="Goal name" htmlFor="goal-title" error={errors.title?.message}>
        <TextInput
          id="goal-title"
          autoFocus
          placeholder="e.g. Ship the v1 release"
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

      <Field
        label="Target"
        htmlFor="goal-target"
        error={errors.target?.message}
        hint="What does done look like?"
      >
        <TextInput
          id="goal-target"
          placeholder="e.g. 10k MRR"
          invalid={!!errors.target}
          {...register('target')}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date" htmlFor="goal-start" error={errors.start?.message}>
          <TextInput
            id="goal-start"
            type="date"
            invalid={!!errors.start}
            {...register('start')}
          />
        </Field>
        <Field label="Due date" htmlFor="goal-end" error={errors.end?.message}>
          <TextInput
            id="goal-end"
            type="date"
            invalid={!!errors.end}
            {...register('end')}
          />
        </Field>
      </div>

      {showStatus && (
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
      )}

      <FormFooter
        onCancel={onCancel}
        submitLabel={submitLabel}
        submitting={isSubmitting}
      />
    </form>
  )
}
