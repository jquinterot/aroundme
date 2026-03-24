import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notifyEventOwner } from '@/lib/notifications';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Authentication required to RSVP', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;
    const { status } = await request.json();
    
    if (!status) {
      return errorResponse('RSVP status is required', 400, 'VALIDATION_ERROR');
    }

    const validStatuses = ['going', 'interested', 'maybe'];
    if (!validStatuses.includes(status)) {
      return errorResponse(`Invalid RSVP status. Must be one of: ${validStatuses.join(', ')}`, 400, 'VALIDATION_ERROR');
    }
    
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
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
        await notifyEventOwner(
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
    return handleApiError(error, 'POST RSVP');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Authentication required to cancel RSVP', 401, 'UNAUTHORIZED');
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
    return handleApiError(error, 'DELETE RSVP');
  }
}
