// Shared mail types. The result shape mirrors @mobayilo/auth-magic-link's
// `MailResult` on purpose, so a Mailpit transport is a drop-in dev replacement
// for the ZeptoMail transport (same `sendMail` contract).

export type MailResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: "not_configured" | "provider_error"; message: string };

export type SendMailArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type Mailer = {
  sendMail: (args: SendMailArgs) => Promise<MailResult>;
};
