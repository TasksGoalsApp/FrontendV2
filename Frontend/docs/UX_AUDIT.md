# UX / UI Audit

Scope: the live frontend (**FrontendV2** → `apps/web`) with the older **daily-dojo-site**
prototype as a reference for intended scope. The audit is organized as a heuristic
evaluation plus information architecture, visual/interaction, accessibility, and content,
ending with a prioritized fix list.

## TL;DR

The live frontend is a clean, well-structured *skeleton* (good feature-folder
architecture, sensible auth flow, shadcn primitives in place) but it is **pre-product**:
it has the bones of three screens, no navigational shell worth the name, no consistent
states, no theme switching despite the tooling for it, and a couple of data-shape
mismatches that will show up as empty screens. The older prototype is the opposite — it
*looks* like a product (rich nav, cards, dialogs, charts) but runs on a throwaway
Supabase backend. **The opportunity is to pour the prototype's UX into V2's clean
architecture.**

Maturity scores (1–5):

| Dimension              | Score | One-line                                             |
| ---------------------- | :---: | ---------------------------------------------------- |
| Information architecture | 2   | Two nav links; no home for goals/habits.             |
| Visual design          | 2     | Default shadcn, mixed token systems, no identity.    |
| Interaction & feedback | 2     | Bare `<p>` loading/error, no toasts, no empty states.|
| Consistency            | 2     | Two nav components, raw `<button>` vs `Button`, `<a>` vs `Link`. |
| Accessibility          | 2     | Color-only cues, unlabeled icon buttons, focus unstyled. |
| Theming                | 1     | `next-themes` installed but no toggle, no `.dark` usage. |
| Architecture (code)    | 4     | Clean feature folders, typed, good API client.       |

---

## 1. Heuristic findings (Nielsen)

**Visibility of system status.** Loading and error are rendered as unstyled paragraphs
(`<p>Loading tasks...</p>`, `<p>{errorMessage}</p>`). There's no skeleton, spinner, or
toast. `sonner` is installed and unused. → Add skeletons for lists/calendars and a toast
layer for mutations and 401s.

**Match to the real world.** "Task App" / "Productivity App" is placeholder naming; the
calendar labels are fine. Goals and habits — core to the product — have no presence in
the live UI at all.

**User control & freedom.** No breadcrumbs, no clear "back" affordance except a one-off
"Back to Home" button on login. No undo on destructive actions (goal delete is a hard
delete with no confirm in the API path).

**Consistency & standards.** Two different navigations exist across the codebase
(V2's bare `Navbar` vs the prototype's rich `Navigation`). Within V2, the calendar uses
raw `<button className="rounded border px-3 py-1">` instead of the shadcn `Button`, and
the home page uses `<a href>` (full reload) instead of `<Link>`. → Converge on one nav,
one button, router links everywhere.

**Error prevention.** Login does minimal client validation; register/create flows should
use schema validation (`zod`) with inline field errors rather than a single error banner.

**Recognition over recall.** No command palette, no recent items, no search. For a
multi-entity productivity app this is a real gap as content grows.

**Flexibility & efficiency.** No keyboard shortcuts, no bulk actions, no quick-add. A
productivity tool lives and dies on quick capture — "press N to add a task" should exist.

**Aesthetic & minimalist design.** The grayscale shadcn defaults are *close* to the
desired "Modern Minimal," but `index.css` mixes two token systems (custom `--text/--bg`
vars and the shadcn `--background/--primary` set), which will fight each other. → One
token system (the design brief resolves this).

**Help users with errors.** A 401 currently logs to console and leaves the user on a
dead page. → Auto-redirect to login with a toast.

**Help & documentation.** None in-app. An empty-state-as-onboarding pattern (see below)
covers most of this cheaply.

---

## 2. Information architecture

Current routes: `/home` (public), `/login`, `/register`, `/profile`, `/tasks`.
Missing the product's own core: **goals**, **habits**, and later time/notifications.

Recommended IA once features land:

```
App shell (authenticated)
├── Dashboard        "today": due tasks, active goals, habit check-ins
├── Tasks            calendar + list/board toggle
├── Goals            cards with progress
├── Habits           streak grid
├── Time   (Phase 4)
├── Notifications (Phase 3)  ← bell in the top bar
└── Profile / Settings  ← theme toggle lives here AND in the top bar
```

