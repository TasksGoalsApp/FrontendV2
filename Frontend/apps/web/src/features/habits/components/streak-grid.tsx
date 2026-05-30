import { cn } from '@/lib/utils'
import type { CategoryColor } from '@/shared/components/cat-icon'

const FILL: Record<CategoryColor, string> = {
  lime: 'bg-brand-lime',
  periwinkle: 'bg-brand-periwinkle',
  cyan: 'bg-brand-cyan',
}

/**
 * A row of day cells — filled in the habit's brand color when completed, muted
 * when missed. Decorative (the streak count carries the meaning for SR users).
 */
export function StreakGrid({
  history,
  color,
  days,
  className,
}: {
  history: boolean[]
  color: CategoryColor
  /** Show only the most recent `days` cells (defaults to the whole history). */
  days?: number
  className?: string
}) {
  const cells = days ? history.slice(-days) : history
  return (
    <div className={cn('flex flex-wrap gap-1', className)} aria-hidden>
      {cells.map((done, i) => (
        <span
          key={i}
          className={cn(
            'size-3 rounded-[4px]',
            done ? FILL[color] : 'bg-secondary'
          )}
        />
      ))}
    </div>
  )
}
