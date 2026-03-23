import { prisma } from '@/lib/prisma';
import { createNotification } from './notifications';

export interface CheckInQRData {
  eventId: string;
  ticketTypeId?: string;
  timestamp: number;
}

export function generateQRToken(eventId: string, userId: string, ticketTypeId?: string): string {
  const data: CheckInQRData = {
    eventId,
    ticketTypeId,
    timestamp: Date.now(),
  };

  const jsonStr = JSON.stringify(data);
  const base64 = Buffer.from(jsonStr).toString('base64');
  
  const checksum = simpleHash(base64);
  
  return `${base64}.${checksum}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function validateQRToken(token: string): CheckInQRData | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [data, checksum] = parts;
  const expectedChecksum = simpleHash(data);
  
  if (checksum !== expectedChecksum) return null;

  try {
    const jsonStr = Buffer.from(data, 'base64').toString();
    const dataObj = JSON.parse(jsonStr) as CheckInQRData;

    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    if (dataObj.timestamp < oneHourAgo) {
      return null;
    }

    return dataObj;
  } catch {
    return null;
  }
}

export async function performCheckIn(
  eventId: string,
  userId: string,
  ticketTypeId?: string,
  method: 'qr_code' | 'manual' | 'api' = 'manual'
): Promise<{ success: boolean; message: string }> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      status: true,
      dateStart: true,
      maxAttendees: true,
      currentAttendees: true,
      userId: true,
    },
  });

  if (!event) {
    return { success: false, message: 'Evento no encontrado' };
  }

  if (event.status !== 'approved') {
    return { success: false, message: 'El evento no está activo' };
  }

  const eventStart = new Date(event.dateStart);
  const oneHourBefore = new Date(eventStart.getTime() - 60 * 60 * 1000);
  const now = new Date();

  if (now < oneHourBefore) {
    return { success: false, message: 'El check-in no está habilitado aún' };
  }

  const oneDayAfter = new Date(eventStart.getTime() + 24 * 60 * 60 * 1000);
  if (now > oneDayAfter) {
    return { success: false, message: 'El evento ya terminó' };
  }

  const existingCheckIn = await prisma.checkIn.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  });

  if (existingCheckIn) {
    return {
      success: false,
      message: `Ya registrado a las ${new Date(existingCheckIn.checkedInAt).toLocaleTimeString()}`,
    };
  }

  if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
    return { success: false, message: 'El evento ha alcanzado su capacidad máxima' };
  }

  await prisma.checkIn.create({
    data: {
      eventId,
      userId,
      ticketTypeId,
      checkInMethod: method,
      checkedInAt: new Date(),
    },
  });

  await prisma.event.update({
    where: { id: eventId },
    data: { currentAttendees: { increment: 1 } },
  });

  await createNotification({
    userId,
    type: 'check_in_confirmed',
    title: 'Check-in Confirmado',
    message: `Te has registrado exitosamente en ${event.title}`,
    link: `/event/${eventId}`,
  });

  if (event.userId) {
    await createNotification({
      userId: event.userId,
      type: 'new_check_in',
      title: 'Nuevo Asistente',
      message: `Un asistente se registró en tu evento ${event.title}`,
      link: `/event/${eventId}/attendees`,
    });
  }

  return {
    success: true,
    message: 'Check-in realizado exitosamente',
  };
}

export async function getEventCheckIns(eventId: string) {
  const checkIns = await prisma.checkIn.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { checkedInAt: 'desc' },
  });

  return {
    total: checkIns.length,
    checkIns,
  };
}

export async function getUserCheckIns(userId: string) {
  const checkIns = await prisma.checkIn.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          dateStart: true,
          venueName: true,
          imageUrl: true,
          city: { select: { name: true } },
        },
      },
    },
    orderBy: { checkedInAt: 'desc' },
  });

  return checkIns;
}

export async function generateCheckInReport(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      ticketTypes: {
        select: {
          id: true,
          name: true,
          quantity: true,
          sold: true,
        },
      },
      rsvps: {
        where: { status: 'going' },
        select: { userId: true },
      },
      _count: {
        select: {
          saves: true,
          rsvps: true,
        },
      },
    },
  });

  if (!event) return null;

  const checkIns = await prisma.checkIn.findMany({
    where: { eventId },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return {
    event: {
      id: event.id,
      title: event.title,
      dateStart: event.dateStart,
      venueName: event.venueName,
      totalRsvps: event._count.rsvps,
      totalSaves: event._count.saves,
      maxAttendees: event.maxAttendees,
    },
    checkInStats: {
      total: checkIns.length,
      percentage: event.maxAttendees
        ? Math.round((checkIns.length / event.maxAttendees) * 100)
        : null,
    },
    attendees: checkIns.map(c => ({
      name: c.user.name,
      email: c.user.email,
      checkedInAt: c.checkedInAt,
      method: c.checkInMethod,
    })),
    noShowRsvps: event.rsvps
      .filter(rsvp => !checkIns.some(c => c.userId === rsvp.userId))
      .map(r => r.userId),
  };
}
