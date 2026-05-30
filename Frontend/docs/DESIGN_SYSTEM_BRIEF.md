# Design System Brief

The design system **as built**. The source of truth for tokens is
`apps/web/src/index.css`; this doc explains the intent behind it and the component
inventory built on top. When you change a token, change it in `index.css` and reflect it
here in the same commit.

> **Status:** the lime "Modern Minimal" system below is live in `apps/web`. The
> Sign-up/Login and Goal Timeline screens are built against it (light + dark). Earlier
> drafts of this brief described a *blue* Modern Minimal theme pulled from tweakcn — that
> direction was **replaced** by the lime system documented here. Don't reintroduce the
> blue tokens or `npx shadcn add .../modern-minimal.json` (it ships the old blue theme).

---

## 1. Company name & blurb

> **Name:** Daily Dojo
>
> **Blurb:** Daily Dojo is a calm, self-hosted productivity platform for people who want
> to actually finish things. It brings tasks, goals, habits, time tracking, and light
> automation into one focused workspace — the discipline of a dojo, minus the noise.
> Our design language is **Modern Minimal with a lime edge**: clean achromatic surfaces,
> a confident neutral (black-on-white) primary, and a single electric **lime/chartreuse**
> accent that marks the brand and what's *live* right now. Generous whitespace, low
> elevation, typography that lets the work speak. Calm and precise, with one bright signal
> color — never loud, never gamified-to-death. The product should feel like a deep breath
> before focused work.

---

## 2. Foundations (the non-negotiables)

- **Component library:** shadcn/ui (open-code components, hand-authored into the repo).
- **Color foundation:** hand-authored **OKLCH** tokens — *achromatic* neutrals (true
  grays in light, a faint cool tint in dark) + one **lime** accent. On top of the
  neutral/lime base sit a small set of **semantic status tokens** (done/progress/warning/
  blocked/muted) and three **categorical brand hues** (lime / periwinkle / cyan) for goal
  labels and data viz. Status values are picked for accessible contrast (Radix Colors'
  green/sky/amber/red are a good reference when tuning them) but are authored directly as
  OKLCH, not imported as 12-step scales. See §4.
- **Icons:** Lucide (`lucide-react`) — the only icon set. No mixing.
- **Themes:** light **and** dark, switchable via `next-themes` (`.dark` class strategy,
  `defaultTheme="system"`). A manual `ThemeToggle` is shipped on every screen.
- **Style:** Modern Minimal, lime edge. OKLCH tokens, Tailwind v4 (CSS-first
  `@theme inline`), `@custom-variant dark`.
- **Type:** **Inter** (sans) + **JetBrains Mono** (mono), both **self-hosted** variable
  fonts (`public/fonts/*.ttf`, SIL OFL). Mono carries `tabular-nums` for times/%/dates.
  No serif face.
- **Radius:** base `--radius: 0.75rem` (12px) → `radius-sm/md/lg/xl` derive from it. The
  auth/home chrome layers larger bespoke radii on top via arbitrary values: inputs/buttons
  **11px**, panels **20px**, the app shell card **22px**.

---

## 3. The token set (as shipped in `apps/web/src/index.css`)

This is the live token block — neutrals are achromatic, the accent and `ring` are lime,
and the **primary CTA inverts** (near-black on light, near-white on dark) rather than
being a colored fill. Categorical + status tokens are shared across themes unless a dark
override is listed.

