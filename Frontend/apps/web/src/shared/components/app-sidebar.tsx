import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Repeat,
  Settings,
  Target,
  type LucideIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/auth-context'
import { BrandMark } from '@/shared/components/brand-mark'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  soon?: boolean
}

// Entity-first navigation. Today + Goals are live; the rest are flagged
// `soon` until their screens (and services) land. The cadence-vs-entity
// naming is still an open decision (see DESIGN backlog).
const NAV: NavItem[] = [
  { to: '/', label: 'Today', icon: LayoutDashboard, end: true },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/habits', label: 'Habits', icon: Repeat },
  { to: '/reports', label: 'Reports', icon: BarChart3, soon: true },
]

const ITEM =
  'flex items-center justify-center gap-[11px] rounded-[11px] px-0 py-[11px] text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring lg:justify-start lg:px-[13px]'

const SOON_BADGE =
  'hidden rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground lg:inline-block'

export function AppSidebar() {
  const { logout } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  // Close the settings menu on an outside click or Escape.
  useEffect(() => {
    if (!settingsOpen) return
    function onPointerDown(e: PointerEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSettingsOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [settingsOpen])

  function handleLogout() {
    setSettingsOpen(false)
    logout()
  }

  return (
    <aside className="flex w-[68px] shrink-0 flex-col border-r border-border bg-sidebar px-2 py-[26px] lg:w-[232px] lg:px-[18px]">
      <div className="flex items-center justify-center gap-[10px] px-1.5 pb-[26px] lg:justify-start">
        <BrandMark size={30} radius={9} />
        <span className="hidden text-[17px] font-bold tracking-[0.06em] lg:inline">
          DAILY DOJO
        </span>
      </div>

      <nav className="flex flex-col gap-[3px]">
        {NAV.map(({ to, label, icon: Icon, end, soon }) =>
          soon ? (
            <button
              key={to}
              type="button"
              disabled
              title={`${label} — coming soon`}
              className={cn(
                ITEM,
                'cursor-not-allowed font-medium text-muted-foreground/60'
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="hidden flex-1 text-left lg:block">{label}</span>
              <span className={SOON_BADGE}>Soon</span>
            </button>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                cn(
                  ITEM,
                  isActive
                    ? 'bg-brand-lime font-semibold text-brand-lime-foreground'
                    : 'font-medium text-sidebar-foreground hover:bg-sidebar-accent'
                )
              }
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="hidden lg:inline">{label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center justify-center gap-[10px] px-1.5 py-[10px] lg:justify-start">
        <Avatar className="size-[30px]">
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-semibold lg:inline">Arriva Elma</span>
      </div>

      <div ref={settingsRef} className="relative">
        {settingsOpen && (
          <div
            role="menu"
            aria-label="Settings"
            className="absolute bottom-full left-0 mb-2 min-w-[176px] overflow-hidden rounded-[12px] border border-border bg-popover p-1 shadow-[var(--shadow-pop)]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-sm font-medium text-foreground outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary"
            >
              <LogOut className="size-[17px] shrink-0" />
              Log out
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={settingsOpen}
          title="Settings"
          className={cn(
            ITEM,
            'w-full font-medium',
            settingsOpen
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent'
          )}
        >
          <Settings className="size-[18px] shrink-0" />
          <span className="hidden lg:inline">Settings</span>
        </button>
      </div>
    </aside>
  )
}
