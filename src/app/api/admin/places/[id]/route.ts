import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating place:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update place' },
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

    await prisma.place.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Place deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting place:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete place' },
      { status: 500 }
    );
  }
}
