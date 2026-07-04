import { Swords } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

/**
 * The lime rounded-square Daily Dojo mark (swords glyph).
 * Wordmark is rendered per-screen since auth and sidebar use different
 * casing/tracking ("Daily Dojo" vs "DAILY DOJO").
 */
export function BrandMark({
  size = 36,
  radius = 11,
  className,
}: {
  size?: number
  radius?: number
  className?: string
}) {
  const glyph = Math.round(size * 0.55)
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center bg-brand-lime',
        className
      )}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <Swords
        className="text-brand-lime-foreground"
        style={{ width: glyph, height: glyph }}
      />
    </span>
  )
}
