import type {
  GoalFormValues,
  HabitFormValues,
  TaskFormValues,
} from './schemas'

/** Entity kinds the shared dialog can create/edit. */
export type EntityKind = 'task' | 'goal' | 'habit'

export type DialogMode = 'create' | 'edit'

/** A normalized set of form values emitted to a page's adapter. */
export type Draft = TaskFormValues | GoalFormValues | HabitFormValues
