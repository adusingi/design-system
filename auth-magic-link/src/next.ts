import { headers } from "next/headers";

// Minimal shape we need from a Better Auth instance. Generic over the consumer's
// own auth type so the session/user types are inferred from *their* better-auth
// resolution — avoids cross-package type duplication ("two different types with
// this name exist") under pnpm's isolated installs.
type SessionAuthLike = {
  api: { getSession: (input: { headers: Headers }) => Promise<unknown> };
};

// Request-scoped session accessors for Next.js server components and route
// handlers. Build once: `export const { getViewer, getViewerId } =
// createSessionHelpers(auth);`
export function createSessionHelpers<TAuth extends SessionAuthLike>(auth: TAuth) {
  type Session = Awaited<ReturnType<TAuth["api"]["getSession"]>>;
  type User = Session extends { user: infer U } ? U : never;

  async function getViewer(): Promise<User | null> {
    const session = (await auth.api.getSession({ headers: await headers() })) as
      | { user?: User }
      | null;
    return session?.user ?? null;
  }

  async function getViewerId(): Promise<string | null> {
    const viewer = (await getViewer()) as { id?: string } | null;
    return viewer?.id ?? null;
  }

  return { getViewer, getViewerId };
}
