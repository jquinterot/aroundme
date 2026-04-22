import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

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
      return errorResponse('Event not found', 404, 'NOT_FOUND');
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
    return handleApiError(error, 'GET event');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse('Authentication required to update event', 401, 'UNAUTHORIZED');
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
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    if (existingEvent.userId !== session.id) {
      return errorResponse('Only the event organizer can update this event', 403, 'FORBIDDEN');
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
    return handleApiError(error, 'PATCH event');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse('Authentication required to delete event', 401, 'UNAUTHORIZED');
  }

  try {
    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    if (existingEvent.userId !== session.id) {
      return errorResponse('Only the event organizer can delete this event', 403, 'FORBIDDEN');
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'DELETE event');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse('Authentication required to update event status', 401, 'UNAUTHORIZED');
  }

  try {
    const { status } = await request.json();

    if (!status) {
      return errorResponse('Status is required', 400, 'VALIDATION_ERROR');
    }

    const validStatuses = ['pending', 'approved', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return errorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, 'VALIDATION_ERROR');
    }

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    if (existingEvent.userId !== session.id) {
      return errorResponse('Only the event organizer can update event status', 403, 'FORBIDDEN');
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: { status: updatedEvent.status } });
  } catch (error) {
    return handleApiError(error, 'PUT event status');
  }
}