A **persistent left sidebar** (collapsible) is the right pattern for this many top-level
areas — the prototype's top-bar nav won't scale past ~5 items. The shadcn `sidebar`
component (already vendored in the prototype) is the fast path.

---

## 3. Visual & interaction design

- **No brand.** The app needs an identity: a name (the codebase says "Daily Dojo" /
  "TaskFlow" / "Task App" in three places — pick one), a logo mark, and a primary color.
  The design brief proposes Modern Minimal's blue primary.
- **Empty states are missing.** Every list/calendar should have a friendly empty state
  with a primary action ("No tasks yet — add your first"). This doubles as onboarding.
- **Calendar is hand-rolled.** It works, but a productivity calendar wants: today-marker,
  task chips with status color, click-to-create on a day, and a month/week/list toggle.
  Consider `react-day-picker` (in the prototype) for the date primitives.
- **Density & rhythm.** Set a consistent spacing scale and card style via tokens so every
  feature card (task/goal/habit) shares padding, radius, and shadow.
- **Status as more than color.** Task status/priority should pair a color with an icon
  and/or label (see accessibility).

---

## 4. Accessibility (WCAG-oriented)

- **Color-only status.** Status/priority must not rely on hue alone — pair with a Lucide
  icon or text. (Affects color-blind users; ~8% of men.)
- **Icon-only buttons** (logout, nav icons) need `aria-label`s.
- **Focus styles.** The custom CSS doesn't define a visible focus ring; keyboard users
  can't see where they are. shadcn's `--ring` token handles this once theming is unified.
- **Contrast.** Verify text on muted/secondary backgrounds hits 4.5:1 in *both* themes —
  the Modern Minimal dark `muted-foreground` is light gray on dark; check it.
- **Forms.** Inputs use `<Label htmlFor>` (good). Keep that; add `aria-invalid` + error
  text wiring when you adopt `react-hook-form`.
- **Calendar grid** should use proper roles/`aria-current="date"` for today.

---

## 5. Content & microcopy

- Replace placeholder strings ("Task App", "Welcome to Your Productivity App", "Create a
  password" on the *login* page — that's the wrong copy, it's a sign-in form).
- Write one voice: calm, encouraging, second person ("Let's plan your day"). The "Dojo"
  metaphor (practice, streaks, mastery) is a strong, ownable angle for habits/goals copy.
- Error messages should say what to do next, not just what failed.

---

## 6. Data-shape mismatches that surface as UX bugs

These are UX-visible even though they're code issues:

- The calendar filters tasks by `task.start_date` (snake_case), but a Spring/Jackson API
  serializes the `Task.startDate` field as **`startDate`** (camelCase) by default. If the
  TS type and the JSON disagree, **every task silently fails to render** on its day. Pin
  the casing on both ends and type it once in `features/tasks/types`.
- Combined with the JWT bug (`INTEGRATION_FIXES.md` §1), the Tasks screen today shows
  "Loading…" → error or an empty calendar regardless of data. Fix those first or the UX
  work can't be evaluated.

---

## 7. Prioritized fix list

**P0 — unblock (do with Phase 0):**
1. Fix JWT/role/port issues so screens actually populate.
2. Enable the 401 → redirect + toast; add a real loading skeleton and error toast.
3. Pin task DTO field casing so the calendar renders.

**P1 — make it feel like a product (Phase 2):**
4. One app shell: collapsible sidebar, top bar with theme toggle + user menu + notification bell slot.
5. Unify on one nav, one `Button`, router `<Link>` everywhere; delete the bare `Navbar`.
6. Add empty states (with primary actions) to every list/calendar.
7. Pick and apply the brand (name, logo, primary color).

**P2 — depth & polish (Phase 1–2.5):**
8. Goals and Habits screens, ported from the prototype's components.
9. Theme toggle + verified light/dark contrast (design system).
10. `react-hook-form` + `zod` on all create/edit dialogs with inline errors.
11. Command palette (`cmdk`) and a global quick-add.
12. Status/priority shown with icon + color + label; accessible focus rings.

**P3 — efficiency:**
13. Keyboard shortcuts, bulk actions, list/board/calendar view toggle for tasks.
14. Dashboard "today" view as the post-login landing.
