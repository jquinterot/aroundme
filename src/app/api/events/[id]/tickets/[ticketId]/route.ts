import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required to update ticket type', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;
    const body = await request.json();

    const ticketType = await prisma.ticketType.findUnique({
      where: { id },
      include: { event: { select: { userId: true } } },
    });

    if (!ticketType) {
      return errorResponse('Ticket type not found', 404, 'NOT_FOUND');
    }

    const isOwner = session.id === ticketType.event.userId || session.role === 'admin';

    if (!isOwner) {
      return errorResponse('Only the event organizer can update ticket types', 403, 'FORBIDDEN');
    }

    const updated = await prisma.ticketType.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price !== undefined ? parseFloat(body.price) : ticketType.price,
        quantity: body.quantity !== undefined ? parseInt(body.quantity) : ticketType.quantity,
        maxPerUser: body.maxPerUser !== undefined ? parseInt(body.maxPerUser) : ticketType.maxPerUser,
        saleStart: body.saleStart ? new Date(body.saleStart) : null,
        saleEnd: body.saleEnd ? new Date(body.saleEnd) : null,
        isActive: body.isActive !== undefined ? body.isActive : ticketType.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Ticket type updated',
    });
  } catch (error) {
    return handleApiError(error, 'PATCH ticket type');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required to delete ticket type', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;

    const ticketType = await prisma.ticketType.findUnique({
      where: { id },
      include: { 
        event: { select: { userId: true } },
        orderItems: { where: { order: { status: 'completed' } } },
      },
    });

    if (!ticketType) {
      return errorResponse('Ticket type not found', 404, 'NOT_FOUND');
    }

    const isOwner = session.id === ticketType.event.userId || session.role === 'admin';

    if (!isOwner) {
      return errorResponse('Only the event organizer can delete ticket types', 403, 'FORBIDDEN');
    }

    if (ticketType.orderItems.length > 0) {
      await prisma.ticketType.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: 'Ticket type deactivated (has existing orders)',
      });
    }

    await prisma.ticketType.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket type deleted',
    });
  } catch (error) {
    return handleApiError(error, 'DELETE ticket type');
  }
}
