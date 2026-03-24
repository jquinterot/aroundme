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
      return errorResponse('Unauthorized - please log in to view this order', 401, 'AUTH_REQUIRED');
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
      return errorResponse('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    if (order.userId !== session.id && session.role !== 'admin') {
      return errorResponse('Access denied - you do not have permission to view this order', 403, 'ACCESS_DENIED');
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
    return handleApiError(error, 'GET /api/orders/[id]');
  }
}
