import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'You must be logged in to claim a place' }, { status: 401 });
  }

  try {
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return NextResponse.json({ success: false, error: 'Place not found' }, { status: 404 });
    }

    if (place.ownerId) {
      return NextResponse.json({ success: false, error: 'This place is already claimed' }, { status: 400 });
    }

    const updatedPlace = await prisma.place.update({
      where: { id },
      data: {
        ownerId: session.id,
        isClaimed: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPlace.id,
        isClaimed: updatedPlace.isClaimed,
        ownerId: updatedPlace.ownerId,
      },
    });
  } catch (error) {
    console.error('Error claiming place:', error);
    return NextResponse.json({ success: false, error: 'Failed to claim place' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'You must be logged in' }, { status: 401 });
  }

  try {
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return NextResponse.json({ success: false, error: 'Place not found' }, { status: 404 });
    }

    if (place.ownerId !== session.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const updatedPlace = await prisma.place.update({
      where: { id },
      data: {
        ownerId: null,
        isClaimed: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPlace.id,
        isClaimed: updatedPlace.isClaimed,
      },
    });
  } catch (error) {
    console.error('Error unclaiming place:', error);
    return NextResponse.json({ success: false, error: 'Failed to unclaim place' }, { status: 500 });
  }
}
