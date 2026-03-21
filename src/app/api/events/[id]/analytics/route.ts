import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
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
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    await prisma.event.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track view' },
      { status: 500 }
    );
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
        rsvps: true,
        saves: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const isOwner = user?.id === event.userId;
    const isSaved = user ? event.saves.some((s: Save) => s.userId === user.id) : false;
    const userRsvp = user ? event.rsvps.find((r: RSVP) => r.userId === user.id) : null;

    const analytics = {
      viewCount: event.viewCount,
      saveCount: event.saveCount,
      rsvpCount: {
        going: event.rsvps.filter((r: RSVP) => r.status === 'going').length,
        interested: event.rsvps.filter((r: RSVP) => r.status === 'interested').length,
        maybe: event.rsvps.filter((r: RSVP) => r.status === 'maybe').length,
        total: event.rsvps.length,
      },
      isOwner,
      isSaved,
      userRsvp: userRsvp ? { status: userRsvp.status } : null,
    };

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}
