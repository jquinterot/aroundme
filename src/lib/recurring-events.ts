import { prisma } from '@/lib/prisma';
import { addDays, addWeeks, addMonths, setDay, setDate } from 'date-fns';

export interface CreateSeriesInput {
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  startDate: Date;
  endDate?: Date;
  occurrences?: number;
  templateEventId?: string;
}

export async function createEventSeries(
  userId: string,
  input: CreateSeriesInput
): Promise<{ series: any; events: any[] }> {
  const templateEvent = input.templateEventId
    ? await prisma.event.findUnique({
        where: { id: input.templateEventId },
        include: { city: true },
      })
    : null;

  if (!templateEvent && !input.templateEventId) {
    throw new Error('Se requiere un evento plantilla');
  }

  if (!templateEvent) {
    throw new Error('Evento plantilla no encontrado');
  }

  const series = await prisma.eventSeries.create({
    data: {
      name: input.name,
      description: input.description,
      frequency: input.frequency,
      interval: input.interval || 1,
      dayOfWeek: input.dayOfWeek,
      dayOfMonth: input.dayOfMonth,
      startDate: input.startDate,
      endDate: input.endDate,
      occurrences: input.occurrences,
      parentEventId: input.templateEventId,
    },
  });

  const eventDates = generateEventDates({
    startDate: input.startDate,
    endDate: input.endDate,
    frequency: input.frequency,
    interval: input.interval || 1,
    dayOfWeek: input.dayOfWeek,
    dayOfMonth: input.dayOfMonth,
    occurrences: input.occurrences,
  });

  const events = await Promise.all(
    eventDates.map(async (eventDate, index) => {
      const eventStart = new Date(eventDate);
      const eventEnd = templateEvent.dateEnd
        ? new Date(eventDate.getTime() + (new Date(templateEvent.dateEnd).getTime() - new Date(templateEvent.dateStart).getTime()))
        : null;

      const isFirst = index === 0;
      const isLast = index === eventDates.length - 1;

      return prisma.event.create({
        data: {
          title: `${templateEvent.title}${eventDates.length > 1 ? ` (${index + 1}/${eventDates.length})` : ''}`,
          description: templateEvent.description,
          category: templateEvent.category,
          status: isFirst ? templateEvent.status : 'pending',
          cityId: templateEvent.cityId,
          venueName: templateEvent.venueName,
          venueAddress: templateEvent.venueAddress,
          venueLat: templateEvent.venueLat,
          venueLng: templateEvent.venueLng,
          dateStart: eventStart,
          dateEnd: eventEnd,
          priceMin: templateEvent.priceMin,
          priceMax: templateEvent.priceMax,
          currency: templateEvent.currency,
          isFree: templateEvent.isFree,
          imageUrl: templateEvent.imageUrl,
          tags: templateEvent.tags,
          userId: templateEvent.userId,
          isPrivate: templateEvent.isPrivate,
          maxAttendees: templateEvent.maxAttendees,
          seriesId: series.id,
        },
      });
    })
  );

  return { series, events };
}

interface GenerateDatesInput {
  startDate: Date;
  endDate?: Date;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  occurrences?: number;
}

function generateEventDates(input: GenerateDatesInput): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(input.startDate);
  let count = 0;
  const maxOccurrences = input.occurrences || 365;
  const maxDate = input.endDate || addMonths(new Date(), 12);

  while (count < maxOccurrences && currentDate <= maxDate) {
    let eventDate = new Date(currentDate);

    if (input.dayOfWeek !== undefined) {
      const currentDay = currentDate.getDay();
      const daysUntilTarget = (input.dayOfWeek - currentDay + 7) % 7;
      eventDate = addDays(currentDate, daysUntilTarget);
    }

    if (input.dayOfMonth !== undefined) {
      const targetDate = setDate(currentDate, Math.min(input.dayOfMonth, 28));
      eventDate = new Date(targetDate);
    }

    dates.push(eventDate);
    count++;

    switch (input.frequency) {
      case 'daily':
        currentDate = addDays(currentDate, input.interval);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, input.interval);
        break;
      case 'biweekly':
        currentDate = addWeeks(currentDate, 2 * input.interval);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, input.interval);
        break;
    }
  }

  return dates;
}

