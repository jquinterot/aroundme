import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, hashPassword } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
import { handleApiError, errorResponse } from '@/lib/api-utils';

const AUTH_RATE_LIMIT = rateLimit({ maxRequests: 3, windowMs: 60000 });

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z)';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z)';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number (0-9)';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
  }
  return null;
}

export async function POST(request: NextRequest) {
  const rateLimitResult = await AUTH_RATE_LIMIT(request);
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return errorResponse('Please fill in all fields: name, email, and password.', 400, 'MISSING_FIELDS');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('Please enter a valid email address.', 400, 'INVALID_EMAIL');
    }

    if (name.length < 2 || name.length > 100) {
      return errorResponse('Name must be between 2 and 100 characters.', 400, 'INVALID_NAME');
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return errorResponse(passwordError, 400, 'WEAK_PASSWORD');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse('An account with this email already exists. Try logging in or use a different email.', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: passwordHash,
        name: name.trim(),
        role: 'user',
      },
    });

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Account created successfully! Welcome to AroundMe.',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/auth/register');
  }
}
