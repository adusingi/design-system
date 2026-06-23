import { betterAuth, type BetterAuthOptions, type BetterAuthPlugin } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export type MagicLinkSender = (data: {
  email: string;
  url: string;
  token: string;
}) => Promise<void> | void;

export type MagicLinkAuthOptions<TPlugins extends BetterAuthPlugin[] = []> = {
  /** Product name (Better Auth `appName`). */
  appName: string;
  /** App base URL, e.g. https://example.com. */
  baseURL: string;
  /** Better Auth secret (defaults to env BETTER_AUTH_SECRET if omitted). */
  secret?: string;
  /** Better Auth database config — pass your drizzleAdapter(db, {...}) here. */
  database: BetterAuthOptions["database"];
  /** Send the magic-link email (wire to createZeptoMailer + renderMagicLinkEmail). */
  sendMagicLink: MagicLinkSender;
  /** Magic-link lifetime in seconds. Default: 600 (10 min). */
  magicLinkExpiresIn?: number;
  /** Optional Google OAuth — omit to offer magic link only. */
  google?: { clientId: string; clientSecret: string };
  /** Defaults to [baseURL]. */
  trustedOrigins?: string[];
  /** Extra profile fields on the user model. */
  user?: BetterAuthOptions["user"];
  /** Lifecycle hooks (e.g. assign a username on create). */
  databaseHooks?: BetterAuthOptions["databaseHooks"];
  /** Additional Better Auth plugins, inserted before nextCookies. */
  plugins?: TPlugins;
};

// Passwordless auth (magic link + optional Google) with sensible mobayilo
// defaults. Returns a fully-typed Better Auth instance; use `typeof auth` to
// type the matching client. The plugin list is kept as a literal tuple
// [magicLink, ...extra, nextCookies] so Better Auth infers endpoints
// (e.g. auth.api.signInMagicLink) onto the returned type.
export function createMagicLinkAuth<const TPlugins extends BetterAuthPlugin[] = []>(
  options: MagicLinkAuthOptions<TPlugins>,
) {
  return betterAuth({
    appName: options.appName,
    baseURL: options.baseURL,
    secret: options.secret,
    trustedOrigins: options.trustedOrigins ?? [options.baseURL],
    database: options.database,
    // Passwordless only.
    emailAndPassword: { enabled: false },
    socialProviders: options.google ? { google: options.google } : undefined,
    user: options.user,
    databaseHooks: options.databaseHooks,
    plugins: [
      magicLink({
        expiresIn: options.magicLinkExpiresIn ?? 60 * 10,
        sendMagicLink: async ({ email, url, token }) => {
          await options.sendMagicLink({ email, url, token });
        },
      }),
      ...(options.plugins ?? ([] as unknown as TPlugins)),
      nextCookies(),
    ],
  });
}

export type MagicLinkAuth = ReturnType<typeof createMagicLinkAuth>;

// Derive a unique-ish handle from an email local part, with a short random
// suffix for collision-resistance. Useful in a `databaseHooks.user.create`
// hook to auto-assign usernames.
export function deriveUsername(
  email: string,
  options: { fallback?: string; maxLength?: number; suffix?: () => string } = {},
): string {
  const fallback = options.fallback ?? "user";
  const maxLength = options.maxLength ?? 20;
  const base =
    (email.split("@")[0] ?? fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, maxLength) || fallback;
  const suffix = options.suffix ? options.suffix() : Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}
