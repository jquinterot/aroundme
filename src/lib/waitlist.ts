import { prisma } from '@/lib/prisma';
import { sendEmail } from './email';

export async function joinWaitlist(
  userId: string,
  eventId: string,
  notifyAt?: number
): Promise<{ position: number }> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { maxAttendees: true, currentAttendees: true, title: true },
  });

  if (!event) {
    throw new Error('Evento no encontrado');
  }

  if (!event.maxAttendees) {
    throw new Error('Este evento no tiene límite de asistentes');
  }

  const existing = await prisma.waitlist.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  });

  if (existing) {
    throw new Error('Ya estás en la lista de espera');
  }

  const lastPosition = await prisma.waitlist.count({
    where: { eventId },
  });

  const waitlist = await prisma.waitlist.create({
    data: {
      eventId,
      userId,
      position: lastPosition + 1,
      notifyAt: notifyAt || 1,
      status: 'waiting',
    },
  });

  return { position: waitlist.position };
}

export async function leaveWaitlist(userId: string, eventId: string): Promise<void> {
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  });

  if (!waitlist) {
    throw new Error('No estás en la lista de espera');
  }

  await prisma.waitlist.delete({
    where: { id: waitlist.id },
  });

  await prisma.waitlist.updateMany({
    where: {
      eventId,
      position: { gt: waitlist.position },
    },
    data: {
      position: { decrement: 1 },
    },
  });
}

export async function getWaitlistPosition(userId: string, eventId: string): Promise<number | null> {
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
    select: { position: true },
  });

  return waitlist?.position || null;
}

export async function notifyWaitlistSpotsAvailable(eventId: string): Promise<void> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      title: true,
      maxAttendees: true,
      currentAttendees: true,
      dateStart: true,
      venueName: true,
    },
  });

  if (!event || !event.maxAttendees) return;

  const availableSpots = event.maxAttendees - event.currentAttendees;

  if (availableSpots <= 0) return;

  const waitlistEntries = await prisma.waitlist.findMany({
    where: {
      eventId,
      status: 'waiting',
      position: { lte: availableSpots },
    },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
    orderBy: { position: 'asc' },
    take: availableSpots,
  });

  for (const entry of waitlistEntries) {
    await prisma.waitlist.update({
      where: { id: entry.id },
      data: { status: 'notified' },
    });

    await sendEmail({
      template: 'waitlist_available',
      userId: entry.user.id,
      data: {
        eventTitle: event.title,
        availableSpots: availableSpots.toString(),
        eventUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aroundme.app'}/event/${eventId}`,
      },
    });
  }
}

export async function getEventWaitlist(eventId: string) {
  const waitlist = await prisma.waitlist.findMany({
    where: { eventId, status: { in: ['waiting', 'notified'] } },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { position: 'asc' },
  });

  return waitlist;
}
