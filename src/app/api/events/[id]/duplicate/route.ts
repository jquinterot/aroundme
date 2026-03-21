import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    if (existingEvent.userId !== session.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
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
    console.error('Error duplicating event:', error);
    return NextResponse.json({ success: false, error: 'Failed to duplicate event' }, { status: 500 });
  }
}
