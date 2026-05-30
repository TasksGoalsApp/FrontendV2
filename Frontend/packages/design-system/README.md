# packages/design-system/

The shared UI foundation: **shadcn/ui** components themed with **Radix Colors**,
**Lucide** icons, light + dark via `next-themes`, in a "Modern Minimal" style.

This package is the home for the output of the design-system work described in
[`../../docs/DESIGN_SYSTEM_BRIEF.md`](../../docs/DESIGN_SYSTEM_BRIEF.md):

```
packages/design-system/
├── tokens/        # OKLCH CSS variables (globals.css), Radix scale mappings
├── components/    # shadcn components, customized once, reused everywhere
├── icons/         # Lucide re-exports + any custom glyphs
└── README.md
```

Early on this can simply live inside `apps/web/src/shared`. Promote it to a real
workspace package only when a second frontend (e.g. a marketing site or admin panel)
needs to share it.
