import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';
import { compare, hash } from 'bcrypt';
import { prisma } from './prisma';

const SESSION_COOKIE = 'aroundme_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const SALT_ROUNDS = 12;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function createSession(_userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (!token) return null;

    const tokenHash = createHash('sha256').update(token).digest('hex');
    
    const user = await prisma.user.findFirst({
      where: { password: tokenHash },
      select: { id: true, email: true, name: true, role: true },
    });

    return user;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await compare(password, hashedPassword);
  } catch {
    return false;
  }
}

export function simpleHash(password: string): string {
  return createHash('sha256').update(password + 'aroundme_salt').digest('hex');
}

export function verifySimpleHash(password: string, hash: string): boolean {
  const hashed = simpleHash(password);
  return hashed === hash;
}
