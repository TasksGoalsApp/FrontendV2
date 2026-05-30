/**
 * Date/time string helpers used by the per-page adapters that bridge the
 * Create/Edit form's normalized values and each feature's local shape. Kept in
 * the shared flow (not a feature lib) so no feature imports another's internals.
 */

/** Date → 'yyyy-mm-dd' for `<input type="date">`. Local, no UTC day shift. */
export function toDateInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 'yyyy-mm-dd' → local Date at midnight. Falls back to today if malformed. */
export function fromDateInput(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return new Date()
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

/** Today as a date-input string — the natural default for a new item. */
export function todayInput(): string {
  return toDateInput(new Date())
}

/** 'yyyy-mm-dd' → display like '30 Oct 2022' (matches the goal seed style). */
export function formatGoalDate(value: string): string {
  if (!value) return ''
  return fromDateInput(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Best-effort parse of a free-text date back to 'yyyy-mm-dd' for edit pre-fill.
 * Seed goals carry loose strings ('Today', '30 Oct, 22') that won't all parse;
 * those simply come back empty and the user re-picks.
 */
export function looseDateToInput(value: string): string {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : toDateInput(d)
}

/** Current time like '09:05 AM' (matches the goal seed `time`). */
export function nowTimeLabel(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
