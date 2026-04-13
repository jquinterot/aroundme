import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('You must be logged in to view your saved events', 401, 'UNAUTHORIZED');
    }

    const saves = await prisma.save.findMany({
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
      data: saves.map((save) => ({
        id: save.id,
        eventId: save.eventId,
        savedAt: save.createdAt.toISOString(),
        event: {
          id: save.event.id,
          title: save.event.title,
          imageUrl: save.event.imageUrl,
          dateStart: save.event.dateStart.toISOString(),
          city: save.event.city.name,
          citySlug: save.event.city.slug,
        },
      })),
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/user/saved-events');
  }
}
