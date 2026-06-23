import {
  TELEGRAM_MAX_DOWNLOAD_BYTES,
  TelegramUpdateSchema,
  type ParsedAttachment,
  type ParsedTelegramMessage,
  type TelegramUpdate,
} from "./types.js";

export function parseTelegramUpdate(input: unknown): TelegramUpdate {
  return TelegramUpdateSchema.parse(input);
}

export function extractIncomingMessage(update: TelegramUpdate): ParsedTelegramMessage | null {
  const message = update.message ?? update.edited_message;
  if (!message) return null;

  const attachments: ParsedAttachment[] = [];

  if (message.photo?.length) {
    const photo = [...message.photo].sort(
      (a, b) => (b.file_size ?? 0) - (a.file_size ?? 0),
    )[0];
    attachments.push({
      kind: "photo",
      fileId: photo.file_id,
      fileUniqueId: photo.file_unique_id,
      fileName: `telegram-photo-${message.message_id}.jpg`,
      mimeType: "image/jpeg",
      sizeBytes: photo.file_size,
      width: photo.width,
      height: photo.height,
    });
  }

  if (message.document) {
    attachments.push({
      kind: "document",
      fileId: message.document.file_id,
      fileUniqueId: message.document.file_unique_id,
      fileName: message.document.file_name,
      mimeType: message.document.mime_type,
      sizeBytes: message.document.file_size,
    });
  }

  return {
    updateId: update.update_id,
    messageId: message.message_id,
    messageThreadId: message.message_thread_id,
    chat: message.chat,
    from: message.from,
    sentAt: new Date(message.date * 1000),
    text: message.text,
    caption: message.caption,
    mediaGroupId: message.media_group_id,
    attachments,
  };
}

export function parseStartToken(text?: string) {
  const match = text?.trim().match(/^\/start(?:@\w+)?\s+([A-Za-z0-9_-]{16,})$/);
  return match?.[1] ?? null;
}

export function parseGroupLinkToken(text?: string, command = "/link_group") {
  const escaped = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escaped}(?:@\\w+)?\\s+([A-Za-z0-9_-]{16,})$`);
  const match = text?.trim().match(regex);
  return match?.[1] ?? null;
}

export function parseCallbackData(data?: string | null, prefix = "telegram-connect") {
  const match = data?.match(new RegExp(`^${prefix}:(.+)$`));
  if (!match?.[1]) return null;
  return match[1];
}

export function isOversizedAttachment(sizeBytes?: number | null) {
  return typeof sizeBytes === "number" && sizeBytes > TELEGRAM_MAX_DOWNLOAD_BYTES;
}

export function isSupportedMimeType(mimeType?: string | null) {
  if (!mimeType) return true;
  return (
    mimeType.startsWith("image/") ||
    mimeType === "application/pdf" ||
    mimeType === "text/plain" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  );
}

export function telegramSenderName(from?: ParsedTelegramMessage["from"]) {
  const name = [from?.first_name, from?.last_name].filter(Boolean).join(" ").trim();
  return name || from?.username || "Telegram user";
}

export function telegramAccountSenderName(account: {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}) {
  const configuredName = account.displayName?.trim();
  if (configuredName) return configuredName;
  return (
    [account.firstName, account.lastName].filter(Boolean).join(" ").trim() ||
    account.username ||
    null
  );
}
