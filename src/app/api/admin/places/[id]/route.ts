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

    if (action === 'verify') {
      const place = await prisma.place.update({
        where: { id },
        data: { isVerified: true },
      });

      if (place.ownerId) {
        await import('@/lib/notifications').then(({ createNotification }) =>
          createNotification({
            userId: place.ownerId!,
            type: 'venue_update',
            title: 'Place Verified',
            message: `Your place "${place.name}" has been verified!`,
            link: `/place/${place.id}`,
          })
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Place verified',
        data: { isVerified: place.isVerified },
      });
    }

    if (action === 'unverify') {
      const place = await prisma.place.update({
        where: { id },
        data: { isVerified: false },
      });

      return NextResponse.json({
        success: true,
        message: 'Place unverified',
        data: { isVerified: place.isVerified },
      });
    }

    if (action === 'update') {
      const place = await prisma.place.update({
        where: { id },
        data,
      });

      return NextResponse.json({
        success: true,
        message: 'Place updated',
        data: place,
      });
    }

    return errorResponse('Invalid action. Must be one of: verify, unverify, update', 400, 'INVALID_ACTION');
  } catch (error) {
    return handleApiError(error, 'admin place update');
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

    await prisma.place.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Place deleted successfully',
    });
  } catch (error) {
    return handleApiError(error, 'admin place delete');
  }
}
