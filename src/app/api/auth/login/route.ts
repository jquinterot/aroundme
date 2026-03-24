import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
import { handleApiError, errorResponse } from '@/lib/api-utils';

const AUTH_RATE_LIMIT = rateLimit({ maxRequests: 5, windowMs: 60000 });

export async function POST(request: NextRequest) {
  const rateLimitResult = await AUTH_RATE_LIMIT(request);
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse('Please enter both email and password.', 400, 'MISSING_CREDENTIALS');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('Please enter a valid email address.', 400, 'INVALID_EMAIL');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return errorResponse('No account found with this email. Please check your email or sign up.', 401, 'USER_NOT_FOUND');
    }

    const bcrypt = await import('bcrypt');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return errorResponse('Incorrect password. Please try again or reset your password.', 401, 'INVALID_PASSWORD');
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
      message: 'Welcome back!',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/auth/login');
  }
}