```css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.21 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.21 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.21 0 0);

  /* Primary CTA = near-black (inverts in dark) */
  --primary: oklch(0.21 0 0);
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.32 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.55 0 0);

  /* Accent = lime/chartreuse signature */
  --accent: oklch(0.9 0.19 124);
  --accent-foreground: oklch(0.24 0.06 130);

  --destructive: oklch(0.58 0.22 27);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.92 0 0);
  --input: oklch(0.92 0 0);
  --ring: oklch(0.9 0.19 124);          /* focus ring = lime */

  --radius: 0.75rem;

  /* Brand / categorical palette (shared across themes) */
  --brand-lime: oklch(0.9 0.19 124);
  --brand-lime-foreground: oklch(0.24 0.06 130);
  --brand-periwinkle: oklch(0.72 0.13 286);
  --brand-periwinkle-foreground: oklch(0.22 0.04 286);
  --brand-cyan: oklch(0.8 0.1 213);
  --brand-cyan-foreground: oklch(0.22 0.04 213);
  --lime-soft: color-mix(in oklch, var(--brand-lime) 30%, transparent); /* progress pills */

  /* Status (true semantic colors, distinct from brand) */
  --status-done: oklch(0.72 0.17 145);     /* green — NOT lime */
  --status-progress: oklch(0.78 0.11 230);  /* sky   */
  --status-warning: oklch(0.82 0.16 85);    /* amber */
  --status-blocked: oklch(0.58 0.22 27);    /* red   */
  --status-muted: oklch(0.7 0 0);           /* gray  */

  /* Charts: categoricals first, then orange + gray */
  --chart-1: var(--brand-lime);
  --chart-2: var(--brand-periwinkle);
  --chart-3: var(--brand-cyan);
  --chart-4: oklch(0.75 0.15 50);
  --chart-5: oklch(0.55 0 0);

  /* Sidebar (left rail) */
  --sidebar: oklch(0.98 0 0);
  --sidebar-foreground: oklch(0.21 0 0);
  --sidebar-primary: oklch(0.9 0.19 124);
  --sidebar-primary-foreground: oklch(0.24 0.06 130);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.21 0 0);
  --sidebar-border: oklch(0.92 0 0);
  --sidebar-ring: oklch(0.9 0.19 124);

  --font-sans: Inter, system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Elevation (low, soft) */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);
  --shadow-pop: 0 8px 24px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05);
  --shadow-panel: 0 12px 40px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04);
  --shadow-shell: 0 24px 60px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);
}

.dark {
  --background: oklch(0.15 0.004 285);   /* faint cool tint, not pure black */
  --foreground: oklch(0.96 0 0);
  --card: oklch(0.21 0.004 285);
  --card-foreground: oklch(0.96 0 0);
  --popover: oklch(0.21 0.004 285);
  --popover-foreground: oklch(0.96 0 0);

  /* Primary CTA inverts to near-white */
  --primary: oklch(0.96 0 0);
  --primary-foreground: oklch(0.18 0 0);

  --secondary: oklch(0.27 0.004 285);
  --secondary-foreground: oklch(0.96 0 0);
  --muted: oklch(0.27 0.004 285);
  --muted-foreground: oklch(0.71 0 0);

  --accent: oklch(0.9 0.19 124);          /* lime holds across themes */
  --accent-foreground: oklch(0.22 0.06 130);

  --destructive: oklch(0.62 0.21 25);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.3 0.004 285);
  --input: oklch(0.3 0.004 285);
  --ring: oklch(0.9 0.19 124);

  --status-progress: oklch(0.8 0.11 230); /* brand/status inherit; bump sky for dark */

  --sidebar: oklch(0.15 0.004 285);
  --sidebar-foreground: oklch(0.96 0 0);
  --sidebar-primary: oklch(0.9 0.19 124);
  --sidebar-primary-foreground: oklch(0.22 0.06 130);
  --sidebar-accent: oklch(0.27 0.004 285);
  --sidebar-accent-foreground: oklch(0.96 0 0);
  --sidebar-border: oklch(0.3 0.004 285);
  --sidebar-ring: oklch(0.9 0.19 124);

  /* Dark elevation = lightness separation, minimal shadow */
  --shadow-card: none;
  --shadow-pop: 0 12px 32px rgba(0,0,0,0.5);
  --shadow-panel: 0 24px 60px rgba(0,0,0,0.5);
  --shadow-shell: 0 30px 70px rgba(0,0,0,0.6);
}
```

Tokens are surfaced to Tailwind via `@theme inline` (so `bg-brand-lime`,
`text-status-done`, `shadow-[var(--shadow-shell)]`, etc. all work). `--lime-soft` and the
`--shadow-*` set are referenced via arbitrary values because they're theme-dependent and
can't live in static `@theme`.

---

## 4. Color roles — the rules that keep it coherent

The whole system leans on **one** accent doing real work, so be strict about *meaning*:

| Token(s)                         | Role                              | Used for                                              |
| -------------------------------- | --------------------------------- | ----------------------------------------------------- |
| `primary` / `primary-foreground` | Neutral CTA (black⇄white, inverts) | The single most important action on a surface         |
| `accent` / `brand-lime`          | **Brand + "live/now"** accent     | Logo mark, active nav, selected-row ring, focus ring, progress, primary chart series |
| `brand-periwinkle`, `brand-cyan` | Categorical hues                  | Goal categories, multi-series data viz                |
| `status-done`                    | **Green** (NOT lime)              | Task DONE, goal completed                             |
| `status-progress`                | Sky                               | In-progress / info                                    |
| `status-warning`                 | Amber                             | Due-soon, at-risk streak                              |
| `status-blocked` (= destructive) | Red                               | Overdue, blocked                                      |
| `status-muted`                   | Gray                              | Canceled, archived                                    |

Two rules that are easy to get wrong:

1. **Lime is the brand, not "success."** Completion/“done” is **green** (`status-done`),
   deliberately a different hue from lime. Don't use lime to mean success.
2. **Selected state differs by theme.** A selected goal row inverts to `bg-primary` /
   `text-primary-foreground` in **light**; in **dark** it uses `bg-secondary` plus a lime
   **inset ring** (`shadow-[inset_0_0_0_1.5px_var(--brand-lime)]`) instead of a white fill.

