import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

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
    message.includes('unable to open static sorted file')
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
  const errorId = generateErrorId();
  const timestamp = new Date().toISOString();
  
  // Log detailed error information
  const errorDetails = {
    errorId,
    timestamp,
    context: context || 'Unknown',
    type: error instanceof Error ? error.constructor.name : typeof error,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...(error instanceof Error && 'code' in error ? { code: (error as Error & { code: string }).code } : {}),
  };

  console.error(`[${timestamp}] [ERROR ${errorId}] API Error${context ? ` in ${context}` : ''}:`, errorDetails);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        errorId,
        timestamp,
      },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    if (isDatabaseError(error)) {
      console.error(`[${timestamp}] [ERROR ${errorId}] Database error detected:`, {
        message: error.message,
        context,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Database error. Please try again later.',
          code: 'DATABASE_ERROR',
          errorId,
          timestamp,
        },
        { status: 500 }
      );
    }

    if (isPaymentError(error)) {
      console.error(`[${timestamp}] [ERROR ${errorId}] Payment error detected:`, {
        message: error.message,
        context,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Payment processing error. Please try again or contact support.',
          code: 'PAYMENT_ERROR',
          errorId,
          timestamp,
        },
        { status: 500 }
      );
    }

    if (isAuthError(error)) {
      console.error(`[${timestamp}] [ERROR ${errorId}] Authentication error detected:`, {
        message: error.message,
        context,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication error. Please log in again.',
          code: 'AUTH_ERROR',
          errorId,
          timestamp,
        },
        { status: 401 }
      );
    }

    // Log unexpected errors with full stack trace
    console.error(`[${timestamp}] [ERROR ${errorId}] Unexpected error:`, {
      message: error.message,
      stack: error.stack,
      context,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR',
        errorId,
        timestamp,
      },
      { status: 500 }
    );
  }

  // Handle non-Error objects
  console.error(`[${timestamp}] [ERROR ${errorId}] Non-Error object thrown:`, {
    value: error,
    type: typeof error,
    context,
  });

  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
      code: 'UNKNOWN_ERROR',
      errorId,
      timestamp,
    },
    { status: 500 }
  );
}

function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function errorResponse(message: string, status: number = 400, code?: string) {
  const errorId = generateErrorId();
  const timestamp = new Date().toISOString();
  return NextResponse.json(
    { success: false, error: message, code, errorId, timestamp },
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

/**
 * Require authenticated session - returns user or error response
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return { error: errorResponse('You must be logged in to perform this action', 401, 'UNAUTHORIZED') };
  }
  return { user: session };
}

/**
 * Parse pagination parameters from URL search params
 */
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Format paginated response
 */
export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
