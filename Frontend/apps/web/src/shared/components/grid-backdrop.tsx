import { cn } from '@/shared/lib/utils'

/**
 * Fixed, full-viewport lime gradient-grid backdrop. Painted at z-0 behind the
 * page; the page content must sit in its own stacking context above it
 * (e.g. `relative z-[1]`). Shared by the auth screens and the app shell so the
 * textured base stays consistent. Re-themes automatically via the `.dark` scope.
 */
export function GridBackdrop({ className }: { className?: string }) {
  return <div className={cn('dd-grid-backdrop', className)} aria-hidden />
}
