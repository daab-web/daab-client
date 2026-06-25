# design-sync notes — daab-ui

Repo is a **Next.js app**, not a published package. Synced surface = the
shadcn/Radix component library in `components/ui/*` (+ scoped to ui only).
Project: `daab-ui` (https://claude.ai/design/p/eb07d58a-9c12-4930-afd7-ec1f3b7975dd).

## Build model (non-standard — read before re-sync)
- **No dist, no published pkg** → synth-entry via a hand-written entry
  `.design-sync/entry.tsx` (re-exports every scoped `components/ui/*` file).
  Passed with `--entry .design-sync/entry.tsx`. `pkg=daab-client`, global `DaabUI`.
- Components come from `cfg.componentSrcMap` (38 pins), NOT auto-discovery.
- `@/*` aliases resolve via `cfg.tsconfig` (`./tsconfig.json`, `@/* -> ./*`).
- Previews import from the bare specifier `"daab-client"` → mapped to `window.DaabUI`.

## CSS (critical)
- Tailwind v4, utilities compiled at build by **`.design-sync/compile-css.mjs`**
  (postcss + `@tailwindcss/postcss`, scans repo incl. `.design-sync/previews/`).
  Output `.design-sync/.cache/compiled.css` = `cfg.cssEntry`.
- **Re-sync MUST run `node .design-sync/compile-css.mjs` before every build** so
  utility classes used only in previews get emitted. Then package-build.
- styles.css → `@import "./_ds_bundle.css"` (the compiled Tailwind). Tokens +
  utilities all ship there.

## Environment gotcha — Yarn PnP
- Stray `/home/tng/Work/.pnp.cjs` (ancestor, NOT this repo) hijacks esbuild →
  `Could not resolve "react"`. Wrapper **`.design-sync/no-pnp.sh`** moves it aside
  (trap-restores). For multi-build phases, move once up front + restore at end
  (user approved). Always confirm restored: `ls /home/tng/Work/.pnp.cjs`.

## Browser
- No playwright browsers cached. Use system chromium:
  `DS_CHROMIUM_PATH=/usr/bin/chromium` + `playwright` driver installed in
  `.ds-sync` with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`.

## Per-component decisions
- **Overlays** (Dialog/Sheet/Popover/DropdownMenu/Select/Tooltip): previews use
  `defaultOpen`; `cfg.overrides` set `cardMode:single` + viewport. Tooltip needs
  `TooltipProvider`.
- **Sidebar**: default `collapsible="offcanvas"` + `hidden md:block` won't show in
  a card → preview uses `collapsible="none"` inside `SidebarProvider` + fixed height.
- **Form**: `useForm()` from react-hook-form inside the preview.
- **DataTable**: `cardMode:column`; columns+data defined in preview.
- **Combobox/Tabs**: `cardMode` overrides to fix GRID_OVERFLOW (portal / wide).
- **Toaster**: FLOOR CARD on purpose — needs next-themes + runtime `toast()`, not
  statically previewable. Not a failure.

## Known render warns (triaged, expected)
- `[TOKENS_MISSING]`: `--font-geist-mono`, `--radix-navigation-menu-viewport-*`,
  `--tw`, `--alpha-color` — all runtime-injected (next/font, radix, tailwind). OK.
- Fonts: app serves Geist via next/font at runtime; bundle has no @font-face →
  cards render in system sans. Acceptable; brand font is host-provided.

## Re-sync risks
- `compile-css.mjs` step is load-bearing; skip it → preview-only classes unstyled.
- PnP file must be aside during esbuild and restored after.
- Toaster intentionally floor — don't "fix".
- componentSrcMap is explicit (no auto-discovery) — new `components/ui/*` files
  need a manual entry in entry.tsx + componentSrcMap.
- Scope excludes `components/editor` (Lexical), navbar, footer (app-shell /
  server / next-intl — not reusable DS).
