import type { TelegramInlineKeyboardMarkup } from "./types.js";

export interface TelegramClientOptions {
  botToken: string;
  /** When true, API calls are logged to the console and return empty results. */
  dryRun?: boolean;
}

export interface TelegramFileResponse {
  ok: boolean;
  result?: {
    file_id: string;
    file_unique_id?: string;
    file_size?: number;
    file_path?: string;
  };
  description?: string;
}

export interface TelegramMessageResponse {
  ok: boolean;
  result?: {
    message_id: number;
  };
  description?: string;
}

export type TelegramFile = NonNullable<TelegramFileResponse["result"]> & {
  file_path: string;
};

export function createTelegramClient(options: TelegramClientOptions) {
  const { botToken, dryRun = false } = options;
  const baseUrl = `https://api.telegram.org/bot${botToken}`;
  const fileBaseUrl = `https://api.telegram.org/file/bot${botToken}`;

  async function callTelegram<T>(method: string, body: Record<string, unknown>): Promise<T> {
    if (dryRun) {
      console.log("[telegram-connect dry-run]", method, body);
      return {} as T;
    }

    const response = await fetch(`${baseUrl}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Telegram ${method} failed: ${response.status}`);
    }

    const payload = (await response.json()) as { ok: boolean; description?: string };
    if (!payload.ok) {
      throw new Error(`Telegram ${method} failed: ${payload.description}`);
    }

    return payload as T;
  }

  return {
    async sendMessage(
      chatId: number,
      text: string,
      options: { messageThreadId?: number; replyMarkup?: TelegramInlineKeyboardMarkup } = {},
    ) {
      const body: Record<string, unknown> = {
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      };

      if (options.messageThreadId) {
        body.message_thread_id = options.messageThreadId;
      }

      if (options.replyMarkup) {
        body.reply_markup = options.replyMarkup;
      }

      return callTelegram<TelegramMessageResponse>("sendMessage", body);
    },

    async sendPhoto(chatId: number, photo: string, options: { messageThreadId?: number } = {}) {
      const body: Record<string, unknown> = {
        chat_id: chatId,
        photo,
      };

      if (options.messageThreadId) {
        body.message_thread_id = options.messageThreadId;
      }

      return callTelegram("sendPhoto", body);
    },

    async answerCallbackQuery(
      callbackQueryId: string,
      options: { text?: string; showAlert?: boolean } = {},
    ) {
      return callTelegram("answerCallbackQuery", {
        callback_query_id: callbackQueryId,
        text: options.text,
        show_alert: options.showAlert ?? false,
      });
    },

    async clearMessageReplyMarkup(chatId: number, messageId: number) {
      return callTelegram("editMessageReplyMarkup", {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: [] },
      });
    },

    async deleteMessage(chatId: number, messageId: number) {
      return callTelegram("deleteMessage", {
        chat_id: chatId,
        message_id: messageId,
      });
    },

    async getFile(fileId: string): Promise<TelegramFile> {
      const response = await callTelegram<TelegramFileResponse>("getFile", {
        file_id: fileId,
      });

      const file = response.result;
      if (!file?.file_path) {
        throw new Error("Telegram getFile did not return a file path.");
      }

      return { ...file, file_path: file.file_path };
    },

    async downloadFile(filePath: string): Promise<Buffer> {
      if (dryRun) {
        return Buffer.from("development telegram file");
      }

      const response = await fetch(`${fileBaseUrl}/${filePath}`);
      if (!response.ok) {
        throw new Error(`Telegram file download failed: ${response.status}`);
      }

      return Buffer.from(await response.arrayBuffer());
    },
  };
}

export type TelegramClient = ReturnType<typeof createTelegramClient>;
