import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
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

    const ticketType = await prisma.ticketType.findUnique({
      where: { id },
      include: { event: { select: { userId: true } } },
    });

    if (!ticketType) {
      return NextResponse.json(
        { success: false, error: 'Ticket type not found' },
        { status: 404 }
      );
    }

    const isOwner = session.id === ticketType.event.userId || session.role === 'admin';

    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: 'Only event owner can update ticket types' },
        { status: 403 }
      );
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
    console.error('Error updating ticket type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const ticketType = await prisma.ticketType.findUnique({
      where: { id },
      include: { 
        event: { select: { userId: true } },
        orderItems: { where: { order: { status: 'completed' } } },
      },
    });

    if (!ticketType) {
      return NextResponse.json(
        { success: false, error: 'Ticket type not found' },
        { status: 404 }
      );
    }

    const isOwner = session.id === ticketType.event.userId || session.role === 'admin';

    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: 'Only event owner can delete ticket types' },
        { status: 403 }
      );
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
    console.error('Error deleting ticket type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ticket type' },
      { status: 500 }
    );
  }
}
