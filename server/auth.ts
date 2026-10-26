import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Database } from 'bun:sqlite';

const PASSWORD_HASH_PREFIX = 'scrypt-v1';
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_BYTES = 64;

export function isAdminPasswordHash(value: unknown): value is string {
  return typeof value === 'string' && /^scrypt-v1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(value);
}

export function hashAdminPassword(password: string): string {
  if (!password) throw new Error('Administrator password must not be empty.');
  const salt = randomBytes(PASSWORD_SALT_BYTES).toString('hex');
  const derivedKey = scryptSync(password, salt, PASSWORD_KEY_BYTES).toString('hex');
  return PASSWORD_HASH_PREFIX + '$' + salt + '$' + derivedKey;
}

export function verifyAdminPassword(password: string, storedHash: unknown): boolean {
  if (!isAdminPasswordHash(storedHash)) return false;

  const [, salt, expectedHex] = storedHash.split('$');
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = scryptSync(password, salt, PASSWORD_KEY_BYTES);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createAdminSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashAdminSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export type AdminSession = {
  tokenHash: string;
  expiresAt: number;
  user: { username: string; role: string; name: string };
};

export function findAdminSession(
  database: Database,
  token: string,
  nowSeconds = Math.floor(Date.now() / 1000)
): AdminSession | null {
  const tokenHash = hashAdminSessionToken(token);
  const session = database
    .query(
      'SELECT s.token_hash, s.expires_at, u.username, u.role, u.name ' +
        'FROM admin_sessions AS s JOIN admin_users AS u ON u.id = s.admin_user_id ' +
        'WHERE s.token_hash = ? AND s.expires_at > ?'
    )
    .get(tokenHash, nowSeconds) as
    | { token_hash: string; expires_at: number; username: string; role: string; name: string }
    | null;

  if (!session) return null;
  return {
    tokenHash: session.token_hash,
    expiresAt: session.expires_at,
    user: { username: session.username, role: session.role, name: session.name },
  };
}
