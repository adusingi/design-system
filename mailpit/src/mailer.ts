// SMTP transport pointed at Mailpit (https://mailpit.axllent.org). Mailpit
// accepts mail on SMTP :1025 and exposes a web UI + REST API on :8025. This is
// a *development/test* transport — in production swap in a real provider (e.g.
// @mobayilo/auth-magic-link's `createZeptoMailer`), which shares this same
// `sendMail` contract.
//
// nodemailer is a Node-only optional peer dependency and is imported lazily
// inside sendMail, so importing this module never pulls nodemailer into a
// client/edge bundle and the read-only client half needs no nodemailer at all.

import type { Transporter } from "nodemailer";
import type { Mailer, MailResult, SendMailArgs } from "./types.js";

export type MailpitMailerConfig = {
  /** SMTP host Mailpit listens on. Default: "localhost". */
  host?: string;
  /** SMTP port. Default: 1025 (Mailpit's default). */
  port?: number;
  /** Optional SMTP auth username (Mailpit allows anonymous by default). */
  user?: string;
  /** Optional SMTP auth password. */
  pass?: string;
  /** Use TLS on connect. Default: false (Mailpit is plain SMTP locally). */
  secure?: boolean;
  /**
   * Sender. Either a bare address ("no-reply@localhost") or a full mailbox
   * string ("MyApp <no-reply@localhost>"). If `fromName` is also set, it is
   * combined with a bare address.
   */
  fromAddress: string;
  /** Sender display name. Default: "Mobayilo". */
  fromName?: string;
  /** Optional reply-to address. */
  replyTo?: string;
};

function resolveFrom(fromAddress: string, fromName?: string): string | { name: string; address: string } {
  const address = (fromAddress ?? "").trim();
  const name = (fromName ?? "").trim();
  // If the address already looks like "Name <addr>", pass it through verbatim.
  if (!name || /<.+>/.test(address)) return address;
  return { name, address };
}

export function createMailpitMailer(config: MailpitMailerConfig): Mailer {
  const host = (config.host ?? "localhost").trim();
  const port = config.port ?? 1025;
  const secure = config.secure ?? false;
  const fromAddress = (config.fromAddress ?? "").trim();
  const fromName = config.fromName ?? "Mobayilo";
  const replyTo = (config.replyTo ?? "").trim();

  // Build the transport on first send and reuse it thereafter.
  let transportPromise: Promise<Transporter> | null = null;
  async function getTransport(): Promise<Transporter> {
    if (!transportPromise) {
      transportPromise = import("nodemailer").then((mod) => {
        // nodemailer ships as CommonJS; depending on interop the factory is on
        // the namespace or under `default`.
        const createTransport = mod.createTransport ?? mod.default.createTransport;
        return createTransport({
          host,
          port,
          secure,
          // Mailpit accepts anonymous SMTP; only attach auth when provided.
          auth: config.user ? { user: config.user, pass: config.pass ?? "" } : undefined,
          // Local Mailpit uses a self-signed cert when TLS is on.
          tls: { rejectUnauthorized: false },
        });
      });
    }
    return transportPromise;
  }

  async function sendMail(args: SendMailArgs): Promise<MailResult> {
    if (!fromAddress) {
      return { sent: false, reason: "not_configured", message: "Mailpit fromAddress is not configured" };
    }
    try {
      const transport = await getTransport();
      const info = await transport.sendMail({
        from: resolveFrom(fromAddress, fromName),
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
        replyTo: replyTo || undefined,
      });
      return { sent: true, id: info.messageId ?? null };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { sent: false, reason: "provider_error", message };
    }
  }

  return { sendMail };
}
