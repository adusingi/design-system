# telegram-connect — Usage

## Install

```bash
npm install telegram-connect drizzle-orm zod
```

## 1. Add the schema

Include these tables in your Drizzle schema or import them directly:

```ts
import {
  telegramAccounts,
  telegramChats,
  telegramLinkTokens,
  telegramGroupLinkTokens,
  telegramUpdates,
} from "telegram-connect/schema";
```

## 2. Create an adapter

```ts
import { createDrizzleAdapter } from "telegram-connect/adapters/drizzle";

const adapter = createDrizzleAdapter({ db, schema });
```

For tests you can use the memory adapter:

```ts
import { createMemoryAdapter } from "telegram-connect/adapters/memory";

const adapter = createMemoryAdapter();
```

## 3. Handle webhooks

```ts
import { createWebhookHandler } from "telegram-connect";

export const telegramWebhook = createWebhookHandler({
  botToken: process.env.TELEGRAM_BOT_TOKEN!,
  webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET!,
  botUsername: "@MyBot",
  adapter,
  onMessage: async (ctx) => {
    console.log(ctx.workspaceId, ctx.parsed.text, ctx.parsed.attachments);
  },
});
```

Wire it into any framework that exposes `Request` / `Response`:

```ts
// Next.js
export async function POST(request: Request) {
  return telegramWebhook(request);
}
```

## 4. Generate link tokens

Account link:

```ts
import { createAccountLinkToken } from "telegram-connect";

const { token } = await createAccountLinkToken(adapter, workspaceId, userId);
// Show this to the user: /start <token>
```

Group link:

```ts
import { createGroupLinkToken } from "telegram-connect";

const { token } = await createGroupLinkToken(adapter, workspaceId);
// Show this to the user: /link_group <token>
```

## 5. Register the webhook with Telegram

```bash
curl -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -H "content-type: application/json" \
  -d '{"url":"https://your-domain.com/api/telegram/webhook","secret_token":"YOUR_WEBHOOK_SECRET"}'
```

## Customize replies

```ts
createWebhookHandler({
  // ...
  messages: {
    accountLinked: "You're connected!",
    unlinkedAccount: "Link your account in settings first.",
  },
});
```
