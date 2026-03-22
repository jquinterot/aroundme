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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            ticketType: {
              include: {
                event: {
                  select: {
                    id: true,
                    title: true,
                    dateStart: true,
                    venueName: true,
                    venueAddress: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.userId !== session.id && session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        status: order.status,
        total: order.total,
        currency: order.currency,
        email: order.email,
        name: order.name,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          priceAtTime: item.priceAtTime,
          ticketType: {
            name: item.ticketType.name,
            event: {
              id: item.ticketType.event.id,
              title: item.ticketType.event.title,
              dateStart: item.ticketType.event.dateStart.toISOString(),
              venueName: item.ticketType.event.venueName,
              venueAddress: item.ticketType.event.venueAddress,
            },
          },
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
