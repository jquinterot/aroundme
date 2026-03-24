import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse('Authentication required to duplicate event', 401, 'UNAUTHORIZED');
  }

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    if (existingEvent.userId !== session.id) {
      return errorResponse('You can only duplicate your own events', 403, 'FORBIDDEN');
    }

    const newEvent = await prisma.event.create({
      data: {
        title: `Copy of ${existingEvent.title}`,
        description: existingEvent.description,
        category: existingEvent.category,
        status: 'pending',
        cityId: existingEvent.cityId,
        venueName: existingEvent.venueName,
        venueAddress: existingEvent.venueAddress,
        venueLat: existingEvent.venueLat,
        venueLng: existingEvent.venueLng,
        dateStart: existingEvent.dateStart,
        dateEnd: existingEvent.dateEnd,
        isFree: existingEvent.isFree,
        priceMin: existingEvent.priceMin,
        priceMax: existingEvent.priceMax,
        currency: existingEvent.currency,
        imageUrl: existingEvent.imageUrl,
        tags: existingEvent.tags,
        userId: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: newEvent.id },
    });
  } catch (error) {
    return handleApiError(error, 'POST duplicate event');
  }
}
