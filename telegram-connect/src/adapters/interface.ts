import type { TelegramMessage } from "../types.js";

export type LinkStatus = "pending" | "active" | "revoked";
export type TelegramChatType = "private" | "group" | "supergroup" | "channel";

export interface LinkedTelegramAccount {
  id: string;
  workspaceId: string;
  userId: string;
  telegramUserId: number;
  displayName?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  status: LinkStatus;
  linkedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkedTelegramChat {
  id: string;
  workspaceId: string;
  telegramChatId: number;
  type: TelegramChatType;
  title?: string | null;
  status: LinkStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkToken {
  id: string;
  workspaceId: string;
  userId?: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}

export interface StorageAdapter {
  /** Create an account-link token for a user in a workspace. */
  createAccountLinkToken(input: {
    workspaceId: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<LinkToken>;

  /** Consume an account-link token. Returns the token row or null if invalid/expired. */
  consumeAccountLinkToken(tokenHash: string): Promise<LinkToken | null>;

  /** Create a group/chat-link token for a workspace. */
  createGroupLinkToken(input: {
    workspaceId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<LinkToken>;

  /** Consume a group-link token. Returns the token row or null if invalid/expired. */
  consumeGroupLinkToken(tokenHash: string): Promise<LinkToken | null>;

  /** Upsert a linked account. */
  upsertAccount(input: {
    workspaceId: string;
    userId: string;
    telegramUserId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    status?: LinkStatus;
  }): Promise<LinkedTelegramAccount>;

  /** Find an active linked account by Telegram user id. */
  findAccount(telegramUserId: number): Promise<LinkedTelegramAccount | null>;

  /** Upsert a linked chat. */
  upsertChat(input: {
    workspaceId: string;
    chat: TelegramMessage["chat"];
    status?: LinkStatus;
  }): Promise<LinkedTelegramChat>;

  /** Find an active linked chat by Telegram chat id. */
  findChat(telegramChatId: number): Promise<LinkedTelegramChat | null>;

  /** Record a raw webhook update. Returns true if this is the first time seeing updateId. */
  recordUpdate(input: { updateId: number; rawUpdate: unknown }): Promise<boolean>;

  /** Mark a webhook update as processed. */
  markUpdateProcessed(updateId: number): Promise<void>;
}
