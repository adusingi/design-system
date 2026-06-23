import {
  bigint,
  bigserial,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const linkStatus = pgEnum("telegram_connect_link_status", [
  "pending",
  "active",
  "revoked",
]);

export const chatType = pgEnum("telegram_connect_chat_type", [
  "private",
  "group",
  "supergroup",
  "channel",
]);

export const telegramAccounts = pgTable(
  "telegram_connect_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: text("workspace_id").notNull(),
    userId: text("user_id").notNull(),
    telegramUserId: bigint("telegram_user_id", { mode: "number" }).notNull(),
    displayName: text("display_name"),
    username: text("username"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    status: linkStatus("status").notNull().default("active"),
    linkedAt: timestamp("linked_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("telegram_connect_accounts_workspace_user_idx").on(
      table.workspaceId,
      table.telegramUserId,
    ),
    index("telegram_connect_accounts_user_idx").on(table.userId),
    index("telegram_connect_accounts_telegram_user_idx").on(table.telegramUserId),
  ],
);

export const telegramLinkTokens = pgTable(
  "telegram_connect_link_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: text("workspace_id").notNull(),
    userId: text("user_id").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("telegram_connect_link_tokens_hash_idx").on(table.tokenHash),
    index("telegram_connect_link_tokens_workspace_idx").on(table.workspaceId),
  ],
);

export const telegramChats = pgTable(
  "telegram_connect_chats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: text("workspace_id").notNull(),
    telegramChatId: bigint("telegram_chat_id", { mode: "number" }).notNull(),
    type: chatType("type").notNull(),
    title: text("title"),
    status: linkStatus("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("telegram_connect_chats_workspace_chat_idx").on(
      table.workspaceId,
      table.telegramChatId,
    ),
    index("telegram_connect_chats_chat_idx").on(table.telegramChatId),
  ],
);

export const telegramGroupLinkTokens = pgTable(
  "telegram_connect_group_link_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: text("workspace_id").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("telegram_connect_group_link_tokens_hash_idx").on(table.tokenHash),
    index("telegram_connect_group_link_tokens_workspace_idx").on(table.workspaceId),
  ],
);

export const telegramUpdates = pgTable(
  "telegram_connect_updates",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    updateId: bigint("update_id", { mode: "number" }).notNull(),
    rawUpdate: jsonb("raw_update").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("telegram_connect_updates_update_idx").on(table.updateId)],
);
