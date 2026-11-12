# @mobayilo/ui

Shared UI components — Button, Card, Dialog, form controls, Badge, Avatar,
Alert, Tabs — styled with plain CSS against the `@mobayilo/themes` CSS
variables. No Tailwind config, no CSS-in-JS; import one stylesheet and the
components pick up whichever theme is active.

The package also provides a shared site footer for all Mobayilo products.

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

## Site footer

Every product's footer comes from this component; a product only writes its
config file. The contract is described by [`footer.schema.json`](./footer.schema.json)
and the `FooterConfig` TypeScript type. Set `variant` to `compact` (the default)
or `full`. A config contains `brand` (`name`, `href`, `logo`, `description`),
`copyright`, and `columns` of titled link lists. `full` also renders optional
`social` links and a `bottom` bar. Logo is either `{ "src", "alt" }` or
`{ "svg" }`; inline SVG is inserted as trusted markup and must come from a
trusted product source. Text can be a string or `{ "text", "i18n" }`; the
renderer outputs the text and `data-t="<i18n>"` so a product's own translation
runtime can replace it.

Use it in React with the shared stylesheet:

```tsx
import { SiteFooter } from "@mobayilo/ui";
import "@mobayilo/ui/footer.css";
// <SiteFooter config={footerConfig} />
```

Render a static footer with `mo-footer render footer.json`, or write it to a
file with `mo-footer render footer.json --out footer.html`. The CLI can replace
the content between `<!-- mo-footer:start -->` and `<!-- mo-footer:end -->` with
`mo-footer inject footer.json page.html`; `mo-footer check footer.json page.html`
is suitable for product CI. The same binary provides `mo-footer css --out
footer.css` for products without a bundler. See `../examples/footer/` for
complete product configs.

`@mobayilo/ui/styles.css` imports the footer styles. Framework-free products
can load just `@mobayilo/ui/footer.css`; it has sensible standalone fallbacks.
Override these custom properties on `.mo-footer` or an ancestor:

| Property | Default |
|---|---|
| `--mo-footer-bg` | `#fff` |
| `--mo-footer-border` | theme `--line`, fallback `#e5e7eb` |
| `--mo-footer-max-width` | `80rem` |
| `--mo-footer-title-font` | theme `--mo-font-sans`, fallback system sans |
| `--mo-footer-link-font` | theme `--mo-font-sans`, fallback system sans |
| `--mo-footer-ink` | theme `--foreground`, fallback `#202124` |
| `--mo-footer-ink-soft` | theme `--muted`, fallback `#6b7280` |

```css
.mo-footer {
  --mo-footer-bg: #fff;
  --mo-footer-max-width: 76rem;
  --mo-footer-ink: #172033;
  --mo-footer-ink-soft: #667085;
}
```
