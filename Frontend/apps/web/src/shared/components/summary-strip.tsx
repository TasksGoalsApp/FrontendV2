import { cn } from '@/lib/utils'

export interface SummaryCell {
  label: string
  value: string
}

/** Four-up KPI strip used on the dashboard and goal timeline headers. */
export function SummaryStrip({ cells }: { cells: SummaryCell[] }) {
  return (
    <div className="grid grid-cols-2 gap-y-4 pb-5 pt-1 sm:grid-cols-4 sm:gap-y-0">
      {cells.map((cell, i) => (
        <div
          key={cell.label + cell.value}
          className={cn(
            'px-[18px]',
            i % 2 !== 0 && 'border-l border-border',
            i !== 0 && 'sm:border-l sm:border-border'
          )}
        >
          <div className="mb-1.5 text-xs text-muted-foreground">{cell.label}</div>
          <div className="text-base font-bold tracking-[-0.01em]">
            {cell.value}
          </div>
        </div>
      ))}
    </div>
  )
}
