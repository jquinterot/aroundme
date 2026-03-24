import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Debes iniciar sesión para ver tus RSVPs', 401, 'UNAUTHORIZED');
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { userId: user.id },
      include: {
        event: {
          include: {
            city: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: rsvps.map((rsvp) => ({
        id: rsvp.id,
        eventId: rsvp.eventId,
        status: rsvp.status,
        createdAt: rsvp.createdAt.toISOString(),
        event: {
          id: rsvp.event.id,
          title: rsvp.event.title,
          imageUrl: rsvp.event.imageUrl,
          dateStart: rsvp.event.dateStart.toISOString(),
          city: rsvp.event.city.name,
          citySlug: rsvp.event.city.slug,
        },
      })),
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/user/rsvps');
  }
}