Status values are authored directly in OKLCH. If you add or retune one, pick for
accessible contrast (Radix Colors' green/sky/amber/red/gray scales are a fine reference)
and add it to **both** `:root` and `.dark`, then expose it in `@theme inline`.

---

## 5. Component inventory

### Built in `apps/web` (this prototype)

**shadcn primitives** (`src/components/ui/`): Button (variants default/lime/outline/
secondary/ghost/destructive/link; sizes default/sm/lg/icon/icon-lg), Checkbox (lime when
checked), Avatar (periwinkle fallback), Label.

**Shared** (`src/shared/`): ThemeProvider + **ThemeToggle** (next-themes, mounted-guard,
className-sized per screen), **BrandMark** (lime square + Swords glyph), **IconInput**
(leading Lucide icon, focus-within lime glow, optional trailing slot).

**features/auth:** **AuthPage** — one component for login **and** signup (segmented tabs,
mode-swapped heading/fields, password show/hide, remember-me, "Continue with Google",
fixed theme toggle, lime gradient-grid backdrop `.dd-auth-backdrop`).

**features/goals:** **GoalTimelinePage** (the app-shell card) composed of **GoalSidebar**
(232px rail, collapses to icons < `lg`), **SummaryStrip**, **GoalRow** (selectable,
keyboard-operable), **GoalDetail** (322px panel, stacks < `xl`), **Sparkline**,
**CatIcon**; with `data.ts` seed + `types.ts`.

### Still to build (as the app grows past the two screens)

AppShell as a reusable frame (extract from GoalTimelinePage), Input/Card/Dialog/Dropdown/
Select/Switch/Tabs/Tooltip/Popover/Calendar/Badge/Sonner/Progress/Separator/Skeleton/
Command primitives; StatusBadge / PriorityBadge (driven by the status tokens), TaskCard /
TaskRow, TaskCalendar, GoalCard, HabitCard / StreakGrid, Add{Task,Goal,Habit} dialogs
(react-hook-form + zod), EmptyState, StatCard / dashboard widgets, NotificationItem,
CommandPalette.

**States to cover for every component:** default, hover, focus-visible (lime ring),
active, disabled, loading (skeleton), empty, error — in **both** themes.

---

## 6. Layout & spacing system

- **Spacing scale:** Tailwind default (4px base).
- **App shell card:** the home screen is a single rounded card — `max-w 1320px`, height
  `min(860px, 90vh)`, radius **22px**, `--shadow-shell`, on a `secondary` page background.
- **Sidebar:** **232px**, collapsing to a **68px** icon rail below `lg` (1024px).
- **Detail panel:** **322px**, stacking under the main list below `xl` (1280px).
- **Radius:** `--radius` 0.75rem base; chrome layers 11px (inputs/buttons), 20px (auth
  panel), 22px (shell) on top. Full for avatars/pills.
- **Shadows:** the `--shadow-*` set; keep elevation low. In **dark**, separation comes from
  lightness steps, not shadow (`--shadow-card: none`).
- **Responsive intent — "responsive-graceful":** pixel-faithful at desktop width; below
  that it reflows sensibly rather than via a bespoke mobile design. Breakpoints:
  **sm (640)** row/summary content reflow, **lg (1024)** sidebar→rail, **xl (1280)** detail
  panel stacks + shell height frees. No dedicated mobile layout yet.

---

## 7. Notes & gotchas for whoever extends this

- **Tokens are settled and live** in `apps/web/src/index.css` — the old "two overlapping
  token systems + `prefers-color-scheme`" problem is resolved. Theme is driven by the
  `.dark` class via `next-themes`; don't reintroduce a `prefers-color-scheme` block.
- **Don't pull the tweakcn blue theme.** `npx shadcn add .../modern-minimal.json` ships the
  superseded blue tokens. New shadcn components are fine, but re-theme them to these tokens.
- **`baseColor: neutral`** in `components.json` is correct for this system (light neutrals
  are truly achromatic; dark carries only a faint cool tint). Don't switch to `slate`.
- **Fonts are self-hosted**, not from `@fontsource`/CDN — keep the `@font-face` block and
  `public/fonts/*.ttf` in sync if you upgrade Inter/JetBrains Mono.
- Keep icons exclusively **Lucide**.
- `ThemeProvider` ships at the app root, defaulting to `system`; keep the mounted-guard in
  `ThemeToggle` to avoid hydration flicker.
- Verify dark contrast on `muted-foreground` and on status colors when you add surfaces.

---

## 8. One-paragraph version (if a tool only wants a prompt)

> Design a calm, Modern-Minimal productivity app called **Daily Dojo** using shadcn/ui with
> hand-authored OKLCH tokens: achromatic neutrals (true grays in light, a faint cool tint in
> dark), a **neutral primary CTA that inverts** (near-black on light `oklch(0.21 0 0)`,
> near-white on dark), and a single electric **lime** accent (`oklch(0.9 0.19 124)`) used for
> brand, active/selected, focus ring, and progress. Inter + JetBrains Mono (self-hosted,
> mono = tabular-nums), `0.75rem` base radius. Full light/dark via next-themes (`.dark`
> class). Semantic status tokens — **green=done (not lime)**, sky=in-progress, amber=due-soon,
> red=overdue/blocked, gray=muted — plus categorical lime/periwinkle/cyan for goal labels and
> charts. Icons are Lucide only. Layout is a rounded app-shell card (232px sidebar that
> collapses to a rail, 322px detail panel that stacks) with generous whitespace and low
> elevation. Selected rows invert to black-on-white in light but use a lime inset ring on a
> secondary surface in dark. It should feel like a deep breath before focused work.
