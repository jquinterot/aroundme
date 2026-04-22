import { prisma } from '@/lib/prisma';
import type { Event, EventCategory } from '@/types';

export interface CreateEventData {
  title: string;
  description: string;
  category: EventCategory;
  cityId: string;
  venueName: string;
  venueAddress: string;
  venueLat?: number;
  venueLng?: number;
  dateStart: Date;
  dateEnd?: Date | null;
  isFree: boolean;
  priceMin?: number;
  imageUrl?: string | null;
  tags?: string;
  userId?: string;
}

export interface EventFilters {
  category?: string;
  date?: string;
  price?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function createEvent(data: CreateEventData) {
  return prisma.event.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      cityId: data.cityId,
      venueName: data.venueName.trim(),
      venueAddress: data.venueAddress.trim(),
      venueLat: data.venueLat ?? 0,
      venueLng: data.venueLng ?? 0,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      priceMin: data.isFree ? 0 : (data.priceMin || 0),
      priceMax: data.isFree ? 0 : (data.priceMin || 0),
      isFree: data.isFree,
      imageUrl: data.imageUrl || null,
      tags: data.tags || '',
      status: 'pending',
      userId: data.userId,
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      city: true,
      user: {
        select: { id: true, name: true, isVerified: true },
      },
      ticketTypes: true,
      rsvps: true,
    },
  });
}

export async function getEventsByCity(cityId: string, filters?: EventFilters) {
  const where: Record<string, unknown> = {
    cityId,
    status: 'approved',
  };

  if (filters?.category && filters.category !== 'all') {
    where.category = filters.category;
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters?.date && filters.date !== 'all') {
    const now = new Date();
    
    switch (filters.date) {
      case 'today':
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        where.dateStart = { gte: todayStart };
        break;
      case 'week':
        const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        where.dateStart = { gte: now, lte: weekEnd };
        break;
      case 'month':
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        where.dateStart = { gte: now, lte: monthEnd };
        break;
    }
  }

  if (filters?.price === 'free') {
    where.isFree = true;
  } else if (filters?.price === 'paid') {
    where.isFree = false;
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        city: true,
        user: {
          select: { id: true, name: true, isVerified: true },
        },
        _count: {
          select: { rsvps: true, saves: true },
        },
      },
      orderBy: { dateStart: 'asc' },
      take: limit,
      skip,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateEvent(id: string, data: Partial<Event>) {
  return prisma.event.update({
    where: { id },
    data,
  });
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({
    where: { id },
  });
}

export async function getEventAnalytics(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      rsvps: true,
      saves: true,
      _count: {
        select: { rsvps: true, saves: true },
      },
    },
  });

  if (!event) return null;

  const viewCount = await prisma.clickEvent.count({
    where: { itemId: eventId, type: 'event' },
  });

  return {
    viewCount,
    saveCount: event._count.saves,
    rsvpCount: {
      going: event.rsvps.filter(r => r.status === 'going').length,
      interested: event.rsvps.filter(r => r.status === 'interested').length,
      maybe: event.rsvps.filter(r => r.status === 'maybe').length,
      total: event._count.rsvps,
    },
  };
}
