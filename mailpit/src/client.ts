// Read-side client for Mailpit's REST API (default http://localhost:8025).
// Useful in E2E/integration tests: send a mail through the SMTP transport, then
// poll the inbox here to assert on it or extract a magic link. fetch-based, no
// extra dependencies (Node ≥ 20 has global fetch).
//
// API reference: https://mailpit.axllent.org/docs/api-v1/

export type MailpitClientConfig = {
  /** Base URL of the Mailpit web/API server. Default: "http://localhost:8025". */
  apiUrl?: string;
  /** Optional Basic-auth credentials if Mailpit's UI is protected. */
  auth?: { user: string; pass: string };
};

/** A message as summarised in the Mailpit message list. */
export type MailpitMessageSummary = {
  ID: string;
  MessageID: string;
  Subject: string;
  From: MailpitAddress | null;
  To: MailpitAddress[];
  Snippet: string;
  Created: string;
};

/** A fully-fetched message, including bodies. */
export type MailpitMessage = MailpitMessageSummary & {
  Text: string;
  HTML: string;
};

export type MailpitAddress = { Name: string; Address: string };

type MessagesResponse = { total: number; messages: MailpitMessageSummary[] };

export type WaitForMessageOptions = {
  /** Total time to keep polling, ms. Default: 10000. */
  timeoutMs?: number;
  /** Delay between polls, ms. Default: 250. */
  intervalMs?: number;
};

export type MailpitClient = {
  /** List the most recent messages (newest first). */
  messages: (limit?: number) => Promise<MailpitMessageSummary[]>;
  /** Mailpit search-query string (see Mailpit docs), newest first. */
  search: (query: string, limit?: number) => Promise<MailpitMessageSummary[]>;
  /** Newest message overall, or null if the inbox is empty. */
  latest: () => Promise<MailpitMessageSummary | null>;
  /** Fetch a single message (with Text/HTML bodies) by its Mailpit ID. */
  message: (id: string) => Promise<MailpitMessage>;
  /** Delete every message in the inbox. */
  deleteAll: () => Promise<void>;
  /**
   * Poll until a message matching `predicate` appears, then return it (fully
   * fetched). Rejects on timeout. Handy for waiting on a just-sent email.
   */
  waitForMessage: (
    predicate: (m: MailpitMessageSummary) => boolean,
    options?: WaitForMessageOptions,
  ) => Promise<MailpitMessage>;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Pull every http(s) URL out of an email's text or HTML body. */
export function extractLinks(body: string): string[] {
  const urls = new Set<string>();
  // href="..." first (HTML), then any bare http(s) URL (plain text).
  for (const m of body.matchAll(/href=["']([^"']+)["']/gi)) {
    if (/^https?:\/\//i.test(m[1])) urls.add(m[1]);
  }
  for (const m of body.matchAll(/https?:\/\/[^\s"'<>)]+/gi)) {
    urls.add(m[0]);
  }
  return [...urls];
}

export function createMailpitClient(config: MailpitClientConfig = {}): MailpitClient {
  const base = (config.apiUrl ?? "http://localhost:8025").replace(/\/+$/, "");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (config.auth) {
    const encoded = Buffer.from(`${config.auth.user}:${config.auth.pass}`).toString("base64");
    headers.Authorization = `Basic ${encoded}`;
  }

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...init?.headers } });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Mailpit ${init?.method ?? "GET"} ${path} failed (${response.status}): ${text.trim()}`);
    }
    // Some endpoints (e.g. DELETE) reply 200 with a plain "ok" body, not JSON.
    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (response.status === 204 || !isJson) return undefined as T;
    return (await response.json()) as T;
  }

  async function messages(limit = 50): Promise<MailpitMessageSummary[]> {
    const data = await request<MessagesResponse>(`/api/v1/messages?limit=${limit}`);
    return data.messages;
  }

  async function search(query: string, limit = 50): Promise<MailpitMessageSummary[]> {
    const data = await request<MessagesResponse>(
      `/api/v1/search?query=${encodeURIComponent(query)}&limit=${limit}`,
    );
    return data.messages;
  }

  async function latest(): Promise<MailpitMessageSummary | null> {
    const list = await messages(1);
    return list[0] ?? null;
  }

  async function message(id: string): Promise<MailpitMessage> {
    return request<MailpitMessage>(`/api/v1/message/${encodeURIComponent(id)}`);
  }

  async function deleteAll(): Promise<void> {
    await request<void>("/api/v1/messages", { method: "DELETE" });
  }

  async function waitForMessage(
    predicate: (m: MailpitMessageSummary) => boolean,
    options: WaitForMessageOptions = {},
  ): Promise<MailpitMessage> {
    const timeoutMs = options.timeoutMs ?? 10_000;
    const intervalMs = options.intervalMs ?? 250;
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const match = (await messages()).find(predicate);
      if (match) return message(match.ID);
      if (Date.now() >= deadline) {
        throw new Error(`Mailpit waitForMessage timed out after ${timeoutMs}ms`);
      }
      await sleep(intervalMs);
    }
  }

  return { messages, search, latest, message, deleteAll, waitForMessage };
}
