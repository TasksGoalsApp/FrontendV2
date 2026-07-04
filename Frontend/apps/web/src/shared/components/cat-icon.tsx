import type { LucideIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

/** Categorical brand hues used for goal/task/habit labels and data viz. */
export type CategoryColor = 'lime' | 'periwinkle' | 'cyan'

// Full literal class strings so Tailwind's scanner keeps them.
const CAT_STYLES: Record<CategoryColor, string> = {
  lime: 'bg-brand-lime text-brand-lime-foreground',
  periwinkle: 'bg-brand-periwinkle text-brand-periwinkle-foreground',
  cyan: 'bg-brand-cyan text-brand-cyan-foreground',
}

export function CatIcon({
  icon: Icon,
  color,
  className,
}: {
  icon: LucideIcon
  color: CategoryColor
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px]',
        CAT_STYLES[color],
        className
      )}
    >
      <Icon className="size-[17px]" />
    </span>
  )
}
