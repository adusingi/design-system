# @mobayilo/auth-magic-link

Reusable passwordless auth for Next.js apps — Better Auth **magic link** (+ optional
Google), **ZeptoMail** email, request-scoped session helpers, and a drop-in
`SignInForm`. Extracted from the mytrip/emilyhub pattern.

## Install

```jsonc
"dependencies": {
  "@mobayilo/auth-magic-link": "workspace:*",
  "better-auth": "^1.6.0"
}
```

`better-auth`, `react`, and `next` are peer dependencies (you already have them).

## Server auth

You own the Drizzle schema + adapter (so the package stays storage-agnostic);
the package wires magic link, Google, email, and the username hook.

```ts
// lib/auth.ts
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  createMagicLinkAuth,
  createZeptoMailer,
  renderMagicLinkEmail,
  deriveUsername,
} from "@mobayilo/auth-magic-link";
import { db } from "./db";
import { account, session, user, verification } from "./schema";

const mailer = createZeptoMailer({
  token: process.env.ZEPTOMAIL_SEND_MAIL_TOKEN!,
  fromAddress: process.env.ZEPTOMAIL_FROM_ADDRESS!,
  fromName: "MyTrip",
});

export const auth = createMagicLinkAuth({
  appName: "MyTrip",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema: { user, session, account, verification } }),
  google:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }
      : undefined,
  sendMagicLink: async ({ email, url }) => {
    const { subject, html, text } = renderMagicLinkEmail({ appName: "MyTrip" }, url);
    await mailer.sendMail({ to: email, subject, html, text });
  },
  user: {
    additionalFields: {
      username: { type: "string", required: false, input: false },
      bio: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: { create: { before: async (u) => ({ data: { ...u, username: u.username ?? deriveUsername(u.email) } }) } },
  },
});
```

Route handler:

```ts
// app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
export const { GET, POST } = toNextJsHandler(auth);
```

## Session helpers (server)

```ts
// lib/session.ts
import { createSessionHelpers } from "@mobayilo/auth-magic-link/next";
import { auth } from "./auth";
export const { getViewer, getViewerId } = createSessionHelpers(auth);
```

## Client

The Better Auth client must see the concrete `typeof auth` for additional-field
inference, so write it inline (it's a 6-liner the package can't wrap):

```ts
// lib/auth-client.ts
"use client";
import { createAuthClient } from "better-auth/react";
import { magicLinkClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";
export const authClient = createAuthClient({
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
});
export const { signIn, signOut, useSession } = authClient;
```

## Sign-in form

```tsx
import { SignInForm } from "@mobayilo/auth-magic-link/sign-in-form";
import "@mobayilo/auth-magic-link/styles.css";
import { signIn } from "@/lib/auth-client";
import { sendSignInLink } from "./actions"; // server action -> {ok, message}

<SignInForm
  action={sendSignInLink}
  onGoogle={() => signIn.social({ provider: "google", callbackURL: "/" })}
/>
```

The form is styled with the `@mobayilo/themes` CSS variables, so it matches the
active theme with no Tailwind config.

## Exports

| Subpath | Contents |
|---|---|
| `.` | `createMagicLinkAuth`, `deriveUsername`, `createZeptoMailer`, `renderMagicLinkEmail`, `escapeHtml` |
| `./next` | `createSessionHelpers` (uses `next/headers`) |
| `./sign-in-form` | `SignInForm` (client) |
| `./styles.css` | Form styling |
