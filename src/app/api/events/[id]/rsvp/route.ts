import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notifyEventOrganizer } from '@/lib/notifications';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please login to RSVP' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { status } = await request.json();
    
    if (!['going', 'interested', 'maybe'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid RSVP status' },
        { status: 400 }
      );
    }
    
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const existingRsvp = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: id,
        },
      },
    });

    if (existingRsvp) {
      const updated = await prisma.rSVP.update({
        where: { id: existingRsvp.id },
        data: { status },
      });
      return NextResponse.json({ success: true, data: { rsvp: updated } });
    } else {
      const created = await prisma.rSVP.create({
        data: {
          userId: user.id,
          eventId: id,
          status,
        },
      });

      if (event.userId) {
        await notifyEventOrganizer(
          id,
          'new_rsvp',
          'New RSVP',
          `${user.name} is ${status === 'going' ? 'going' : status === 'interested' ? 'interested' : 'marking maybe'} to your event "${event.title}"`,
          `/event/${id}`
        );
      }

      return NextResponse.json({ success: true, data: { rsvp: created } });
    }
  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to RSVP' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please login to cancel RSVP' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.rSVP.deleteMany({
      where: {
        userId: user.id,
        eventId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RSVP delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel RSVP' },
      { status: 500 }
    );
  }
}
