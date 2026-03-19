import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { prisma } from './prisma';

const SESSION_COOKIE = 'aroundme_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function createSession(userId: string): Promise<string> {
  const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
  
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

    const [userId] = Buffer.from(token, 'base64').toString('utf-8').split(':');
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

export function simpleHash(password: string): string {
  return createHash('sha256').update(password + 'aroundme_salt').digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}
