import {
  BookOpen,
  Briefcase,
  Camera,
  Code,
  Dumbbell,
  House,
  PenTool,
  Receipt,
  type LucideIcon,
} from 'lucide-react'

import type { CategoryColor } from '@/shared/components/cat-icon'

export interface Category {
  key: string
  label: string
  color: CategoryColor
  icon: LucideIcon
}

/**
 * The shared category catalog — the connective tissue between tasks, goals and
 * (soon) habits. Each entry supplies the categorical color and Lucide glyph an
 * entity needs, so the Create/Edit forms can offer a simple category picker
 * instead of a full icon picker, and every created item lands with a consistent
 * look. When the backend arrives (step c) categories become a server concept;
 * this stays the client-side presentation map keyed off whatever the API sends.
 */
export const CATEGORIES: Category[] = [
  { key: 'work', label: 'Work', color: 'cyan', icon: Briefcase },
  { key: 'engineering', label: 'Engineering', color: 'cyan', icon: Code },
  { key: 'admin', label: 'Admin', color: 'cyan', icon: Receipt },
  { key: 'design', label: 'Design', color: 'periwinkle', icon: PenTool },
  { key: 'learning', label: 'Learning', color: 'periwinkle', icon: BookOpen },
  { key: 'social', label: 'Social', color: 'periwinkle', icon: Camera },
  { key: 'health', label: 'Health', color: 'lime', icon: Dumbbell },
  { key: 'personal', label: 'Personal', color: 'lime', icon: House },
]

export const DEFAULT_CATEGORY_KEY = CATEGORIES[0].key

export function categoryByKey(key: string): Category {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0]
}

/**
 * Best-effort resolution of an existing entity back to a catalog key for edit
 * pre-fill: match on label first, then fall back to the first entry sharing the
 * entity's color so the swatch stays stable, then the default.
 */
export function resolveCategoryKey(label: string, color?: CategoryColor): string {
  const byLabel = CATEGORIES.find(
    (c) => c.label.toLowerCase() === label.trim().toLowerCase()
  )
  if (byLabel) return byLabel.key
  if (color) {
    const byColor = CATEGORIES.find((c) => c.color === color)
    if (byColor) return byColor.key
  }
  return DEFAULT_CATEGORY_KEY
}
