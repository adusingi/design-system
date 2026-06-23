import { headers } from "next/headers";
import type { MagicLinkAuth } from "./auth.js";

// Request-scoped session accessors for Next.js server components and route
// handlers. Build once: `export const { getViewer, getViewerId } =
// createSessionHelpers(auth);`
export function createSessionHelpers(auth: MagicLinkAuth) {
  async function getViewer() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
  }
  async function getViewerId(): Promise<string | null> {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id ?? null;
  }
  return { getViewer, getViewerId };
}
