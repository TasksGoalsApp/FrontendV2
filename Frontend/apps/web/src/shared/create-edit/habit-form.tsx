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
import { habitSchema, type HabitFormValues } from './schemas'

const CADENCE_OPTIONS: readonly {
  value: HabitFormValues['cadence']
  label: string
}[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
]

const EMPTY: HabitFormValues = {
  name: '',
  categoryKey: DEFAULT_CATEGORY_KEY,
  cadence: 'daily',
}

export function HabitForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<HabitFormValues>
  submitLabel: string
  onSubmit: (values: HabitFormValues) => void
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: { ...EMPTY, ...initial },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[18px]"
      noValidate
    >
      <Field label="Habit name" htmlFor="habit-name" error={errors.name?.message}>
        <TextInput
          id="habit-name"
          autoFocus
          placeholder="e.g. Meditate 10 minutes"
          invalid={!!errors.name}
          {...register('name')}
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

      <Field label="Cadence" hint="How often you want to keep it up">
        <Controller
          control={control}
          name="cadence"
          render={({ field }) => (
            <Segmented
              ariaLabel="Cadence"
              value={field.value}
              onChange={field.onChange}
              options={CADENCE_OPTIONS}
            />
          )}
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
