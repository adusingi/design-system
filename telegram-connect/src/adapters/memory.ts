import type {
  LinkToken,
  LinkedTelegramAccount,
  LinkedTelegramChat,
  StorageAdapter,
} from "./interface.js";
import type { TelegramMessage } from "../types.js";

export function createMemoryAdapter(): StorageAdapter {
  const accountTokens = new Map<string, LinkToken>();
  const groupTokens = new Map<string, LinkToken>();
  const accounts = new Map<string, LinkedTelegramAccount>();
  const accountsByTelegramUserId = new Map<number, LinkedTelegramAccount>();
  const chats = new Map<string, LinkedTelegramChat>();
  const chatsByTelegramChatId = new Map<number, LinkedTelegramChat>();
  const updates = new Map<number, { rawUpdate: unknown; processedAt?: Date }>();

  function id() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  return {
    async createAccountLinkToken(input) {
      const token: LinkToken = {
        id: id(),
        workspaceId: input.workspaceId,
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        usedAt: null,
        createdAt: new Date(),
      };
      accountTokens.set(token.id, token);
      return token;
    },

    async consumeAccountLinkToken(tokenHash) {
      const token = [...accountTokens.values()].find(
        (t) => t.tokenHash === tokenHash && !t.usedAt && t.expiresAt > new Date(),
      );
      if (!token) return null;
      token.usedAt = new Date();
      return token;
    },

    async createGroupLinkToken(input) {
      const token: LinkToken = {
        id: id(),
        workspaceId: input.workspaceId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        usedAt: null,
        createdAt: new Date(),
      };
      groupTokens.set(token.id, token);
      return token;
    },

    async consumeGroupLinkToken(tokenHash) {
      const token = [...groupTokens.values()].find(
        (t) => t.tokenHash === tokenHash && !t.usedAt && t.expiresAt > new Date(),
      );
      if (!token) return null;
      token.usedAt = new Date();
      return token;
    },

    async upsertAccount(input) {
      const existing = accountsByTelegramUserId.get(input.telegramUserId);
      const account: LinkedTelegramAccount = {
        id: existing?.id ?? id(),
        workspaceId: input.workspaceId,
        userId: input.userId,
        telegramUserId: input.telegramUserId,
        username: input.username ?? null,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        status: input.status ?? "active",
        linkedAt: existing?.linkedAt ?? new Date(),
        createdAt: existing?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };
      accounts.set(account.id, account);
      accountsByTelegramUserId.set(account.telegramUserId, account);
      return account;
    },

    async findAccount(telegramUserId) {
      return accountsByTelegramUserId.get(telegramUserId) ?? null;
    },

    async upsertChat(input) {
      const existing = chatsByTelegramChatId.get(input.chat.id);
      const title =
        (input.chat.title ??
          [input.chat.first_name, input.chat.last_name].filter(Boolean).join(" ")) ||
        null;

      const chat: LinkedTelegramChat = {
        id: existing?.id ?? id(),
        workspaceId: input.workspaceId,
        telegramChatId: input.chat.id,
        type: input.chat.type,
        title,
        status: input.status ?? "active",
        createdAt: existing?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };
      chats.set(chat.id, chat);
      chatsByTelegramChatId.set(chat.telegramChatId, chat);
      return chat;
    },

    async findChat(telegramChatId) {
      return chatsByTelegramChatId.get(telegramChatId) ?? null;
    },

    async recordUpdate(input) {
      if (updates.has(input.updateId)) return false;
      updates.set(input.updateId, { rawUpdate: input.rawUpdate });
      return true;
    },

    async markUpdateProcessed(updateId) {
      const update = updates.get(updateId);
      if (update) {
        update.processedAt = new Date();
      }
    },
  };
}
