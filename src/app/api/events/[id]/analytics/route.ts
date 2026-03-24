import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';
import type { RSVP, Save } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    await prisma.event.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'POST track view');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSession();
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        rsvps: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true }
            }
          }
        },
        saves: true,
        checkIns: true,
        city: {
          select: { id: true, name: true, slug: true }
        },
      },
    });

    if (!event) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    const isOwner = user?.id === event.userId;
    const isSaved = user ? event.saves.some((s: Save) => s.userId === user.id) : false;
    const userRsvp = user ? event.rsvps.find((r: RSVP) => r.userId === user.id) : null;

    const rsvpGoing = event.rsvps.filter((r: RSVP) => r.status === 'going');
    const rsvpInterested = event.rsvps.filter((r: RSVP) => r.status === 'interested');
    const rsvpMaybe = event.rsvps.filter((r: RSVP) => r.status === 'maybe');
    
    const checkInCount = event.checkIns.length;
    const rsvpGoingCount = rsvpGoing.length;
    
    const attendanceRate = rsvpGoingCount > 0 
      ? Math.round((checkInCount / rsvpGoingCount) * 100) 
      : 0;
    
    const viewsToRsvpRate = event.viewCount > 0 
      ? Math.round((event.rsvps.length / event.viewCount) * 100) 
      : 0;

    const now = new Date();
    const eventDate = new Date(event.dateStart);
    const isUpcoming = eventDate > now;
    const isPast = eventDate < now;

    const similarEvents = isUpcoming 
      ? await prisma.event.count({
          where: {
            cityId: event.cityId,
            category: event.category,
            status: 'approved',
            dateStart: { gt: now },
          },
        })
      : await prisma.event.count({
          where: {
            cityId: event.cityId,
            category: event.category,
            status: 'approved',
            dateStart: {
              gte: new Date(eventDate.getTime() - 30 * 24 * 60 * 60 * 1000),
              lte: new Date(eventDate.getTime() + 30 * 24 * 60 * 60 * 1000),
            },
          },
        });

    const recentRsvpUsers = rsvpGoing
      .slice(0, 5)
      .map((r: RSVP & { user: { id: string; name: string; avatarUrl: string | null } }) => ({
        id: r.user.id,
        name: r.user.name,
        avatarUrl: r.user.avatarUrl,
      }));

    const waitlistCount = await prisma.waitlist.count({
      where: { eventId: id },
    });

    const analytics = {
      overview: {
        viewCount: event.viewCount,
        saveCount: event.saveCount,
        checkInCount,
        waitlistCount,
      },
      rsvpCount: {
        going: rsvpGoingCount,
        interested: rsvpInterested.length,
        maybe: rsvpMaybe.length,
        total: event.rsvps.length,
      },
      performance: {
        attendanceRate,
        viewsToRsvpRate,
        conversionRate: viewsToRsvpRate,
        avgViewsPerRsvp: event.rsvps.length > 0 
          ? Math.round(event.viewCount / event.rsvps.length) 
          : 0,
      },
      comparison: {
        similarEventsInCity: similarEvents,
        percentile: event.viewCount > 0 
          ? Math.min(99, Math.round((event.viewCount / Math.max(event.viewCount, 100)) * 100))
          : 0,
      },
      status: {
        isUpcoming,
        isPast,
        daysUntilEvent: Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      },
      recentAttendees: recentRsvpUsers,
      isOwner,
      isSaved,
      userRsvp: userRsvp ? { status: userRsvp.status } : null,
    };

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    return handleApiError(error, 'GET event analytics');
  }
}
