import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getActivityFeed } from '@/lib/social';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    
    const sessionUserId = session?.id;
    const filterUserId = searchParams.get('userId');
    const followingOnly = searchParams.get('following') === 'true';
    const citySlug = searchParams.get('city');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (followingOnly && !sessionUserId) {
      return errorResponse('Please log in to see activity from people you follow', 401, 'AUTH_REQUIRED');
    }

    const data = await getActivityFeed(
      filterUserId || sessionUserId || undefined,
      followingOnly,
      citySlug || undefined,
      page,
      limit
    );

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/activity');
  }
}
