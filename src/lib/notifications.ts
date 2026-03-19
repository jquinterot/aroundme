import { prisma } from '@/lib/prisma';

export type NotificationType = 
  | 'event_reminder'
  | 'new_rsvp'
  | 'new_review'
  | 'event_update'
  | 'venue_update';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  data,
}: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
      data: data ? JSON.stringify(data) : null,
    },
  });
}

export async function notifyEventOrganizer(
  eventId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  data?: Record<string, unknown>
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { userId: true },
  });

  if (event?.userId) {
    await createNotification({
      userId: event.userId,
      type,
      title,
      message,
      link,
      data,
    });
  }
}

export async function notifyPlaceOwner(
  placeId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  data?: Record<string, unknown>
) {
  const place = await prisma.place.findUnique({
    where: { id: placeId },
    select: { ownerId: true },
  });

  if (place?.ownerId) {
    await createNotification({
      userId: place.ownerId,
      type,
      title,
      message,
      link,
      data,
    });
  }
}
