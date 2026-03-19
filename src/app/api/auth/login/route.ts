import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, verifyPassword, verifySimpleHash } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

const AUTH_RATE_LIMIT = rateLimit({ maxRequests: 5, windowMs: 60000 });

export async function POST(request: NextRequest) {
  const rateLimitResult = await AUTH_RATE_LIMIT(request);
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    let isValidPassword = false;
    
    if (user.password.length === 64 && user.password.match(/^[a-f0-9]+$/)) {
      isValidPassword = verifySimpleHash(password, user.password);
    } else {
      isValidPassword = await verifyPassword(password, user.password);
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
