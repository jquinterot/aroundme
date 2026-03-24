import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }
    
    if (session.role !== 'admin') {
      return errorResponse('Admin access required', 403, 'FORBIDDEN');
    }

    const { id } = await params;
    const body = await request.json();
    const { action, ...data } = body;

    if (!action) {
      return errorResponse('Action is required', 400, 'MISSING_ACTION');
    }

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

    return errorResponse('Invalid action. Must be one of: approve, reject, feature, update', 400, 'INVALID_ACTION');
  } catch (error) {
    return handleApiError(error, 'admin event update');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }
    
    if (session.role !== 'admin') {
      return errorResponse('Admin access required', 403, 'FORBIDDEN');
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
    return handleApiError(error, 'admin event delete');
  }
}
