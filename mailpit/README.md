# @mobayilo/mailpit

Framework-agnostic [Mailpit](https://mailpit.axllent.org) integration for local
development and tests. Two halves:

- **`createMailpitMailer`** — an SMTP transport that sends to Mailpit. It exposes
  the *same* `sendMail({ to, subject, html, text }) → MailResult` contract as
  [`@mobayilo/auth-magic-link`](../auth-magic-link)'s `createZeptoMailer`, so it
  is a drop-in dev replacement: render the email once, pick the transport by env.
- **`createMailpitClient`** — reads the Mailpit inbox over its REST API
  (list / search / `waitForMessage` / `extractLinks`), so E2E tests can pull a
  magic link straight out of the captured email.

No React, no Next — works from a Next route handler, a worker, a Telegram agent,
or a test runner. Node ≥ 20 (uses global `fetch`).

## Run Mailpit

```bash
docker compose -f docker-compose.mailpit.yml up -d
# SMTP → localhost:1025   •   UI + API → http://localhost:8025
```

…or copy the `mailpit:` service from `docker-compose.mailpit.yml` into your
project's compose file (use the service name `mailpit` as the host when your app
runs in the same network).

## Send

```ts
import { createMailpitMailer, mailpitMailerConfigFromEnv } from "@mobayilo/mailpit";

const mailer = createMailpitMailer(mailpitMailerConfigFromEnv());

const result = await mailer.sendMail({
  to: "user@example.com",
  subject: "Hello",
  html: "<p>Hi</p>",
  text: "Hi",
});
// result: { sent: true, id } | { sent: false, reason, message }
```

### Drop-in with the magic-link email

Pick the transport with the `MAILPIT_ENABLED` toggle — Mailpit when on (the
default), ZeptoMail when off — while reusing one rendered template. Both mailers
share the same `sendMail` contract, so the rest of the app is unaware of which
is active:

```ts
import { renderMagicLinkEmail, createZeptoMailer } from "@mobayilo/auth-magic-link";
import { createMailpitMailer, mailpitMailerConfigFromEnv, mailpitEnabledFromEnv } from "@mobayilo/mailpit";

const mailer = mailpitEnabledFromEnv()
  ? createMailpitMailer(mailpitMailerConfigFromEnv())
  : createZeptoMailer({ token: process.env.ZEPTOMAIL_SEND_MAIL_TOKEN ?? "", fromAddress: process.env.EMAIL_FROM ?? "" });

export async function sendMagicLinkEmail(to: string, url: string) {
  const { subject, html, text } = renderMagicLinkEmail({ appName: "MyApp" }, url);
  return mailer.sendMail({ to, subject, html, text });
}
```

`mailpitEnabledFromEnv()` reads `MAILPIT_ENABLED` and **defaults to `true`** when
unset, so mail never accidentally escapes to a real provider in an unconfigured
environment. Set `MAILPIT_ENABLED=false` to send for real.

## Read (tests)

```ts
import { createMailpitClient, extractLinks, mailpitClientConfigFromEnv } from "@mobayilo/mailpit";

const inbox = createMailpitClient(mailpitClientConfigFromEnv());

await inbox.deleteAll();                       // clean slate before the test
// … trigger the app to send a sign-in email …
const msg = await inbox.waitForMessage((m) => m.To.some((t) => t.Address === "user@example.com"));
const [magicLink] = extractLinks(msg.Text || msg.HTML);
```

Other client methods: `messages(limit?)`, `search(query, limit?)`, `latest()`,
`message(id)`, `deleteAll()`.

## Environment variables

See [`.env.example`](./.env.example). Everything has a default; a plain local
setup needs none.

| Variable | Default | Purpose |
|---|---|---|
| `MAILPIT_ENABLED` | `true` | Deliver to Mailpit (`true`) or a real provider (`false`) |
| `MAILPIT_SMTP_HOST` | `localhost` | SMTP host (use the compose service name in-network) |
| `MAILPIT_SMTP_PORT` | `1025` | SMTP port |
| `MAILPIT_SMTP_USER` / `MAILPIT_SMTP_PASS` | _(empty)_ | SMTP auth, only if `MP_SMTP_AUTH` is enabled |
| `MAILPIT_SMTP_SECURE` | `false` | `true` to connect over TLS |
| `MAILPIT_FROM_ADDRESS` | `no-reply@localhost` | Sender address (falls back to `EMAIL_FROM`) |
| `MAILPIT_FROM_NAME` | `Mobayilo` | Sender display name |
| `MAILPIT_REPLY_TO` | _(empty)_ | Optional reply-to |
| `MAILPIT_API_URL` | `http://localhost:8025` | Mailpit web/API base URL |
| `MAILPIT_UI_USER` / `MAILPIT_UI_PASS` | _(empty)_ | Basic-auth, only if `MP_UI_AUTH` is enabled |

## Build

```bash
pnpm install
pnpm build       # tsc → dist + .d.ts
pnpm typecheck
```
