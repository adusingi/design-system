import { createTelegramClient } from "./client.js";
import {
  type TelegramConnectConfig,
  type TelegramConnectMessages,
  defaultMessages,
} from "./config.js";
import {
  extractIncomingMessage,
  parseGroupLinkToken,
  parseStartToken,
  telegramAccountSenderName,
} from "./parser.js";
import { parseTelegramUpdate } from "./parser.js";

export interface WebhookHandler {
  (request: Request): Promise<Response>;
}

export function createWebhookHandler(config: TelegramConnectConfig): WebhookHandler {
  const client = createTelegramClient({
    botToken: config.botToken,
    dryRun: false,
  });

  const messages: TelegramConnectMessages = {
    ...defaultMessages,
    ...config.messages,
  };

  return async function telegramWebhook(request: Request): Promise<Response> {
    const secret = request.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== config.webhookSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    let rawUpdate: unknown;
    try {
      rawUpdate = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const update = parseTelegramUpdate(rawUpdate);

    const isNew = await config.adapter.recordUpdate({
      updateId: update.update_id,
      rawUpdate,
    });

    if (!isNew) {
      return new Response(JSON.stringify({ ok: true, duplicate: true }), {
        headers: { "content-type": "application/json" },
      });
    }

    try {
      if (update.callback_query) {
        // Callback queries are application-specific. Consumers can add a separate handler.
        await config.adapter.markUpdateProcessed(update.update_id);
        return new Response(JSON.stringify({ ok: true, ignored: "callback_query" }), {
          headers: { "content-type": "application/json" },
        });
      }

      const message = update.message ?? update.edited_message;
      if (!message) {
        await config.adapter.markUpdateProcessed(update.update_id);
        return new Response(JSON.stringify({ ok: true, ignored: true }), {
          headers: { "content-type": "application/json" },
        });
      }

      const startToken = parseStartToken(message.text);
      if (message.chat.type === "private" && startToken) {
        const linked = await handleAccountLink(startToken, message);
        await config.adapter.markUpdateProcessed(update.update_id);
        return new Response(JSON.stringify({ ok: true, linked: Boolean(linked) }), {
          headers: { "content-type": "application/json" },
        });
      }

      const groupToken = parseGroupLinkToken(message.text);
      if (message.chat.type !== "private" && groupToken) {
        const linked = await handleGroupLink(groupToken, message);
        await config.adapter.markUpdateProcessed(update.update_id);
        return new Response(JSON.stringify({ ok: true, linked: Boolean(linked) }), {
          headers: { "content-type": "application/json" },
        });
      }

      const parsed = extractIncomingMessage(update);
      if (!parsed) {
        await config.adapter.markUpdateProcessed(update.update_id);
        return new Response(JSON.stringify({ ok: true, ignored: true }), {
          headers: { "content-type": "application/json" },
        });
      }

      const contextResult = await resolveMessageContext(parsed);
      if (!contextResult.ok) {
        return contextResult.response;
      }

      if (config.onMessage) {
        await config.onMessage({
          ...contextResult.context,
          parsed,
          update: { updateId: update.update_id, rawUpdate },
        });
      }

      await config.adapter.markUpdateProcessed(update.update_id);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      console.error("[telegram-connect] webhook error:", error);
      await config.adapter.markUpdateProcessed(update.update_id).catch(() => {});
      return new Response(
        JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown" }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      );
    }
  };

  async function handleAccountLink(token: string, message: import("./types.js").TelegramMessage) {
    if (!message.from) return null;

    const tokenRow = await config.adapter.consumeAccountLinkToken(token);
    if (!tokenRow) {
      await client.sendMessage(message.chat.id, messages.accountLinkInvalid, {
        messageThreadId: message.message_thread_id,
      });
      return null;
    }

    const account = await config.adapter.upsertAccount({
      workspaceId: tokenRow.workspaceId,
      userId: tokenRow.userId ?? "unknown",
      telegramUserId: message.from.id,
      username: message.from.username,
      firstName: message.from.first_name,
      lastName: message.from.last_name,
      status: "active",
    });

    await client.sendMessage(message.chat.id, messages.accountLinked, {
      messageThreadId: message.message_thread_id,
    });

    if (config.onAccountLinked) {
      await config.onAccountLinked(account);
    }

    return account;
  }

  async function handleGroupLink(token: string, message: import("./types.js").TelegramMessage) {
    const tokenRow = await config.adapter.consumeGroupLinkToken(token);
    if (!tokenRow) {
      await client.sendMessage(message.chat.id, messages.chatLinkInvalid, {
        messageThreadId: message.message_thread_id,
      });
      return null;
    }

    const chat = await config.adapter.upsertChat({
      workspaceId: tokenRow.workspaceId,
      chat: message.chat,
      status: "active",
    });

    await client.sendMessage(message.chat.id, messages.chatLinked, {
      messageThreadId: message.message_thread_id,
    });

    if (config.onChatLinked) {
      await config.onChatLinked(chat);
    }

    return chat;
  }

  type ResolveResult =
    | {
        ok: true;
        context: {
          workspaceId: string;
          accountId: string;
          chatId: string;
          senderName: string | null;
        };
      }
    | { ok: false; response: Response };

  async function resolveMessageContext(parsed: import("./types.js").ParsedTelegramMessage): Promise<ResolveResult> {
    if (parsed.chat.type === "private") {
      const account = await config.adapter.findAccount(parsed.from?.id ?? 0);
      if (!account) {
        await client.sendMessage(parsed.chat.id, messages.unlinkedAccount, {
          messageThreadId: parsed.messageThreadId,
        });
        return {
          ok: false,
          response: new Response(JSON.stringify({ ok: true, rejected: "unlinked_account" }), {
            headers: { "content-type": "application/json" },
          }),
        };
      }

      const chat = await config.adapter.upsertChat({
        workspaceId: account.workspaceId,
        chat: parsed.chat,
        status: "active",
      });

      return {
        ok: true,
        context: {
          workspaceId: account.workspaceId,
          accountId: account.id,
          chatId: chat.id,
          senderName: telegramAccountSenderName(account),
        },
      };
    }

    const chat = await config.adapter.findChat(parsed.chat.id);
    if (!chat) {
      await client.sendMessage(parsed.chat.id, messages.unlinkedChat, {
        messageThreadId: parsed.messageThreadId,
      });
      return {
        ok: false,
        response: new Response(JSON.stringify({ ok: true, rejected: "unlinked_chat" }), {
          headers: { "content-type": "application/json" },
        }),
      };
    }

    const account = await config.adapter.findAccount(parsed.from?.id ?? 0);
    if (!account || account.workspaceId !== chat.workspaceId) {
      await client.sendMessage(parsed.chat.id, messages.unlinkedSender, {
        messageThreadId: parsed.messageThreadId,
      });
      return {
        ok: false,
        response: new Response(JSON.stringify({ ok: true, rejected: "unlinked_sender" }), {
          headers: { "content-type": "application/json" },
        }),
      };
    }

    return {
      ok: true,
      context: {
        workspaceId: chat.workspaceId,
        accountId: account.id,
        chatId: chat.id,
        senderName: telegramAccountSenderName(account),
      },
    };
  }
}
