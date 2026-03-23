import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getRecommendations, recordRecommendationInteraction } from '@/lib/recommendations';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    
    const userId = session?.id;
    const citySlug = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Inicia sesión para ver recomendaciones personalizadas' },
        { status: 401 }
      );
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId, action } = await request.json();

    if (!eventId || !action) {
      return NextResponse.json(
        { success: false, error: 'eventId and action required' },
        { status: 400 }
      );
    }

    await recordRecommendationInteraction(session.id, eventId, action);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
