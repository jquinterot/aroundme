import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, isVerified: true } } },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      status: event.status,
      cityId: event.cityId,
      venue: {
        name: event.venueName,
        address: event.venueAddress,
        coordinates: { lat: event.venueLat, lng: event.venueLng },
      },
      date: {
        start: event.dateStart.toISOString(),
        end: event.dateEnd?.toISOString() || null,
      },
      price: event.isFree
        ? { min: 0, max: 0, currency: event.currency, isFree: true }
        : { min: event.priceMin || 0, max: event.priceMax || 0, currency: event.currency, isFree: false },
      image: event.imageUrl,
      organizer: {
        id: event.user?.id || '',
        name: event.user?.name || 'Organizer',
        isVerified: event.user?.isVerified || false,
      },
      tags: event.tags.split(',').filter(Boolean),
      isFeatured: event.isFeatured,
      featuredUntil: event.featuredUntil?.toISOString() || null,
      featuredTier: event.featuredTier,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: formattedEvent });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch event' }, { status: 500 });
  }
}
