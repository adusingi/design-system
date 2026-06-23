import { createHash, randomBytes } from "crypto";

export const DEFAULT_TOKEN_TTL_MINUTES = 30;

export function makeToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function tokenExpiresAt(ttlMinutes = DEFAULT_TOKEN_TTL_MINUTES): Date {
  return new Date(Date.now() + 1000 * 60 * ttlMinutes);
}
