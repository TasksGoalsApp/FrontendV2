import { z } from 'zod'

/**
 * The Create/Edit form contracts. These zod schemas are the single source of
 * truth for the form values; the inferred types flow out to the forms, the
 * dialog, and each page's draft → entity adapter. Status/priority unions are
 * declared here (mirroring the feature enums) so this shared module never has
 * to import a feature's types.
 */

const HHMM = /^$|^([01]\d|2[0-3]):[0-5]\d$/

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Give your task a name.')
    .max(120, 'Keep the name under 120 characters.'),
  categoryKey: z.string().min(1, 'Pick a category.'),
  due: z.string().min(1, 'Choose a due date.'),
  time: z.string().regex(HHMM, 'Use 24-hour time, e.g. 14:30.'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['todo', 'in_progress', 'done']),
  notes: z.string().max(500, 'That note is a little long.'),
})

export type TaskFormValues = z.infer<typeof taskSchema>

export const goalSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Give your goal a name.')
      .max(120, 'Keep the name under 120 characters.'),
    categoryKey: z.string().min(1, 'Pick a category.'),
    target: z
      .string()
      .trim()
      .min(1, 'What does done look like?')
      .max(120, 'Keep the target short and concrete.'),
    start: z.string().min(1, 'Choose a start date.'),
    end: z.string().min(1, 'Choose a due date.'),
    status: z.enum(['Active', 'Completed']),
  })
  // ISO 'yyyy-mm-dd' strings compare lexicographically, so this also orders dates.
  .refine((v) => !v.start || !v.end || v.end >= v.start, {
    path: ['end'],
    message: 'The due date must be on or after the start date.',
  })

export type GoalFormValues = z.infer<typeof goalSchema>

export const habitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name your habit.')
    .max(120, 'Keep the name under 120 characters.'),
  categoryKey: z.string().min(1, 'Pick a category.'),
  cadence: z.enum(['daily', 'weekly']),
})

export type HabitFormValues = z.infer<typeof habitSchema>
