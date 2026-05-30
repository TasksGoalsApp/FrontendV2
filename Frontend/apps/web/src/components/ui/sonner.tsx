import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

/**
 * Theme-aware toast layer (the mutation/401 feedback the UX audit calls for).
 * Mounted once in `main.tsx`; trigger with `toast.success(...)` from anywhere.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={(resolvedTheme as 'light' | 'dark' | undefined) ?? 'system'}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'rounded-[12px] border border-border bg-popover text-popover-foreground shadow-[var(--shadow-pop)]',
          title: 'text-sm font-semibold',
          description: 'text-muted-foreground',
        },
      }}
    />
  )
}
