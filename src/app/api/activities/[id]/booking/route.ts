import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  try {
    const body = await request.json();
    const { guestName, guestEmail, guestPhone, tickets, notes } = body;

    if (!guestName || !guestEmail || !tickets) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    if (activity.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Activity is not available for booking' },
        { status: 400 }
      );
    }

    if (activity.capacity && activity.bookingCount + tickets > activity.capacity) {
      return NextResponse.json(
        { success: false, error: 'Not enough spots available' },
        { status: 400 }
      );
    }

    const subtotal = activity.isFree ? 0 : activity.price * tickets;
    const commissionAmount = subtotal * activity.commission;
    const total = subtotal + commissionAmount;

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
        subtotal,
        commission: commissionAmount,
        total,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
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
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}