import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    const existingReminder = await prisma.notification.findFirst({
      where: {
        userId: session.id,
        type: 'event_reminder',
        data: { contains: eventId },
      },
    });

    if (existingReminder) {
      return NextResponse.json({ success: false, error: 'Reminder already set' }, { status: 400 });
    }

    const eventDate = new Date(event.dateStart);
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(reminderDate.getDate() - 1);

    if (reminderDate <= new Date()) {
      return NextResponse.json({ success: false, error: 'Event is too soon for reminder' }, { status: 400 });
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
    console.error('Error setting reminder:', error);
    return NextResponse.json({ success: false, error: 'Failed to set reminder' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
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
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete reminder' }, { status: 500 });
  }
}
