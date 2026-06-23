export {
  createTelegramClient,
  type TelegramClient,
  type TelegramClientOptions,
  type TelegramFile,
  type TelegramFileResponse,
  type TelegramMessageResponse,
} from "./client.js";

export {
  createAccountLinkToken,
  createGroupLinkToken,
  type CreateLinkTokenOptions,
} from "./linking.js";

export {
  extractIncomingMessage,
  isOversizedAttachment,
  isSupportedMimeType,
  parseCallbackData,
  parseGroupLinkToken,
  parseStartToken,
  parseTelegramUpdate,
  telegramAccountSenderName,
  telegramSenderName,
} from "./parser.js";

export {
  DEFAULT_TOKEN_TTL_MINUTES,
  hashToken,
  makeToken,
  tokenExpiresAt,
} from "./tokens.js";

export {
  TELEGRAM_MAX_DOWNLOAD_BYTES,
  TelegramCallbackQuerySchema,
  TelegramChatSchema,
  TelegramDocumentSchema,
  TelegramMessageSchema,
  TelegramPhotoSizeSchema,
  TelegramUpdateSchema,
  TelegramUserSchema,
  type ParsedAttachment,
  type ParsedTelegramMessage,
  type TelegramCallbackQuery,
  type TelegramChat as TelegramChatInfo,
  type TelegramDocument,
  type TelegramInlineKeyboardMarkup,
  type TelegramMessage,
  type TelegramPhotoSize,
  type TelegramUpdate,
  type TelegramUser,
} from "./types.js";

export {
  createWebhookHandler,
  type WebhookHandler,
} from "./webhook.js";

export {
  buildAccountLinkMessage,
  buildGroupLinkMessage,
  formatGroupCommand,
  formatStartCommand,
  type AccountLinkCommandConfig,
  type GroupLinkCommandConfig,
  type ResolvedMessageContext,
  type TelegramConnectConfig,
  type TelegramConnectMessages,
  defaultMessages,
} from "./config.js";

export {
  createDrizzleAdapter,
  type DrizzleAdapterOptions,
  type TelegramConnectSchema,
} from "./adapters/drizzle.js";

export { createMemoryAdapter } from "./adapters/memory.js";

export type {
  LinkStatus,
  LinkToken,
  LinkedTelegramAccount,
  LinkedTelegramChat,
  StorageAdapter,
  TelegramChatType,
} from "./adapters/interface.js";
