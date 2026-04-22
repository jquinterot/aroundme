---
name: email-notifications
description: Create transactional emails with Resend and push notifications with Web Push API. Use for notification features.
---

This skill guides email and push notification implementation in the AroundMe application.

## Email Setup (Resend)

Environment variables:
```env
RESEND_API_KEY=re_...
EMAIL_PROVIDER=resend
```

## Email Service

Location: `src/lib/email.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const { data, error } = await resend.emails.send({
    from: 'AroundMe <noreply@aroundme.co>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Email error:', error);
    return null;
  }

  // Log email
  await prisma.emailLog.create({
    data: {
      to,
      subject,
      type: 'transactional',
      status: 'sent',
    },
  });

  return data;
}
```

## Email Templates

### RSVP Confirmation
```typescript
export async function sendRsvpConfirmation(
  email: string,
  event: Event,
  status: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .button { background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AroundMe</h1>
        </div>
        <div class="content">
          <h2>You're ${status} to ${event.title}!</h2>
          <p><strong>When:</strong> ${event.startDate} at ${event.startTime}</p>
          <p><strong>Where:</strong> ${event.venueName}</p>
          <p><strong>Address:</strong> ${event.venueAddress}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/event/${event.id}" class="button">
            View Event
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, `RSVP Confirmed: ${event.title}`, html);
}
```

### Ticket Confirmation
```typescript
export async function sendTicketConfirmation(
  email: string,
  order: Order,
  event: Event
) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4f46e5; color: white; padding: 20px; text-align: center;">
        <h1>Ticket Confirmed!</h1>
      </div>
      <div style="padding: 20px; background: #f9fafb;">
        <h2>${event.title}</h2>
        <p><strong>Order #:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${event.startDate}</p>
        <p><strong>Location:</strong> ${event.venueName}</p>
        <p><strong>Total:</strong> $${order.totalAmount.toLocaleString()} COP</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/api/checkin/qr/${order.id}" 
               alt="QR Code" style="width: 200px; height: 200px;" />
          <p style="font-size: 12px; color: #666;">Show this QR code at the entrance</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, `Your ticket for ${event.title}`, html);
}
```

### Event Reminder
```typescript
export async function sendEventReminder(
  email: string,
  event: Event,
  userName: string
) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hi ${userName}!</h2>
      <p>Reminder: <strong>${event.title}</strong> is happening tomorrow!</p>
      <ul>
        <li><strong>Time:</strong> ${event.startTime}</li>
        <li><strong>Location:</strong> ${event.venueName}</li>
        <li><strong>Address:</strong> ${event.venueAddress}</li>
      </ul>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/event/${event.id}" 
         style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
        View Event Details
      </a>
    </div>
  `;

  await sendEmail(email, `Tomorrow: ${event.title}`, html);
}
```

## Push Notifications

### Setup
```typescript
// src/lib/notifications.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:contact@aroundme.co',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: { title: string; body: string; url?: string }
) {
  await webpush.sendNotification(
    subscription,
    JSON.stringify(payload)
  );
}
```

### Subscribe User
```typescript
// POST /api/notifications/subscribe
export async function POST(request: NextRequest) {
  const session = await getSession();
  const subscription = await request.json();

  await prisma.notification.create({
    data: {
      userId: session.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });

  return successResponse({ subscribed: true });
}
```

### Send Notification
```typescript
export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  url?: string
) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
  });

  for (const sub of notifications) {
    try {
      await sendPushNotification(sub, { title, body, url });
    } catch (error) {
      // Remove invalid subscriptions
      if (error.statusCode === 410) {
        await prisma.notification.delete({ where: { id: sub.id } });
      }
    }
  }
}
```

## Email Types

| Type | Trigger | Template |
|------|---------|----------|
| `rsvp_confirmation` | User RSVPs to event | RSVP details |
| `ticket_confirmation` | Ticket purchased | QR code + details |
| `event_reminder` | Day before event | Event details |
| `weekly_digest` | Weekly schedule | Upcoming events |
| `waitlist_available` | Spot opens up | Event link |

## Free Tier Limits (Resend)

- 3,000 emails/month
- 100 emails/day
- No credit card required

## Checklist

- [ ] RESEND_API_KEY in .env
- [ ] Email templates created
- [ ] Email logging to database
- [ ] Push subscription management
- [ ] Notification preferences
- [ ] Unsubscribe functionality
- [ ] Rate limiting for sends
