import { prisma } from './prisma';
import { sendPushNotification } from './push-notifications';

export type NotificationType = 
  | 'event_reminder'
  | 'new_rsvp'
  | 'new_review'
  | 'event_update'
  | 'venue_update'
  | 'ticket_purchase'
  | 'event_approved'
  | 'event_rejected'
  | 'report_resolved'
  | 'check_in_confirmed'
  | 'new_check_in'
  | 'new_follower'
  | 'waitlist_available'
  | 'digest';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
}

export async function createNotification(params: CreateNotificationParams) {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
      data: params.data ? JSON.stringify(params.data) : null,
    },
  });

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: params.userId },
  });

  for (const sub of subscriptions) {
    const keys = JSON.parse(sub.keys);
    await sendPushNotification(
      { endpoint: sub.endpoint, keys },
      {
        title: params.title,
        body: params.message,
        url: params.link ? `${process.env.NEXT_PUBLIC_APP_URL || ''}${params.link}` : undefined,
      }
    );
  }

  return notification;
}

export async function notifyEventOwner(eventId: string, type: NotificationType, title: string, message: string, link?: string) {
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
    });
  }
}

export async function notifyPlaceOwner(placeId: string, type: NotificationType, title: string, message: string, link?: string) {
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
    });
  }
}
