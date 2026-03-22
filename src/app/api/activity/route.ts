import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getActivityFeed } from '@/lib/social';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    
    const userId = session?.id;
    const followingOnly = searchParams.get('following') === 'true';
    const citySlug = searchParams.get('city');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (followingOnly && !userId) {
      return NextResponse.json(
        { success: false, error: 'Inicia sesión para ver actividad de personas que sigues' },
        { status: 401 }
      );
    }

    const data = await getActivityFeed(userId || undefined, followingOnly, citySlug || undefined, page, limit);

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
