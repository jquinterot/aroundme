import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function isDatabaseError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('prisma') ||
    message.includes('database') ||
    message.includes('sqlite') ||
    message.includes('better-sqlite3') ||
    message.includes('node_module_version') ||
    message.includes('native module') ||
    message.includes('cannot find module') ||
    message.includes('failed to parse')
  );
}

function isPaymentError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return message.includes('stripe');
}

function isAuthError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('unauthorized') ||
    message.includes('jwt') ||
    message.includes('token') ||
    message.includes('bcrypt')
  );
}

export function handleApiError(error: unknown, context?: string): NextResponse {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    if (isDatabaseError(error)) {
      const userMessage = error.message.includes('NODE_MODULE_VERSION')
        ? 'Server configuration issue. Please try again in a few minutes.'
        : 'Database error. Please try again later.';
      return NextResponse.json(
        {
          success: false,
          error: userMessage,
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    if (isPaymentError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment processing error. Please try again or contact support.',
          code: 'PAYMENT_ERROR',
        },
        { status: 500 }
      );
    }

    if (isAuthError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication error. Please log in again.',
          code: 'AUTH_ERROR',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}

export function errorResponse(message: string, status: number = 400, code?: string) {
  return NextResponse.json(
    { success: false, error: message, code },
    { status }
  );
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message }),
  });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
