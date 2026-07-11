// @mobayilo/mailpit — framework-agnostic Mailpit integration.
//
//   • createMailpitMailer  — SMTP transport for dev/test (drop-in for
//     @mobayilo/auth-magic-link's createZeptoMailer: same sendMail contract).
//   • createMailpitClient  — read the Mailpit inbox over its REST API
//     (list/search/wait/extract links) for E2E tests.
//   • *FromEnv helpers      — wire both from environment variables.

export { createMailpitMailer, type MailpitMailerConfig } from "./mailer.js";

export {
  createMailpitClient,
  extractLinks,
  type MailpitClient,
  type MailpitClientConfig,
  type MailpitMessage,
  type MailpitMessageSummary,
  type MailpitAddress,
  type WaitForMessageOptions,
} from "./client.js";

export {
  mailpitEnabledFromEnv,
  mailpitMailerConfigFromEnv,
  mailpitClientConfigFromEnv,
} from "./config.js";

export type { Mailer, MailResult, SendMailArgs } from "./types.js";
