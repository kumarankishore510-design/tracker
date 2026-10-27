import { describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  createAdminSessionToken,
  hashAdminPassword,
  hashAdminSessionToken,
  findAdminSession,
  isAdminPasswordHash,
  verifyAdminPassword,
} from './auth';

describe('administrator authentication helpers', () => {
  test('passwords are salted, hashed, and verified without accepting legacy plaintext', () => {
    const password = 'test-only-password-for-auth-tests';
    const firstHash = hashAdminPassword(password);
    const secondHash = hashAdminPassword(password);

    expect(isAdminPasswordHash(firstHash)).toBe(true);
    expect(firstHash).not.toBe(password);
    expect(firstHash).not.toBe(secondHash);
    expect(verifyAdminPassword(password, firstHash)).toBe(true);
    expect(verifyAdminPassword('incorrect-password', firstHash)).toBe(false);
    expect(verifyAdminPassword(password, 'legacy plaintext')).toBe(false);
  });

  test('session tokens are random and stored only as one-way hashes', () => {
    const firstToken = createAdminSessionToken();
    const secondToken = createAdminSessionToken();

    expect(firstToken).toHaveLength(43);
    expect(firstToken).not.toBe(secondToken);
    expect(hashAdminSessionToken(firstToken)).toHaveLength(64);
    expect(hashAdminSessionToken(firstToken)).not.toBe(firstToken);
    expect(hashAdminSessionToken(firstToken)).toBe(hashAdminSessionToken(firstToken));
  });

  test('session lookup rejects missing, unknown, and expired sessions', () => {
    const database = new Database(':memory:');
    database.exec(
      'CREATE TABLE admin_users (id TEXT PRIMARY KEY, username TEXT, role TEXT, name TEXT);' +
        'CREATE TABLE admin_sessions (token_hash TEXT PRIMARY KEY, admin_user_id TEXT, created_at INTEGER, expires_at INTEGER);'
    );
    database.prepare('INSERT INTO admin_users VALUES (?, ?, ?, ?)').run('admin-1', 'admin', 'superadmin', 'Operator');

    const token = createAdminSessionToken();
    const now = 1_800_000_000;
    database.prepare('INSERT INTO admin_sessions VALUES (?, ?, ?, ?)').run(
      hashAdminSessionToken(token), 'admin-1', now, now + 3600
    );

    expect(findAdminSession(database, token, now)?.user.username).toBe('admin');
    expect(findAdminSession(database, 'unknown-token', now)).toBeNull();
    expect(findAdminSession(database, token, now + 3600)).toBeNull();
    database.close();
  });
});
