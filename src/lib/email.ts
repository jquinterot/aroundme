import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeEmailData(data: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = escapeHtml(value);
  }
  return sanitized;
}

const EMAIL_TEMPLATES = {
  rsvp_confirmation: {
    subject: 'Confirmación RSVP - {{eventTitle}}',
    content: `
      <h1>¡Tu asistencia está confirmada!</h1>
      <p>Hola {{userName}},</p>
      <p>Has confirmado tu asistencia a <strong>{{eventTitle}}</strong>.</p>
      <p><strong>Fecha:</strong> {{eventDate}}</p>
      <p><strong>Hora:</strong> {{eventTime}}</p>
      <p><strong>Lugar:</strong> {{venueName}}, {{venueAddress}}</p>
      <p><strong>Estado:</strong> {{rsvpStatus}}</p>
      <p><a href="{{eventUrl}}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Ver Detalles del Evento</a></p>
      <p style="margin-top:24px;color:#6b7280;font-size:12px;">
        ¿Ya no puedes asistir? Puedes cambiar tu estado de RSVP en cualquier momento desde la página del evento.
      </p>
    `,
  },
  event_reminder: {
    subject: 'Recordatorio: {{eventTitle}} es mañana',
    content: `
      <h1>¡No olvides tu evento!</h1>
      <p>Hola {{userName}},</p>
      <p>Te recordamos que <strong>{{eventTitle}}</strong> es mañana.</p>
      <p><strong>Fecha:</strong> {{eventDate}}</p>
      <p><strong>Hora:</strong> {{eventTime}}</p>
      <p><strong>Lugar:</strong> {{venueName}}, {{venueAddress}}</p>
      <p><a href="{{eventUrl}}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Ver Detalles</a></p>
    `,
  },
  weekly_digest: {
    subject: 'Resumen Semanal - Eventos en {{cityName}}',
    content: `
      <h1> Eventos que no te puedes perder</h1>
      <p>Hola {{userName}},</p>
      <p>Aquí está el resumen de los mejores eventos para esta semana en {{cityName}}:</p>
      {{eventsList}}
      <p><a href="{{discoverUrl}}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Descubrir Más</a></p>
    `,
  },
  new_follower: {
    subject: 'Nuevo seguidor en AroundMe',
    content: `
      <h1>¡Tienes un nuevo seguidor!</h1>
      <p>Hola {{userName}},</p>
      <p><strong>{{followerName}}</strong> comenzó a seguirte.</p>
      <p><a href="{{profileUrl}}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Ver Perfil</a></p>
    `,
  },
  event_published: {
    subject: '¡Tu evento "{{eventTitle}}" ha sido aprobado!',
    content: `
      <h1>¡Buenas noticias!</h1>
      <p>Hola {{userName}},</p>
      <p>Tu evento <strong>{{eventTitle}}</strong> ha sido aprobado y ya es visible para todos.</p>
      <p><a href="{{eventUrl}}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Ver Evento</a></p>
    `,
  },
  ticket_confirmation: {
    subject: 'Confirmación de compra - {{eventTitle}}',
    content: `
      <h1>¡Compra exitosa!</h1>
      <p>Hola {{userName}},</p>
      <p>Tu compra para <strong>{{eventTitle}}</strong> ha sido confirmada.</p>
      <p><strong>Boletos:</strong> {{ticketInfo}}</p>
      <p><strong>Total:</strong> {{totalAmount}}</p>
      <p><strong>Fecha:</strong> {{eventDate}}</p>
      <p><a href="{{ticketsUrl}}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Ver Mis Boletos</a></p>
    `,
  },
  waitlist_available: {
    subject: '¡Hay lugares disponibles para {{eventTitle}}!',
    content: `
      <h1>¡Buenas noticias!</h1>
      <p>Hola {{userName}},</p>
      <p>Se acaban de liberar lugares para el evento <strong>{{eventTitle}}</strong> en el que estabas en lista de espera.</p>
      <p><strong>Lugares disponibles:</strong> {{availableSpots}}</p>
      <p><a href="{{eventUrl}}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Reservar Ahora</a></p>
    `,
  },
  event_update: {
    subject: 'Actualización de evento: {{eventTitle}}',
    content: `
      <h1>Evento actualizado</h1>
      <p>Hola {{userName}},</p>
      <p>Se ha actualizado la información de <strong>{{eventTitle}}</strong>.</p>
      <p><strong>Cambios:</strong></p>
      <ul>{{changes}}</ul>
      <p><a href="{{eventUrl}}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Ver Evento</a></p>
    `,
  },
};

