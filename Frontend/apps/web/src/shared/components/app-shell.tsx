import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/shared/components/app-sidebar'
import { GridBackdrop } from '@/shared/components/grid-backdrop'

/**
 * The product frame: lime grid backdrop, a centered rounded shell card that
 * fills the viewport (minus a thin inset), the persistent sidebar, and an
 * Outlet where each screen renders its own content region. Pages return a
 * `flex min-w-0 flex-1` root so they sit beside the sidebar and scroll
 * internally at desktop widths.
 */
export function AppShell() {
  return (
    <div className="relative flex min-h-dvh items-start justify-center p-3 xl:items-center xl:p-5">
      <GridBackdrop />
      <div className="relative z-[1] w-full max-w-[1600px]">
        <div className="flex overflow-hidden rounded-[22px] border border-border bg-card shadow-[var(--shadow-shell)] xl:h-[calc(100dvh_-_2.5rem)]">
          <AppSidebar />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
