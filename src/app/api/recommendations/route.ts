import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getRecommendations, recordRecommendationInteraction } from '@/lib/recommendations';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    
    const userId = session?.id;
    const citySlug = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return errorResponse('Please log in to view personalized recommendations', 401, 'AUTH_REQUIRED');
    }

    const city = citySlug
      ? await prisma.city.findUnique({ where: { slug: citySlug } })
      : null;

    const recommendations = await getRecommendations({
      userId,
      cityId: city?.id,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/recommendations');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Unauthorized', 401, 'AUTH_REQUIRED');
    }

    const { eventId, action } = await request.json();

    if (!eventId) {
      return errorResponse('eventId es requerido', 400, 'MISSING_EVENT_ID');
    }
    if (!action) {
      return errorResponse('action es requerido', 400, 'MISSING_ACTION');
    }

    await recordRecommendationInteraction(session.id, eventId, action);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'POST /api/recommendations');
  }
}
