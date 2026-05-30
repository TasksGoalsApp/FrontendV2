import * as React from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface IconInputProps extends React.ComponentProps<'input'> {
  icon: LucideIcon
  /** Optional trailing control, e.g. the password show/hide button. */
  trailing?: React.ReactNode
}

/**
 * Auth field: a bordered row with a leading Lucide icon, a bare input,
 * and an optional trailing slot. The whole row lights up on focus-within.
 */
export function IconInput({
  icon: Icon,
  trailing,
  className,
  ...props
}: IconInputProps) {
  return (
    <div className="flex items-center gap-[9px] rounded-[11px] border border-input bg-card px-[13px] py-[11px] transition-[border-color,box-shadow] focus-within:border-ring focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ring)_35%,transparent)]">
      <Icon className="size-[17px] shrink-0 text-muted-foreground" />
      <input
        className={cn(
          'min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground',
          className
        )}
        {...props}
      />
      {trailing}
    </div>
  )
}
