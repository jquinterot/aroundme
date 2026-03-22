import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        user: { select: { id: true, name: true } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const isOwner = session.id === event.userId || session.role === 'admin';

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        ticketTypes: isOwner ? await prisma.ticketType.findMany({
          where: { eventId: id },
          orderBy: { price: 'asc' },
        }) : event.ticketTypes,
        isOwner,
      },
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, quantity, maxPerUser, saleStart, saleEnd } = body;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const isOwner = session.id === event.userId || session.role === 'admin';

    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: 'Only event owner can add ticket types' },
        { status: 403 }
      );
    }

    const ticketType = await prisma.ticketType.create({
      data: {
        eventId: id,
        name,
        description,
        price: parseFloat(price) || 0,
        quantity: parseInt(quantity) || 100,
        maxPerUser: parseInt(maxPerUser) || 10,
        saleStart: saleStart ? new Date(saleStart) : null,
        saleEnd: saleEnd ? new Date(saleEnd) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: ticketType,
      message: 'Ticket type created successfully',
    });
  } catch (error) {
    console.error('Error creating ticket type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket type' },
      { status: 500 }
    );
  }
}
