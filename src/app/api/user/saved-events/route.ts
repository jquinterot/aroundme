import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
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
    console.error('Error fetching saved events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved events' },
      { status: 500 }
    );
  }
}
