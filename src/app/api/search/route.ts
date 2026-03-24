import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const city = searchParams.get('city') || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, data: { events: [], places: [] } });
    }

    const whereClause = city ? { cityId: city } : {};

    const [events, places] = await Promise.all([
      type !== 'places' ? prisma.event.findMany({
        where: {
          ...whereClause,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { tags: { contains: query } },
            { venueName: { contains: query } },
          ],
          status: 'approved',
        },
        take: 10,
        orderBy: { viewCount: 'desc' },
        include: {
          city: { select: { name: true, slug: true } },
        },
      }) : Promise.resolve([]),
      type !== 'events' ? prisma.place.findMany({
        where: {
          ...whereClause,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { tags: { contains: query } },
            { address: { contains: query } },
          ],
        },
        take: 10,
        orderBy: { rating: 'desc' },
        include: {
          city: { select: { name: true, slug: true } },
        },
      }) : Promise.resolve([]),
    ]);

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      category: event.category,
      city: event.city,
      venueName: event.venueName,
      dateStart: event.dateStart.toISOString(),
      isFree: event.isFree,
      image: event.imageUrl,
      type: 'event',
    }));

    const formattedPlaces = places.map(place => ({
      id: place.id,
      name: place.name,
      category: place.category,
      city: place.city,
      address: place.address,
      rating: place.rating,
      reviewCount: place.reviewCount,
      image: place.imageUrl,
      type: 'place',
    }));

    return NextResponse.json({
      success: true,
      data: {
        events: formattedEvents,
        places: formattedPlaces,
        total: formattedEvents.length + formattedPlaces.length,
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/search');
  }
}
