import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, isVerified: true } } },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    const formattedEvent = {
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
      organizer: {
        id: event.user?.id || '',
        name: event.user?.name || 'Organizer',
        isVerified: event.user?.isVerified || false,
      },
      tags: event.tags.split(',').filter(Boolean),
      isFeatured: event.isFeatured,
      featuredUntil: event.featuredUntil?.toISOString() || null,
      featuredTier: event.featuredTier,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: formattedEvent });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      status,
      venueName,
      venueAddress,
      venueLat,
      venueLng,
      dateStart,
      dateEnd,
      isFree,
      priceMin,
      priceMax,
      currency,
      imageUrl,
      tags,
    } = body;

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    if (existingEvent.userId !== session.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(status !== undefined && { status }),
        ...(venueName !== undefined && { venueName }),
        ...(venueAddress !== undefined && { venueAddress }),
        ...(venueLat !== undefined && { venueLat }),
        ...(venueLng !== undefined && { venueLng }),
        ...(dateStart !== undefined && { dateStart: new Date(dateStart) }),
        ...(dateEnd !== undefined && { dateEnd: dateEnd ? new Date(dateEnd) : null }),
        ...(isFree !== undefined && { isFree }),
        ...(priceMin !== undefined && { priceMin }),
        ...(priceMax !== undefined && { priceMax }),
        ...(currency !== undefined && { currency }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(tags !== undefined && { tags }),
      },
    });

    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    if (existingEvent.userId !== session.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete event' }, { status: 500 });
  }
}
