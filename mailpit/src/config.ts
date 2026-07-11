// Env → config helpers, so apps can wire Mailpit with one call and a `.env`.
// Variable names are documented in this package's .env.example.

import type { MailpitMailerConfig } from "./mailer.js";
import type { MailpitClientConfig } from "./client.js";

type Env = Record<string, string | undefined>;

const getEnv = (env?: Env): Env =>
  env ?? (typeof process !== "undefined" ? process.env : {});

/**
 * Whether email should be delivered to Mailpit rather than a real provider.
 * Read from `MAILPIT_ENABLED`. **Defaults to `true`** (use Mailpit) when the
 * variable is unset, so no email accidentally goes out via a real provider in
 * an unconfigured environment — explicitly set `MAILPIT_ENABLED=false` to send
 * for real. Recognised falsey values: "false", "0", "no", "off".
 */
export function mailpitEnabledFromEnv(env?: Env): boolean {
  const raw = getEnv(env).MAILPIT_ENABLED;
  if (raw === undefined || raw.trim() === "") return true;
  return !["false", "0", "no", "off"].includes(raw.trim().toLowerCase());
}

/** Build the SMTP transport config from environment variables. */
export function mailpitMailerConfigFromEnv(env?: Env): MailpitMailerConfig {
  const e = getEnv(env);
  return {
    host: e.MAILPIT_SMTP_HOST ?? "localhost",
    port: e.MAILPIT_SMTP_PORT ? Number(e.MAILPIT_SMTP_PORT) : 1025,
    user: e.MAILPIT_SMTP_USER || undefined,
    pass: e.MAILPIT_SMTP_PASS || undefined,
    secure: e.MAILPIT_SMTP_SECURE === "true",
    // Fall back to the conventional EMAIL_FROM so apps don't need a new var.
    fromAddress: e.MAILPIT_FROM_ADDRESS ?? e.EMAIL_FROM ?? "no-reply@localhost",
    fromName: e.MAILPIT_FROM_NAME,
    replyTo: e.MAILPIT_REPLY_TO || undefined,
  };
}

/** Build the REST-API client config from environment variables. */
export function mailpitClientConfigFromEnv(env?: Env): MailpitClientConfig {
  const e = getEnv(env);
  const user = e.MAILPIT_UI_USER;
  const pass = e.MAILPIT_UI_PASS;
  return {
    apiUrl: e.MAILPIT_API_URL ?? "http://localhost:8025",
    auth: user ? { user, pass: pass ?? "" } : undefined,
  };
}
