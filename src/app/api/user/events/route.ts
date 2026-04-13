import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, requireAuth } from '@/lib/api-utils';

export async function GET() {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const events = await prisma.event.findMany({
      where: { userId: auth.user.id },
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
    return handleApiError(error, 'GET /api/user/events');
  }
}
