import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      where: { userId: session.id },
      include: {
        city: { select: { name: true, slug: true } },
        _count: {
          select: { rsvps: true, saves: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      status: event.status,
      city: event.city,
      venueName: event.venueName,
      dateStart: event.dateStart.toISOString(),
      dateEnd: event.dateEnd?.toISOString() || null,
      isFree: event.isFree,
      price: event.isFree ? 0 : (event.priceMax || 0),
      image: event.imageUrl,
      isFeatured: event.isFeatured,
      viewCount: event.viewCount,
      rsvpCount: event._count.rsvps,
      saveCount: event._count.saves,
      createdAt: event.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: formattedEvents });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}
