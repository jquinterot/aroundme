import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required to fetch tickets', 401, 'UNAUTHORIZED');
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
      return errorResponse('Event not found', 404, 'NOT_FOUND');
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
    return handleApiError(error, 'GET event tickets');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required to create ticket type', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, quantity, maxPerUser, saleStart, saleEnd } = body;

    if (!name) {
      return errorResponse('Ticket type name is required', 400, 'VALIDATION_ERROR');
    }

    const event = await prisma.event.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!event) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    const isOwner = session.id === event.userId || session.role === 'admin';

    if (!isOwner) {
      return errorResponse('Only the event organizer can add ticket types', 403, 'FORBIDDEN');
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
    return handleApiError(error, 'POST create ticket type');
  }
}
