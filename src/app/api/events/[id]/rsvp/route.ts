import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notifyEventOwner } from '@/lib/notifications';
import { sendEmail } from '@/lib/email';
import { handleApiError, errorResponse } from '@/lib/api-utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

      sendEmail({
        template: 'rsvp_confirmation',
        userId: user.id,
        data: {
          eventTitle: event.title,
          eventDate: format(new Date(event.dateStart), "EEEE, d 'de' MMMM", { locale: es }),
          eventTime: format(new Date(event.dateStart), 'h:mm a'),
          venueName: event.venueName,
          venueAddress: event.venueAddress,
          rsvpStatus: status === 'going' ? 'Asistiré' : status === 'interested' ? 'Me interesa' : 'Tal vez',
          eventUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aroundme.app'}/event/${event.id}`,
        },
      }).catch(console.error);

      return NextResponse.json({ success: true, data: { rsvp: updated } });
    } else {
      const created = await prisma.rSVP.create({
        data: {
          userId: user.id,
          eventId: id,
          status,
        },
      });

      sendEmail({
        template: 'rsvp_confirmation',
        userId: user.id,
        data: {
          eventTitle: event.title,
          eventDate: format(new Date(event.dateStart), "EEEE, d 'de' MMMM", { locale: es }),
          eventTime: format(new Date(event.dateStart), 'h:mm a'),
          venueName: event.venueName,
          venueAddress: event.venueAddress,
          rsvpStatus: status === 'going' ? 'Asistiré' : status === 'interested' ? 'Me interesa' : 'Tal vez',
          eventUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aroundme.app'}/event/${event.id}`,
        },
      }).catch(console.error);

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
