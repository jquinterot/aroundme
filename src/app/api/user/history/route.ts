import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('You must be logged in to view your history', 401, 'UNAUTHORIZED');
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 10;

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return errorResponse('El límite debe ser un número entre 1 y 100', 400, 'INVALID_LIMIT');
    }

    if (type !== 'all' && !['event', 'place'].includes(type)) {
      return errorResponse('El tipo debe ser "event", "place" o "all"', 400, 'INVALID_TYPE');
    }

    const where: Record<string, unknown> = { userId: session.id };
    if (type !== 'all') {
      where.type = type;
    }

    const views = await prisma.viewHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const eventViews = views.filter(v => v.type === 'event');
    const placeViews = views.filter(v => v.type === 'place');

    const [events, places] = await Promise.all([
      eventViews.length > 0 ? prisma.event.findMany({
        where: { id: { in: eventViews.map(v => v.itemId) } },
        include: { city: { select: { name: true, slug: true } } },
      }) : Promise.resolve([]),
      placeViews.length > 0 ? prisma.place.findMany({
        where: { id: { in: placeViews.map(v => v.itemId) } },
        include: { city: { select: { name: true, slug: true } } },
      }) : Promise.resolve([]),
    ]);

    const eventMap = new Map(events.map(e => [e.id, e]));
    const placeMap = new Map(places.map(p => [p.id, p]));

    const formattedHistory = views.map(view => {
      if (view.type === 'event') {
        const event = eventMap.get(view.itemId);
        return event ? {
          id: view.id,
          type: 'event',
          itemId: view.itemId,
          item: {
            id: event.id,
            title: event.title,
            category: event.category,
            city: event.city,
            venueName: event.venueName,
            dateStart: event.dateStart.toISOString(),
            image: event.imageUrl,
          },
          viewedAt: view.createdAt.toISOString(),
        } : null;
      } else {
        const place = placeMap.get(view.itemId);
        return place ? {
          id: view.id,
          type: 'place',
          itemId: view.itemId,
          item: {
            id: place.id,
            name: place.name,
            category: place.category,
            city: place.city,
            address: place.address,
            rating: place.rating,
            image: place.imageUrl,
          },
          viewedAt: view.createdAt.toISOString(),
        } : null;
      }
    }).filter(Boolean);

    return NextResponse.json({ success: true, data: formattedHistory });
  } catch (error) {
    return handleApiError(error, 'GET /api/user/history');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('You must be logged in to record views', 401, 'UNAUTHORIZED');
    }

    const { type, itemId } = await request.json();

    if (!type) {
      return errorResponse('El tipo es requerido', 400, 'TYPE_REQUIRED');
    }

    if (!itemId) {
      return errorResponse('El ID del elemento es requerido', 400, 'ITEM_ID_REQUIRED');
    }

    if (!['event', 'place'].includes(type)) {
      return errorResponse('El tipo debe ser "event" o "place"', 400, 'INVALID_TYPE');
    }

    if (typeof itemId !== 'string' || itemId.length < 1) {
      return errorResponse('ID de elemento inválido', 400, 'INVALID_ITEM_ID');
    }

    await prisma.viewHistory.create({
      data: {
        userId: session.id,
        type,
        itemId,
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await prisma.viewHistory.deleteMany({
      where: {
        userId: session.id,
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'POST /api/user/history');
  }
}
