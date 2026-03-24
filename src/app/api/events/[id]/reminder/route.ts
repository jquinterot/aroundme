import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return errorResponse('Authentication required to set reminder', 401, 'UNAUTHORIZED');
  }

  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return errorResponse('Event ID is required', 400, 'VALIDATION_ERROR');
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    const existingReminder = await prisma.notification.findFirst({
      where: {
        userId: session.id,
        type: 'event_reminder',
        data: { contains: eventId },
      },
    });

    if (existingReminder) {
      return errorResponse('Reminder already set for this event', 400, 'REMINDER_EXISTS');
    }

    const eventDate = new Date(event.dateStart);
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(reminderDate.getDate() - 1);

    if (reminderDate <= new Date()) {
      return errorResponse('Event is too soon to set a reminder', 400, 'INVALID_REMINDER_TIME');
    }

    await prisma.notification.create({
      data: {
        userId: session.id,
        type: 'event_reminder',
        title: `Recordatorio: ${event.title}`,
        message: `El evento es mañana ${eventDate.toLocaleDateString('es-CO')}`,
        link: `/event/${eventId}`,
        data: JSON.stringify({ eventId, reminderDate: reminderDate.toISOString() }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder set for tomorrow',
    });
  } catch (error) {
    return handleApiError(error, 'POST set reminder');
  }
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return errorResponse('Authentication required to fetch reminders', 401, 'UNAUTHORIZED');
  }

  try {
    const reminders = await prisma.notification.findMany({
      where: {
        userId: session.id,
        type: 'event_reminder',
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: reminders });
  } catch (error) {
    return handleApiError(error, 'GET reminders');
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return errorResponse('Authentication required to delete reminder', 401, 'UNAUTHORIZED');
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return errorResponse('Event ID is required', 400, 'VALIDATION_ERROR');
    }

    await prisma.notification.deleteMany({
      where: {
        userId: session.id,
        type: 'event_reminder',
        data: { contains: eventId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'DELETE reminder');
  }
}
