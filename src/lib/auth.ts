import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';
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
  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
  
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
    
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { 
        user: { 
          select: { id: true, email: true, name: true, role: true } 
        } 
      },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (token) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    await prisma.session.deleteMany({ where: { tokenHash } });
  }
  
  cookieStore.delete(SESSION_COOKIE);
}
