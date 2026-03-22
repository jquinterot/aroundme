import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'approve') {
      const event = await prisma.event.update({
        where: { id },
        data: { status: 'approved' },
      });

      if (event.userId) {
        await createNotification({
          userId: event.userId,
          type: 'event_approved',
          title: 'Event Approved',
          message: `Your event "${event.title}" has been approved and is now visible to everyone.`,
          link: `/event/${event.id}`,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Event approved successfully',
        data: { status: event.status },
      });
    }

    if (action === 'reject') {
      const { reason } = body;
      const event = await prisma.event.update({
        where: { id },
        data: { status: 'rejected' },
      });

      if (event.userId) {
        await createNotification({
          userId: event.userId,
          type: 'event_rejected',
          title: 'Event Rejected',
          message: `Your event "${event.title}" was not approved. ${reason || 'Please review our guidelines and try again.'}`,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Event rejected',
        data: { status: event.status },
      });
    }

    if (action === 'feature') {
      const { tier, days } = body;
      const featuredUntil = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null;
      
      const event = await prisma.event.update({
        where: { id },
        data: {
          isFeatured: tier !== 'none',
          featuredTier: tier,
          featuredUntil,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Event ${tier === 'none' ? 'unfeatured' : `featured as ${tier}`}`,
        data: { isFeatured: event.isFeatured, featuredTier: event.featuredTier },
      });
    }

    if (action === 'update') {
      const event = await prisma.event.update({
        where: { id },
        data,
      });

      return NextResponse.json({
        success: true,
        message: 'Event updated',
        data: event,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
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
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
