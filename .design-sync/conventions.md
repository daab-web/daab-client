# daab-ui — usage conventions

A shadcn/Radix-based React design system styled with **Tailwind CSS v4** and
semantic CSS-variable tokens. Import components from the library and style your
own layout glue with the token utility classes below. All components render
light/dark from the same tokens.

## Wrapping & setup

Most components need **no wrapper** — import and render. Exceptions:

- **Tooltip** must be inside `TooltipProvider` (wrap once near the app root, or per card).
- **Sidebar** components must be inside `SidebarProvider`; the panel's collapse state lives there. For a static, always-visible panel use `<Sidebar collapsible="none">`.
- **Form** is `react-hook-form`'s `FormProvider` (re-exported as `Form`). Drive it with `useForm()` and compose `FormField` (render-prop) → `FormItem` → `FormLabel` / `FormControl` / `FormDescription` / `FormMessage`.
- **Toaster** (from `sonner`) renders nothing until you call `toast()` and reads the theme from `next-themes`; mount it once at the app root.

Compound components are composed from named parts (e.g. `Card` + `CardHeader` + `CardTitle` + `CardContent` + `CardFooter`; `Dialog` + `DialogTrigger` + `DialogContent` + …). Overlays (`Dialog`, `Sheet`, `Popover`, `DropdownMenu`, `Select`, `Tooltip`) take `defaultOpen` for a statically-open state.

## Styling idiom — Tailwind v4 + semantic tokens

Style with **utility classes**, never inline hex. Colors come from semantic
tokens (do NOT use raw palette like `bg-blue-500`):

| Purpose | Classes |
|---|---|
| Surfaces | `bg-background` `bg-card` `bg-popover` `bg-muted` `bg-secondary` `bg-accent` `bg-sidebar` |
| Brand/action | `bg-primary` `text-primary-foreground` · `bg-destructive` `text-destructive` |
| Text | `text-foreground` `text-muted-foreground` `text-card-foreground` |
| Lines / focus | `border` (`border-border`) `border-input` `ring-ring` |
| Radius | `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` |

Each surface token has a matching `*-foreground` for legible text (e.g.
`bg-secondary text-secondary-foreground`). Brand-accent tokens exist as CSS
variables — `--brand`, `--brand-foreground`, `--brand-subtle` — use via
arbitrary values when needed: `bg-[--brand] text-[--brand-foreground]`.
Spacing/layout use standard Tailwind (`flex`, `grid`, `gap-*`, `p-*`, `w-*`).

## Where the truth lives

- Tokens + every utility ship in `styles.css` (→ `@import "./_ds_bundle.css"`). Read it for the exact token set.
- Per-component API in `<Name>.d.ts` (the `<Name>Props` interface) and usage in `<Name>.prompt.md`.

## Idiomatic example

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge } from "daab-client";

<Card className="w-80">
  <CardHeader>
    <CardTitle>Team plan</CardTitle>
  </CardHeader>
  <CardContent className="flex items-center justify-between">
    <span className="text-2xl font-semibold">$24<span className="text-sm text-muted-foreground">/mo</span></span>
    <Badge>Popular</Badge>
  </CardContent>
  <CardFooter className="justify-end">
    <Button>Choose plan</Button>
  </CardFooter>
</Card>
```
