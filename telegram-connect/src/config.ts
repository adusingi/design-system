import type {
  LinkedTelegramAccount,
  LinkedTelegramChat,
  StorageAdapter,
} from "./adapters/interface.js";
import type { ParsedTelegramMessage, TelegramMessage } from "./types.js";

export interface TelegramConnectMessages {
  accountLinked: string;
  accountLinkInvalid: string;
  chatLinked: string;
  chatLinkInvalid: string;
  unlinkedAccount: string;
  unlinkedChat: string;
  unlinkedSender: string;
}

export const defaultMessages: TelegramConnectMessages = {
  accountLinked: "Telegram is linked to your account.",
  accountLinkInvalid: "That link is expired or invalid. Create a new link from settings.",
  chatLinked: "This Telegram group is linked.",
  chatLinkInvalid: "That group link is expired or invalid. Create a new one from settings.",
  unlinkedAccount:
    "This Telegram account is not linked yet. Open settings and create a link token.",
  unlinkedChat: "This group is not linked. Ask an admin to create a group link token.",
  unlinkedSender: "Your Telegram account is not linked to this workspace. Link it by DM first.",
};

export interface ResolvedMessageContext {
  workspaceId: string;
  accountId: string;
  chatId: string;
  senderName: string | null;
  parsed: ParsedTelegramMessage;
  update: {
    updateId: number;
    rawUpdate: unknown;
  };
}

export interface TelegramConnectConfig {
  /** Telegram bot token from @BotFather. */
  botToken: string;
  /** Secret token Telegram sends in the webhook request header. */
  webhookSecret: string;
  /** Bot handle, e.g. "@MyBot". Used when building link commands. */
  botUsername?: string;
  /** Storage adapter for accounts, chats, tokens and webhook deduplication. */
  adapter: StorageAdapter;
  /** Customize reply messages. */
  messages?: Partial<TelegramConnectMessages>;
  /** Called after a Telegram account is linked. */
  onAccountLinked?: (account: LinkedTelegramAccount) => void | Promise<void>;
  /** Called after a Telegram group/chat is linked. */
  onChatLinked?: (chat: LinkedTelegramChat) => void | Promise<void>;
  /** Called for regular messages once the sender/workspace context is resolved. */
  onMessage?: (context: ResolvedMessageContext) => void | Promise<void>;
}

export interface AccountLinkCommandConfig {
  /** Bot command used for account linking. Default: "/start". */
  command?: string;
  /** Bot handle, e.g. "@MyBot". */
  botUsername?: string;
  /** Build a command string shown to the user. */
  format?: (token: string, botUsername?: string) => string;
}

export interface GroupLinkCommandConfig {
  /** Bot command used for group linking. Default: "/link_group". */
  command?: string;
  /** Bot handle, e.g. "@MyBot". */
  botUsername?: string;
  /** Build a command string shown to the user. */
  format?: (token: string, botUsername?: string) => string;
}

export function formatStartCommand(token: string, botUsername?: string) {
  const command = `/start ${token}`;
  return botUsername ? `${command} (${botUsername})` : command;
}

export function formatGroupCommand(token: string, botUsername?: string) {
  const command = `/link_group ${token}`;
  return botUsername ? `${command} (${botUsername})` : command;
}

export function buildAccountLinkMessage(token: string, config?: AccountLinkCommandConfig) {
  const format = config?.format ?? formatStartCommand;
  return format(token, config?.botUsername);
}

export function buildGroupLinkMessage(token: string, config?: GroupLinkCommandConfig) {
  const format = config?.format ?? formatGroupCommand;
  return format(token, config?.botUsername);
}