export async function getEventSeries(seriesId: string) {
  const series = await prisma.eventSeries.findUnique({
    where: { id: seriesId },
    include: {
      events: {
        orderBy: { dateStart: 'asc' },
        select: {
          id: true,
          title: true,
          dateStart: true,
          dateEnd: true,
          status: true,
          venueName: true,
          _count: {
            select: { rsvps: true, checkIns: true },
          },
        },
      },
    },
  });

  if (!series) return null;

  const stats = {
    total: series.events.length,
    upcoming: series.events.filter(e => new Date(e.dateStart) >= new Date()).length,
    past: series.events.filter(e => new Date(e.dateStart) < new Date()).length,
    totalAttendees: series.events.reduce((sum, e) => sum + e._count.rsvps, 0),
    totalCheckIns: series.events.reduce((sum, e) => sum + e._count.checkIns, 0),
  };

  return { ...series, stats };
}

export async function updateSeriesEvent(
  seriesId: string,
  eventId: string,
  updates: Partial<{
    title: string;
    description: string;
    dateStart: Date;
    dateEnd: Date;
    venueName: string;
    venueAddress: string;
    status: string;
  }>
) {
  const event = await prisma.event.findFirst({
    where: { id: eventId, seriesId },
  });

  if (!event) {
    throw new Error('Evento no encontrado o no pertenece a la serie');
  }

  return prisma.event.update({
    where: { id: eventId },
    data: updates,
  });
}

export async function updateSeries(
  seriesId: string,
  updates: Partial<{
    name: string;
    description: string;
    endDate: Date;
    occurrences: number;
    dateStart: Date;
  }>,
  applyTo: 'all' | 'future' | 'none' = 'none'
) {
  const series = await prisma.eventSeries.findUnique({
    where: { id: seriesId },
    include: {
      events: {
        where: { dateStart: { gte: new Date() } },
        orderBy: { dateStart: 'asc' },
      },
    },
  });

  if (!series) {
    throw new Error('Serie no encontrada');
  }

  await prisma.eventSeries.update({
    where: { id: seriesId },
    data: updates,
  });

  if (applyTo === 'future' && updates.dateStart) {
    const eventDates = generateEventDates({
      startDate: updates.dateStart,
      endDate: series.endDate || undefined,
      frequency: series.frequency as any,
      interval: series.interval,
      dayOfWeek: series.dayOfWeek || undefined,
      dayOfMonth: series.dayOfMonth || undefined,
      occurrences: updates.occurrences || series.occurrences || undefined,
    });

    for (let i = 0; i < Math.min(series.events.length, eventDates.length); i++) {
      const event = series.events[i];
      const newDate = eventDates[i];

      await prisma.event.update({
        where: { id: event.id },
        data: {
          dateStart: newDate,
          dateEnd: event.dateEnd
            ? new Date(newDate.getTime() + (new Date(event.dateEnd).getTime() - new Date(event.dateStart).getTime()))
            : null,
        },
      });
    }
  }

  return getEventSeries(seriesId);
}

export async function cancelSeriesEvent(seriesId: string, eventId: string) {
  const event = await prisma.event.findFirst({
    where: { id: eventId, seriesId },
  });

  if (!event) {
    throw new Error('Evento no encontrado');
  }

  return prisma.event.update({
    where: { id: eventId },
    data: { status: 'cancelled' },
  });
}

export async function deleteSeries(
  seriesId: string,
  deleteEvents: 'all' | 'future' | 'none' = 'none'
) {
  const series = await prisma.eventSeries.findUnique({
    where: { id: seriesId },
    include: {
      events: true,
    },
  });

  if (!series) {
    throw new Error('Serie no encontrada');
  }

  if (deleteEvents === 'all') {
    await prisma.event.deleteMany({
      where: { seriesId },
    });
  } else if (deleteEvents === 'future') {
    const now = new Date();
    await prisma.event.deleteMany({
      where: {
        seriesId,
        dateStart: { gt: now },
      },
    });
  }

  return prisma.eventSeries.delete({
    where: { id: seriesId },
  });
}
