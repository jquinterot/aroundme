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
      venueLat: data.venueLat,
      venueLng: data.venueLng,
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
    let dateStart: Date;
    
    switch (filters.date) {
      case 'today':
        dateStart = new Date(now.setHours(0, 0, 0, 0));
        where.dateStart = { gte: dateStart };
        break;
      case 'week':
        dateStart = new Date(now.setDate(now.getDate() + 7));
        where.dateStart = { gte: new Date(), lte: dateStart };
        break;
      case 'month':
        dateStart = new Date(now.setMonth(now.getMonth() + 1));
        where.dateStart = { gte: new Date(), lte: dateStart };
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

  const viewCount = await prisma.eventView.count({
    where: { eventId },
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
