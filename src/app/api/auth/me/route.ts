import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return handleApiError(error, 'getSession');
  }
}
