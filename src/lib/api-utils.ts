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
    if (error.message.includes('Prisma') || error.message.includes('Database')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database error. Please try again later.',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }
    
    if (error.message.includes('Stripe') || error.message.includes('stripe')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment processing error. Please try again or contact support.',
          code: 'PAYMENT_ERROR',
        },
        { status: 500 }
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
