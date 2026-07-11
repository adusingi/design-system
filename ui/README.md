# @mobayilo/ui

Shared UI components — Button, Card, Dialog, form controls, Badge, Avatar,
Alert, Tabs — styled with plain CSS against the `@mobayilo/themes` CSS
variables. No Tailwind config, no CSS-in-JS; import one stylesheet and the
components pick up whichever theme is active.

For sign-in, use `@mobayilo/auth-magic-link`'s `SignInForm` (magic link +
optional Google) rather than duplicating auth UI here — wrap it in `<Card>`
if you want the panel treatment.

## Install

```tsx
import "@mobayilo/themes/styles.css";
import "@mobayilo/ui/styles.css";
```

## Components

| Component | Notes |
|---|---|
| `Button` | variants: `primary` \| `accent` \| `outline` \| `ghost` \| `danger`; sizes: `sm` \| `md` \| `lg` |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | composable panel |
| `Badge` | variants: `default` \| `success` \| `warning` \| `danger` \| `info` \| `outline` |
| `Avatar` | image with initials fallback; sizes `sm` \| `md` \| `lg` |
| `Input`, `Textarea`, `Select` | plain styled form elements, forward `ref` |
| `Checkbox`, `Radio` | optional `label` prop (implicit `<label>` association, no generated ids) |
| `Switch` | native checkbox styled as a toggle via CSS sibling selector |
| `Slider` | styled native `<input type="range">` |
| `Progress` | linear progress bar, `value` 0-100 |
| `FormField` | label + control + hint/error wrapper |
| `Alert` | static banner/notification; variants: `success` \| `warning` \| `danger` \| `info` \| `neutral` |
| `Dialog`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` | controlled modal (`open` + `onOpenChange`), portal-rendered |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | controlled or uncontrolled; also styles as a pill segmented control |

## New tokens

`@mobayilo/themes` only defines color. This package adds the rest of the
scale as CSS variables in `styles.css`:

- `--mo-space-{xs,sm,md,lg,xl,2xl,3xl,4xl}` — 4px base spacing scale
- `--mo-radius-{sm,md,lg,full}`
- `--mo-shadow-{sm,md,lg}` — elevation, layered on top of each theme's `--card-shadow`
- `--mo-text-{display,h1,h2,h3,body-lg,body,caption}` — `font` shorthand custom properties
- `--mo-font-{heading,sans,mono}` — default to the pairing already hardcoded identically in
  `mobayilo`, `academy-mobayilo`, and `inkoranyamuga`: **Cormorant Garamond** for
  display/headings, **Inconsolata** for everything else (body, UI chrome, values).
  Override per project if you want something else; a project using `next/font`
  should point these at the generated font variable rather than a bare family name.

## Develop

```bash
pnpm --filter @mobayilo/ui build
pnpm --filter @mobayilo/ui typecheck
```

Only `Dialog` and `Tabs` carry a `"use client"` directive (they use
`useState`/`useEffect`/portals); everything else is hook-free and safe to
import from a Server Component tree.