interface EmailData {
  template: keyof typeof EMAIL_TEMPLATES;
  userId: string;
  data: Record<string, string>;
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  const { template, userId, data } = emailData;
  const templateData = EMAIL_TEMPLATES[template];

  if (!templateData) {
    console.error(`Template ${template} not found`);
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (!user) {
    console.error(`User ${userId} not found`);
    return false;
  }

  let subject = templateData.subject;
  let content = templateData.content;

  const sanitizedData = sanitizeEmailData(data);
  const sanitizedUserName = escapeHtml(user.name);

  Object.entries(sanitizedData).forEach(([key, value]) => {
    subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  subject = subject.replace(/\{\{userName\}\}/g, sanitizedUserName);
  content = content.replace(/\{\{userName\}\}/g, sanitizedUserName);

  await prisma.emailLog.create({
    data: {
      userId,
      type: template,
      subject,
      content,
    },
  });

  if (process.env.EMAIL_PROVIDER === 'resend') {
    return await sendViaResend(user.email, subject, content);
  } else if (process.env.EMAIL_PROVIDER === 'sendgrid') {
    return await sendViaSendGrid(user.email, subject, content);
  }

  console.log('Email would be sent:', { to: user.email, subject });
  return true;
}

async function sendViaResend(to: string, subject: string, content: string): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AroundMe <noreply@aroundme.app>',
        to,
        subject,
        html: content,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Resend error:', error);
    return false;
  }
}

async function sendViaSendGrid(to: string, subject: string, content: string): Promise<boolean> {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  
  if (!SENDGRID_API_KEY) {
    console.log('SENDGRID_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'noreply@aroundme.app', name: 'AroundMe' },
        subject,
        content: [{ type: 'text/html', value: content }],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
}

export async function sendEventReminders(): Promise<void> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const events = await prisma.event.findMany({
    where: {
      dateStart: {
        gte: tomorrow,
        lt: dayAfterTomorrow,
      },
      status: 'approved',
    },
    include: {
      rsvps: {
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      },
    },
  });

  for (const event of events) {
    for (const rsvp of event.rsvps) {
      if (rsvp.status === 'going') {
        await sendEmail({
          template: 'event_reminder',
          userId: rsvp.user.id,
          data: {
            eventTitle: event.title,
            eventDate: format(new Date(event.dateStart), "EEEE, d 'de' MMMM", { locale: es }),
            eventTime: format(new Date(event.dateStart), 'h:mm a'),
            venueName: event.venueName,
            venueAddress: event.venueAddress,
            eventUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aroundme.app'}/event/${event.id}`,
          },
        });
      }
    }
  }
}

export async function sendWeeklyDigest(): Promise<void> {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
  });

  for (const city of cities) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const events = await prisma.event.findMany({
      where: {
        cityId: city.id,
        status: 'approved',
        dateStart: {
          gte: new Date(),
          lte: nextWeek,
        },
      },
      orderBy: { saveCount: 'desc' },
      take: 5,
    });

    if (events.length === 0) continue;

    const eventsList = events
      .map(
        (event) => `
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;">
          <h3 style="margin:0 0 8px;">${event.title}</h3>
          <p style="margin:0;color:#6b7280;">
            ${format(new Date(event.dateStart), "EEEE, d 'de' MMMM 'a las' h:mm a", { locale: es })}<br/>
            ${event.venueName}
          </p>
        </div>
      `
      )
      .join('');

    const users = await prisma.user.findMany({
      where: {
        cityId: city.id,
        email: { not: '' },
      },
      select: { id: true },
    });

    for (const user of users) {
      await sendEmail({
        template: 'weekly_digest',
        userId: user.id,
        data: {
          cityName: city.name,
          eventsList,
          discoverUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aroundme.app'}/${city.slug}`,
        },
      });
    }
  }
}
