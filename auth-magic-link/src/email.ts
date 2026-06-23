// ZeptoMail HTTP transport + magic-link email template. Framework-free — usable
// from a Next route, a worker, or a Telegram agent. Mirrors the transport in
// network-mobayilo / academy-mobayilo (Authorization: Zoho-enczapikey <token>).

export type MailResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: "not_configured" | "provider_error"; message: string };

export type ZeptoMailerConfig = {
  /** ZeptoMail Send Mail token (the "Zoho-enczapikey …" value; prefix optional). */
  token: string;
  /** Verified sender address. */
  fromAddress: string;
  /** Sender display name. Default: "Mobayilo". */
  fromName?: string;
  /** Optional reply-to address. */
  replyTo?: string;
  /** Override the API endpoint (region-specific). */
  apiUrl?: string;
};

export type SendMailArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export type ZeptoMailer = {
  sendMail: (args: SendMailArgs) => Promise<MailResult>;
};

export function createZeptoMailer(config: ZeptoMailerConfig): ZeptoMailer {
  const apiUrl = (config.apiUrl ?? "https://api.zeptomail.com/v1.1/email").trim();
  const token = (config.token ?? "").trim().replace(/^Zoho-enczapikey\s+/i, "").trim();
  const fromAddress = (config.fromAddress ?? "").trim();
  const fromName = (config.fromName ?? "Mobayilo").trim();
  const replyTo = (config.replyTo ?? "").trim();

  async function sendMail(args: SendMailArgs): Promise<MailResult> {
    if (!token) {
      return { sent: false, reason: "not_configured", message: "ZeptoMail token is not configured" };
    }
    if (!fromAddress) {
      return { sent: false, reason: "not_configured", message: "ZeptoMail fromAddress is not configured" };
    }

    const payload: Record<string, unknown> = {
      from: { address: fromAddress, name: fromName },
      to: [{ email_address: { address: args.to } }],
      subject: args.subject,
      htmlbody: args.html,
      textbody: args.text,
    };
    if (replyTo) payload.reply_to = [{ address: replyTo }];

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Zoho-enczapikey ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const rawBody = await response.text();
    let parsed: unknown = null;
    try {
      parsed = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      parsed = null;
    }

    if (!response.ok) {
      const message =
        typeof parsed === "object" &&
        parsed !== null &&
        "error" in parsed &&
        typeof (parsed as { error?: { message?: unknown } }).error?.message === "string"
          ? (parsed as { error: { message: string } }).error.message
          : rawBody.trim() || `ZeptoMail request failed with status ${response.status}`;
      return { sent: false, reason: "provider_error", message };
    }

    const id =
      typeof parsed === "object" &&
      parsed !== null &&
      "request_id" in parsed &&
      typeof (parsed as { request_id?: unknown }).request_id === "string"
        ? (parsed as { request_id: string }).request_id
        : null;
    return { sent: true, id };
  }

  return { sendMail };
}

export type MagicLinkEmailBrand = {
  /** Product name shown in the email, e.g. "MyTrip". */
  appName: string;
  /** Header background colour (hex). Default: "#0a0f1c". */
  headerBg?: string;
  /** Button/accent colour (hex). Default: "#059669". */
  accent?: string;
  /** Accent label colour above the title (hex). Default: same as accent. */
  accentLabel?: string;
};

// Render the magic-link sign-in email (html + text) for a given URL.
export function renderMagicLinkEmail(
  brand: MagicLinkEmailBrand,
  url: string,
): { subject: string; html: string; text: string } {
  const appName = brand.appName;
  const headerBg = brand.headerBg ?? "#0a0f1c";
  const accent = brand.accent ?? "#059669";
  const accentLabel = brand.accentLabel ?? brand.accent ?? "#34d399";
  const safeUrl = escapeHtml(url);

  const text = [
    `Sign in to ${appName}`,
    "",
    "Click the link below to sign in. It expires shortly and can be used once:",
    url,
    "",
    "If you didn't request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;">
      <div style="background:${headerBg};border-radius:12px 12px 0 0;padding:24px 28px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${accentLabel};">${escapeHtml(appName)}</p>
        <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">Sign in</h1>
      </div>
      <div style="background:#fff;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;padding:28px;">
        <p style="margin:0 0 20px;font-size:14px;color:#3f3f46;line-height:1.6;">
          Click below to sign in to ${escapeHtml(appName)}. This link expires shortly and works once.
        </p>
        <a href="${safeUrl}" style="display:inline-block;background:${accent};color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          Sign in to ${escapeHtml(appName)} &rarr;
        </a>
        <p style="margin:20px 0 0;font-size:12px;color:#a1a1aa;">
          If the button doesn't work, paste this URL:<br />${safeUrl}
        </p>
      </div>
    </div>`.trim();

  return { subject: `Your ${appName} sign-in link`, html, text };
}
