import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/shared/categories'
import { CatIcon } from '@/shared/components/cat-icon'

/**
 * Form primitives shared by the Create/Edit forms. They mirror the bordered,
 * focus-glow row of `IconInput` so the dialog fields read the same as the auth
 * screen, and they speak design tokens only (no hard-coded color).
 */

/** Label + control + (error | hint), with the error taking precedence. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-[7px]', className)}>
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium leading-none text-foreground"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[12px] font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

const FIELD_SHELL =
  'flex items-center gap-[9px] rounded-[11px] border bg-card px-[13px] py-[11px] transition-[border-color,box-shadow] focus-within:border-ring focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ring)_35%,transparent)]'

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { invalid?: boolean }
>(function TextInput({ className, invalid, ...props }, ref) {
  return (
    <div className={cn(FIELD_SHELL, invalid ? 'border-destructive' : 'border-input')}>
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground',
          className
        )}
        {...props}
      />
    </div>
  )
})

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'> & { invalid?: boolean }
>(function TextArea({ className, invalid, ...props }, ref) {
  return (
    <div
      className={cn(
        FIELD_SHELL,
        'items-start',
        invalid ? 'border-destructive' : 'border-input'
      )}
    >
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'min-h-[76px] min-w-0 flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground',
          className
        )}
        {...props}
      />
    </div>
  )
})

/** A segmented single-select (radiogroup) for small enums like status/priority. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: readonly { value: T; label: string; dot?: string }[]
  ariaLabel: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex gap-1 rounded-[11px] bg-secondary p-1"
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'bg-card text-foreground shadow-[var(--shadow-card)] dark:bg-popover'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {o.dot && <span className={cn('size-2.5 rounded-full', o.dot)} />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** The shared category picker — selecting one supplies color + icon + label. */
export function CategorySelect({
  value,
  onChange,
}: {
  value: string
  onChange: (key: string) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Category"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      {CATEGORIES.map((c) => {
        const active = c.key === value
        return (
          <button
            key={c.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(c.key)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-[12px] border p-2.5 text-[12px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'border-foreground/25 bg-secondary text-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/15 hover:text-foreground'
            )}
          >
            <CatIcon icon={c.icon} color={c.color} className="size-[30px]" />
            {c.label}
          </button>
        )
      })}
    </div>
  )
}

/** Cancel / submit row shared by every Create/Edit form. */
export function FormFooter({
  onCancel,
  submitLabel,
  submitting,
}: {
  onCancel: () => void
  submitLabel: string
  submitting?: boolean
}) {
  return (
    <div className="mt-1 flex items-center justify-end gap-2.5">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={submitting}>
        {submitLabel}
      </Button>
    </div>
  )
}
