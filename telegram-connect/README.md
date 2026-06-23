# telegram-connect

A reusable, framework-agnostic package for connecting Telegram accounts and groups to your application. It handles Telegram Bot API webhooks, secure link tokens, account/group linking, and deduplication.

## Features

- **Account linking** — Users send `/start <token>` to your bot in a private chat.
- **Group linking** — Admins send `/link_group <token>` in a group chat.
- **Secure tokens** — SHA-256 hashed, time-limited, single-use link tokens.
- **Webhook deduplication** — Tracks `update_id` to avoid double processing.
- **Framework-agnostic** — Exposes a `(request: Request) => Promise<Response>` handler.
- **Storage adapters** — Ships with Drizzle and in-memory adapters; roll your own.
- **Type-safe** — Written in TypeScript with Zod-validated Telegram payloads.

## Install

```bash
npm install telegram-connect
```

Peer dependencies:

```bash
npm install drizzle-orm zod
```

## Quick start

### 1. Add the schema to your database

```typescript
import { pgTable, uuid, text, bigint, timestamp, jsonb, bigserial, index, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { telegramAccounts, telegramChats, telegramLinkTokens, telegramGroupLinkTokens, telegramUpdates, linkStatus, chatType } from "telegram-connect/schema";
```

Or re-export them from your own schema file and pass them to Drizzle.

### 2. Create a storage adapter

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import { createDrizzleAdapter } from "telegram-connect/adapters/drizzle";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const adapter = createDrizzleAdapter({ db, schema });
```

### 3. Create the webhook handler

```typescript
import { createWebhookHandler, createAccountLinkToken, createGroupLinkToken } from "telegram-connect";

const handler = createWebhookHandler({
  botToken: process.env.TELEGRAM_BOT_TOKEN!,
  webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET!,
  botUsername: "@MyBot",
  adapter,
  onMessage: async (ctx) => {
    console.log("Message from workspace", ctx.workspaceId, ctx.parsed.text);
    // Handle the message however you want.
  },
});

// Next.js example
export async function POST(request: Request) {
  return handler(request);
}
```

### 4. Generate link tokens

```typescript
// In your server action / API route
const { token, expiresAt } = await createAccountLinkToken(adapter, workspaceId, userId);
const command = `/start ${token}`;
```

```typescript
const { token, expiresAt } = await createGroupLinkToken(adapter, workspaceId);
const command = `/link_group ${token}`;
```

### 5. Register the webhook with Telegram

```bash
curl -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -H "content-type: application/json" \
  -d '{"url":"https://your-domain.com/api/telegram/webhook","secret_token":"YOUR_WEBHOOK_SECRET"}'
```

## Custom messages

```typescript
const handler = createWebhookHandler({
  // ...
  messages: {
    accountLinked: "Connected! You can now send messages here.",
    unlinkedAccount: "Please link your account in settings first.",
  },
});
```

## Storage adapter interface

You can implement your own adapter:

```typescript
import type { StorageAdapter } from "telegram-connect";

const adapter: StorageAdapter = {
  createAccountLinkToken: async (input) => { /* ... */ },
  consumeAccountLinkToken: async (tokenHash) => { /* ... */ },
  createGroupLinkToken: async (input) => { /* ... */ },
  consumeGroupLinkToken: async (tokenHash) => { /* ... */ },
  upsertAccount: async (input) => { /* ... */ },
  findAccount: async (telegramUserId) => { /* ... */ },
  upsertChat: async (input) => { /* ... */ },
  findChat: async (telegramChatId) => { /* ... */ },
  recordUpdate: async (input) => { /* ... */ },
  markUpdateProcessed: async (updateId) => { /* ... */ },
};
```

## License

MIT
