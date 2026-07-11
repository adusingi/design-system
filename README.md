# @mobayilo/design-system

A small monorepo of reusable building blocks shared across mobayilo projects, so
the same auth, theming, and Telegram wiring is configured per project instead of
re-typed each time. Motivated by the *frontend-system-design* and
*micro-frontends-and-design-systems* modules: a design system gives consistent,
named building blocks — better for humans **and** for AI-assisted development.

## Packages

| Package | What it is |
|---|---|
| [`@mobayilo/themes`](./themes) | Theme tokens (CSS variables) + `ThemeProvider`/`ThemeSwitcher`/`useTheme`. 10 themes, `mobayilo` default. |
| [`@mobayilo/ui`](./ui) | Button, Card, Dialog, Badge, Avatar, Alert, Tabs, and form controls (Input/Textarea/Select/Checkbox/Radio/Switch/Slider/Progress). Plain CSS against the theme tokens above. |
| [`@mobayilo/auth-magic-link`](./auth-magic-link) | Passwordless auth for Next.js: Better Auth magic link (+ optional Google), ZeptoMail email, session helpers, `SignInForm`. |
| [`@mobayilo/telegram-connect`](./telegram-connect) | Telegram account/group linking: webhook handler, hashed TTL tokens, message parsing, pluggable storage (Drizzle/memory). |
| [`@mobayilo/mailpit`](./mailpit) | Local-dev/test email via [Mailpit](https://mailpit.axllent.org): SMTP transport (drop-in for the ZeptoMail mailer) + REST-API inbox client for E2E tests. |

These map directly to the "repetition map" in the portfolio analysis — the
`ThemeSwitcher`+`themes.ts`, passwordless auth, and grammy/Telegram capture that
get copied into every project.

## Homepage

[`site/`](./site) is a Next.js app that showcases the whole system on one
page — tokens (color, type, spacing, radius/elevation) and every `@mobayilo/ui`
component live, including the magic-link + Google `SignInForm`. Run it with
`pnpm --filter @mobayilo/design-system-site dev`.

## Layout

```
themes/            @mobayilo/themes
ui/                @mobayilo/ui
auth-magic-link/   @mobayilo/auth-magic-link
telegram-connect/  @mobayilo/telegram-connect
mailpit/           @mobayilo/mailpit
site/              homepage / showcase (Next.js app, not published)
pnpm-workspace.yaml
tsconfig.base.json
```

## Develop

```bash
pnpm install
pnpm -r build       # build every package (tsc → dist + .d.ts)
pnpm -r typecheck   # tsc --noEmit across packages
```

Each package builds with `tsc` (per-file ESM + declarations). React component
entries carry a `"use client"` directive, which `tsc` preserves — so they work
in Next.js Server Components without a bundler.

## Consuming from another repo

While unpublished, depend on a package via the workspace (in a monorepo) or a
file/link reference. Built `dist/` is committed-ignored; run `pnpm -r build`
first, or have the consuming app transpile the package source.

## Adopting in existing projects

`@mobayilo/ui` + `@mobayilo/themes` + `@mobayilo/auth-magic-link` are the
harmonized set going forward. Rolling them into academy-mobayilo,
bentokumiko, inkoranyamuga, mobayilo, mytrip, network-mobayilo, umuzika-saas,
and veronese is a separate, per-project pass (each has its own stack and
existing auth/theming to migrate) — not done in this repo.

## Notes

- Node ≥ 20, pnpm 11.
- Standalone git repository (kept separate from the parent `p/` workspace).
