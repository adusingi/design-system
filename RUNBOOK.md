# RUNBOOK — @mobayilo/design-system
*Last updated: 2026-07-11*

Standalone pnpm workspace (kept separate from the parent `p/` folder — see
`README.md`). Six packages: `themes`, `ui`, `auth-magic-link`,
`telegram-connect`, `mailpit`, and `site` (the homepage/showcase).

---

## Ports at a Glance

| Service | Port | URL |
|---|---|---|
| `site` (showcase homepage) | 3000 (default) | http://localhost:3000 |
| Mailpit web UI + REST API (optional) | 8025 | http://localhost:8025 |
| Mailpit SMTP (optional) | 1025 | — |

`next dev` defaults to 3000. If that's taken by another project on the same
machine, pick a free port explicitly — this session used `--port 4173`.

---

## First-Time Setup

```bash
git clone <this repo>   # or just cd in, if already local
cd design-system

pnpm install       # installs all 6 workspace packages
pnpm -r build      # build themes/ui/auth-magic-link/telegram-connect/mailpit → dist/
                    # (site doesn't need a build step for dev)
```

Requires Node ≥ 20 and pnpm 11 (`packageManager: "pnpm@11.7.0"` in
`package.json` — corepack will pick it up automatically).

---

## Daily Development

### Run the showcase homepage

```bash
pnpm --filter @mobayilo/design-system-site dev
# or, to avoid a port clash with another project (use `exec`, not `dev --`,
# or pnpm forwards a literal `--` to Next and it misreads --port as the
# project directory):
pnpm --filter @mobayilo/design-system-site exec next dev --port 4173
```

Open http://localhost:3000 (or whatever port you chose). Click the theme
trigger top-right (or press `/`) to switch between all 10 themes; scroll to
**Components** for the full gallery, including the magic-link + Google
`SignInForm` demo (mocked — no real email is sent, no secrets required).

### Rebuild a package after editing its source

```bash
pnpm --filter @mobayilo/ui build         # e.g. after editing ui/src/*
pnpm --filter @mobayilo/themes build
```

The `site` app imports package `dist/` output (via workspace `exports`), so a
package edit needs a rebuild before `site`'s dev server picks it up — Next's
Turbopack does hot-reload once `dist/` changes, no restart needed.

---

## Services — Individual Commands

### `ui` — components

```bash
cd ui
pnpm build       # tsc → dist/ + .d.ts
pnpm typecheck   # tsc --noEmit
```

### `themes` — tokens, ThemeProvider/ThemeSwitcher

```bash
cd themes
pnpm build
pnpm typecheck
```

### `auth-magic-link` — passwordless auth

```bash
cd auth-magic-link
pnpm build
pnpm typecheck
```

### `telegram-connect`

```bash
cd telegram-connect
pnpm build
pnpm typecheck
```

### `mailpit` — local email capture client

```bash
cd mailpit
pnpm build
pnpm typecheck
```

### `site` — homepage/showcase (Next.js, not published)

```bash
cd site
pnpm dev         # dev server
pnpm build       # production build (also type-checks via Next's build step)
pnpm start       # serve the production build
pnpm typecheck   # tsc --noEmit
```

---

## Build All

```bash
pnpm -r build       # build every package (tsc → dist + .d.ts; site → .next)
pnpm -r typecheck   # tsc --noEmit across every package
```

---

## Mailpit (optional — local email testing)

Only needed if you're wiring a real `@mobayilo/auth-magic-link` flow (not the
`site` demo, which mocks the send). Run standalone:

```bash
docker compose -f mailpit/docker-compose.mailpit.yml up -d
# Web UI + REST API: http://localhost:8025
# SMTP:               localhost:1025
```

Env vars are documented in `mailpit/.env.example`; defaults work for a plain
local setup with no configuration.

---

## Required Secrets

**None** to run `site` locally — the Sign-in panel's magic-link action and
Google button are demo stand-ins (a 600ms fake delay, no network call).

If a project wires `@mobayilo/auth-magic-link` for real, it needs the house
standard (see `academy-mobayilo`, `umuzika-saas` for reference implementations):

```bash
BETTER_AUTH_SECRET=...           # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:[port]
ZEPTOMAIL_SEND_MAIL_TOKEN=...    # Zoho ZeptoMail "Send Mail" token
EMAIL_FROM=noreply@mobayilo.com
MAILPIT_ENABLED=true             # dev: capture mail locally instead of sending
# Optional — setting both makes "Continue with Google" appear:
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
```

---

## CI/CD

None configured in this repo yet (the parent `p/` workspace has its own
`.github/workflows/ci.yml`, unrelated to this standalone repo). Before
pushing, run locally:

```bash
pnpm -r typecheck
pnpm -r build
```

---

## Production Deployment

Not deployed. This repo is an internal, unpublished package workspace plus a
showcase site — there's no live URL yet. If/when `site` needs one, follow the
house standard (Dokploy) per the global RUNBOOK checklist; nothing here is
wired for that yet (no `Dockerfile`, no compose file for `site`).

---

## Common Troubleshooting

### `next build` / `next dev`: "Module not found" for a relative import ending in `.js`
The workspace **packages** (`ui`, `themes`, `auth-magic-link`, ...) are built
with `tsc`, so their own source uses NodeNext-style `./foo.js` relative
imports (resolved after compilation). `site` is bundled directly by Next's
Turbopack from `.tsx` source — it does **not** use that convention. Relative
imports inside `site/` must be extensionless (`from "../components/x"`, not
`from "../components/x.js"`). Only `.js` subpath imports of *published*
package exports (e.g. `@mobayilo/auth-magic-link/sign-in-form`) are correct.

### `next build` rewrites `site/tsconfig.json` or `site/next-env.d.ts`
Expected — Next.js auto-adjusts a couple of fields (`jsx`, the `.next/types`
include glob) on first build/dev. Harmless; commit the result.

### pnpm version mismatch
```bash
node --version   # must be 20+
pnpm --version   # must be 11+ (corepack enable will fix this)
```

### A package edit isn't showing up in `site`
`site` consumes package `dist/` output via `package.json` `exports`, not
source directly. Rebuild the package (`pnpm --filter @mobayilo/<pkg> build`)
after editing its `src/`.

### Port already in use
Another project's dev server is probably still running. Pick a different
port: `pnpm --filter @mobayilo/design-system-site exec next dev --port <free-port>`.

### `pnpm ... dev -- --port <n>` fails with "Invalid project directory provided, no such directory: .../--port"
pnpm forwards the literal `--` through to Next's CLI instead of stripping
it, so Next reads `--port` as its positional `[directory]` argument. Use
`pnpm --filter @mobayilo/design-system-site exec next dev --port <n>`
instead — `exec` runs the `next` binary directly, no script-arg forwarding
involved.
