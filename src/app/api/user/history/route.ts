import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

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
    console.error('Error fetching view history:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { type, itemId } = await request.json();

    if (!type || !itemId) {
      return NextResponse.json({ success: false, error: 'Type and itemId are required' }, { status: 400 });
    }

    if (!['event', 'place'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
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
    console.error('Error recording view:', error);
    return NextResponse.json({ success: false, error: 'Failed to record view' }, { status: 500 });
  }
}
