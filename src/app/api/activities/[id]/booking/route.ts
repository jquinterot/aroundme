import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  try {
    const body = await request.json();
    const { guestName, guestEmail, guestPhone, tickets, notes } = body;

    if (!guestName) {
      return errorResponse('guestName is required', 400, 'MISSING_GUEST_NAME');
    }
    if (!guestEmail) {
      return errorResponse('guestEmail is required', 400, 'MISSING_GUEST_EMAIL');
    }
    if (!tickets) {
      return errorResponse('tickets is required', 400, 'MISSING_TICKETS');
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return errorResponse('Activity not found', 404, 'ACTIVITY_NOT_FOUND');
    }

    if (activity.status !== 'active') {
      return errorResponse('Activity is not available for booking', 400, 'ACTIVITY_NOT_AVAILABLE');
    }

    if (activity.capacity && activity.bookingCount + tickets > activity.capacity) {
      return errorResponse('Not enough spots available', 400, 'CAPACITY_EXCEEDED');
    }

    const total = activity.isFree ? 0 : activity.price * tickets;

    const booking = await prisma.activityBooking.create({
      data: {
        activityId: id,
        userId: session?.id || null,
        guestName,
        guestEmail,
        guestPhone,
        tickets,
        total,
        notes,
        status: 'pending',
      },
    });

    await prisma.activity.update({
      where: { id },
      data: { bookingCount: { increment: tickets } },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        total,
        status: booking.status,
      },
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/activities/[id]/booking');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const bookings = await prisma.activityBooking.findMany({
      where: { activityId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/activities/[id]/booking');
  }
}