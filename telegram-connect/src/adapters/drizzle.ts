import { and, eq, gt, isNull } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import type { LinkedTelegramAccount, LinkedTelegramChat, StorageAdapter } from "./interface.js";
import {
  telegramAccounts,
  telegramChats,
  telegramGroupLinkTokens,
  telegramLinkTokens,
  telegramUpdates,
} from "../schema.js";
import type { TelegramMessage } from "../types.js";

export type TelegramConnectSchema = {
  telegramAccounts: typeof telegramAccounts;
  telegramChats: typeof telegramChats;
  telegramLinkTokens: typeof telegramLinkTokens;
  telegramGroupLinkTokens: typeof telegramGroupLinkTokens;
  telegramUpdates: typeof telegramUpdates;
};

export interface DrizzleAdapterOptions<
  TDb extends PgDatabase<PgQueryResultHKT, TelegramConnectSchema>,
> {
  db: TDb;
  schema?: Partial<TelegramConnectSchema>;
}

export function createDrizzleAdapter<
  TDb extends PgDatabase<PgQueryResultHKT, TelegramConnectSchema>,
>(options: DrizzleAdapterOptions<TDb>): StorageAdapter {
  const { db } = options;
  const schema: TelegramConnectSchema = {
    telegramAccounts,
    telegramChats,
    telegramLinkTokens,
    telegramGroupLinkTokens,
    telegramUpdates,
    ...options.schema,
  };

  return {
    async createAccountLinkToken(input) {
      const [row] = await db
        .insert(schema.telegramLinkTokens)
        .values({
          workspaceId: input.workspaceId,
          userId: input.userId,
          tokenHash: input.tokenHash,
          expiresAt: input.expiresAt,
        })
        .returning();
      return row;
    },

    async consumeAccountLinkToken(tokenHash) {
      const row = await db.query.telegramLinkTokens.findFirst({
        where: and(
          eq(schema.telegramLinkTokens.tokenHash, tokenHash),
          isNull(schema.telegramLinkTokens.usedAt),
          gt(schema.telegramLinkTokens.expiresAt, new Date()),
        ),
      });

      if (!row) return null;

      await db
        .update(schema.telegramLinkTokens)
        .set({ usedAt: new Date() })
        .where(eq(schema.telegramLinkTokens.id, row.id));

      return row;
    },

    async createGroupLinkToken(input) {
      const [row] = await db
        .insert(schema.telegramGroupLinkTokens)
        .values({
          workspaceId: input.workspaceId,
          tokenHash: input.tokenHash,
          expiresAt: input.expiresAt,
        })
        .returning();
      return row;
    },

    async consumeGroupLinkToken(tokenHash) {
      const row = await db.query.telegramGroupLinkTokens.findFirst({
        where: and(
          eq(schema.telegramGroupLinkTokens.tokenHash, tokenHash),
          isNull(schema.telegramGroupLinkTokens.usedAt),
          gt(schema.telegramGroupLinkTokens.expiresAt, new Date()),
        ),
      });

      if (!row) return null;

      await db
        .update(schema.telegramGroupLinkTokens)
        .set({ usedAt: new Date() })
        .where(eq(schema.telegramGroupLinkTokens.id, row.id));

      return row;
    },

    async upsertAccount(input) {
      const [account] = await db
        .insert(schema.telegramAccounts)
        .values({
          workspaceId: input.workspaceId,
          userId: input.userId,
          telegramUserId: input.telegramUserId,
          username: input.username ?? null,
          firstName: input.firstName ?? null,
          lastName: input.lastName ?? null,
          status: input.status ?? "active",
        })
        .onConflictDoUpdate({
          target: [schema.telegramAccounts.workspaceId, schema.telegramAccounts.telegramUserId],
          set: {
            userId: input.userId,
            username: input.username ?? null,
            firstName: input.firstName ?? null,
            lastName: input.lastName ?? null,
            status: input.status ?? "active",
            updatedAt: new Date(),
          },
        })
        .returning();
      return account;
    },

    async findAccount(telegramUserId) {
      return (
        (await db.query.telegramAccounts.findFirst({
          where: and(
            eq(schema.telegramAccounts.telegramUserId, telegramUserId),
            eq(schema.telegramAccounts.status, "active"),
          ),
        })) ?? null
      );
    },

    async upsertChat(input) {
      const title =
        (input.chat.title ??
          [input.chat.first_name, input.chat.last_name].filter(Boolean).join(" ")) ||
        null;

      const [chat] = await db
        .insert(schema.telegramChats)
        .values({
          workspaceId: input.workspaceId,
          telegramChatId: input.chat.id,
          type: input.chat.type,
          title,
          status: input.status ?? "active",
        })
        .onConflictDoUpdate({
          target: [schema.telegramChats.workspaceId, schema.telegramChats.telegramChatId],
          set: {
            type: input.chat.type,
            title,
            status: input.status ?? "active",
            updatedAt: new Date(),
          },
        })
        .returning();
      return chat;
    },

    async findChat(telegramChatId) {
      return (
        (await db.query.telegramChats.findFirst({
          where: and(
            eq(schema.telegramChats.telegramChatId, telegramChatId),
            eq(schema.telegramChats.status, "active"),
          ),
        })) ?? null
      );
    },

    async recordUpdate(input) {
      const inserted = await db
        .insert(schema.telegramUpdates)
        .values({
          updateId: input.updateId,
          rawUpdate: input.rawUpdate,
        })
        .onConflictDoNothing()
        .returning();
      return inserted.length > 0;
    },

    async markUpdateProcessed(updateId) {
      await db
        .update(schema.telegramUpdates)
        .set({ processedAt: new Date() })
        .where(eq(schema.telegramUpdates.updateId, updateId));
    },
  };
}
