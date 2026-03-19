import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Event } from '@/generated/prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  const category = searchParams.get('category');
  const date = searchParams.get('date');
  const price = searchParams.get('price');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const cityRecord = await prisma.city.findUnique({
      where: { slug },
    });

    if (!cityRecord) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }

    const where: Record<string, unknown> = {
      cityId: cityRecord.id,
      status: 'published',
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (price === 'free') {
      where.isFree = true;
    } else if (price === 'paid') {
      where.isFree = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (date === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      where.dateStart = { gte: today, lt: tomorrow };
    } else if (date === 'week') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      where.dateStart = { gte: today, lt: nextWeek };
    } else if (date === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      where.dateStart = { gte: today, lt: nextMonth };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: [
          { isFeatured: 'desc' },
          { featuredUntil: 'desc' },
          { dateStart: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    const formattedEvents = events.map((event: Event & { venueName: string; venueAddress: string; venueLat: number; venueLng: number }) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      status: event.status,
      cityId: event.cityId,
      venue: {
        name: event.venueName,
        address: event.venueAddress,
        coordinates: { lat: event.venueLat, lng: event.venueLng },
      },
      date: {
        start: event.dateStart.toISOString(),
        end: event.dateEnd?.toISOString() || null,
      },
      price: event.isFree
        ? { min: 0, max: 0, currency: event.currency, isFree: true }
        : { min: event.priceMin || 0, max: event.priceMax || 0, currency: event.currency, isFree: false },
      image: event.imageUrl,
      tags: event.tags.split(',').filter(Boolean),
      isFeatured: event.isFeatured,
      featuredUntil: event.featuredUntil?.toISOString() || null,
      featuredTier: event.featuredTier,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedEvents,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}
