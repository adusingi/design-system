// Server-safe entry: auth factory + ZeptoMail email. No React, no next/headers.
// - SignInForm:    "@mobayilo/auth-magic-link/sign-in-form"
// - Next session:  "@mobayilo/auth-magic-link/next"
//
// The Better Auth *client* is intentionally not exported: its
// inferAdditionalFields plugin must see the concrete `typeof auth`, which a
// generic wrapper can't preserve. Write it inline (see README), e.g.:
//   export const authClient = createAuthClient({
//     plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
//   });

export {
  createMagicLinkAuth,
  deriveUsername,
  type MagicLinkAuth,
  type MagicLinkAuthOptions,
  type MagicLinkSender,
} from "./auth.js";

export {
  createZeptoMailer,
  renderMagicLinkEmail,
  escapeHtml,
  type ZeptoMailer,
  type ZeptoMailerConfig,
  type MailResult,
  type SendMailArgs,
  type MagicLinkEmailBrand,
} from "./email.js";
