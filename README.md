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
| [`@mobayilo/auth-magic-link`](./auth-magic-link) | Passwordless auth for Next.js: Better Auth magic link (+ optional Google), ZeptoMail email, session helpers, `SignInForm`. |
| [`@mobayilo/telegram-connect`](./telegram-connect) | Telegram account/group linking: webhook handler, hashed TTL tokens, message parsing, pluggable storage (Drizzle/memory). |

These map directly to the "repetition map" in the portfolio analysis — the
`ThemeSwitcher`+`themes.ts`, passwordless auth, and grammy/Telegram capture that
get copied into every project.

## Layout

```
themes/            @mobayilo/themes
auth-magic-link/   @mobayilo/auth-magic-link
telegram-connect/  @mobayilo/telegram-connect
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

## Notes

- Node ≥ 20, pnpm 11.
- Standalone git repository (kept separate from the parent `p/` workspace).
