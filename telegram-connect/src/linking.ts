import type { StorageAdapter } from "./adapters/interface.js";
import {
  DEFAULT_TOKEN_TTL_MINUTES,
  hashToken,
  makeToken,
  tokenExpiresAt,
} from "./tokens.js";

export interface CreateLinkTokenOptions {
  ttlMinutes?: number;
}

export async function createAccountLinkToken(
  adapter: StorageAdapter,
  workspaceId: string,
  userId: string,
  options: CreateLinkTokenOptions = {},
) {
  const token = makeToken();
  const expiresAt = tokenExpiresAt(options.ttlMinutes ?? DEFAULT_TOKEN_TTL_MINUTES);

  await adapter.createAccountLinkToken({
    workspaceId,
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  return { token, expiresAt };
}

export async function createGroupLinkToken(
  adapter: StorageAdapter,
  workspaceId: string,
  options: CreateLinkTokenOptions = {},
) {
  const token = makeToken();
  const expiresAt = tokenExpiresAt(options.ttlMinutes ?? DEFAULT_TOKEN_TTL_MINUTES);

  await adapter.createGroupLinkToken({
    workspaceId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  return { token, expiresAt };
}
