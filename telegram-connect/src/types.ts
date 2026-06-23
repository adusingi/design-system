import { z } from "zod";

export const TELEGRAM_MAX_DOWNLOAD_BYTES = 20 * 1024 * 1024;

export const TelegramUserSchema = z.object({
  id: z.number(),
  is_bot: z.boolean().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
});

export const TelegramChatSchema = z.object({
  id: z.number(),
  type: z.enum(["private", "group", "supergroup", "channel"]),
  title: z.string().optional(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export const TelegramPhotoSizeSchema = z.object({
  file_id: z.string(),
  file_unique_id: z.string().optional(),
  width: z.number(),
  height: z.number(),
  file_size: z.number().optional(),
});

export const TelegramDocumentSchema = z.object({
  file_id: z.string(),
  file_unique_id: z.string().optional(),
  file_name: z.string().optional(),
  mime_type: z.string().optional(),
  file_size: z.number().optional(),
});

export const TelegramMessageSchema = z.object({
  message_id: z.number(),
  message_thread_id: z.number().optional(),
  from: TelegramUserSchema.optional(),
  chat: TelegramChatSchema,
  date: z.number(),
  text: z.string().optional(),
  caption: z.string().optional(),
  media_group_id: z.string().optional(),
  photo: z.array(TelegramPhotoSizeSchema).optional(),
  document: TelegramDocumentSchema.optional(),
});

export const TelegramCallbackQuerySchema = z.object({
  id: z.string(),
  from: TelegramUserSchema,
  message: TelegramMessageSchema.optional(),
  data: z.string().optional(),
});

export const TelegramUpdateSchema = z.object({
  update_id: z.number(),
  message: TelegramMessageSchema.optional(),
  edited_message: TelegramMessageSchema.optional(),
  callback_query: TelegramCallbackQuerySchema.optional(),
});

export type TelegramUpdate = z.infer<typeof TelegramUpdateSchema>;
export type TelegramMessage = z.infer<typeof TelegramMessageSchema>;
export type TelegramChat = z.infer<typeof TelegramChatSchema>;
export type TelegramUser = z.infer<typeof TelegramUserSchema>;
export type TelegramCallbackQuery = z.infer<typeof TelegramCallbackQuerySchema>;
export type TelegramPhotoSize = z.infer<typeof TelegramPhotoSizeSchema>;
export type TelegramDocument = z.infer<typeof TelegramDocumentSchema>;

export type ParsedAttachment = {
  kind: "photo" | "document";
  fileId: string;
  fileUniqueId?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
};

export type ParsedTelegramMessage = {
  updateId: number;
  messageId: number;
  messageThreadId?: number;
  chat: TelegramMessage["chat"];
  from?: TelegramMessage["from"];
  sentAt: Date;
  text?: string;
  caption?: string;
  mediaGroupId?: string;
  attachments: ParsedAttachment[];
};

export type TelegramInlineKeyboardMarkup = {
  inline_keyboard: Array<
    Array<{
      text: string;
      callback_data: string;
    }>
  >;
};
