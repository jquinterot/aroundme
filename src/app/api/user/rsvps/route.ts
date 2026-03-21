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
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}
