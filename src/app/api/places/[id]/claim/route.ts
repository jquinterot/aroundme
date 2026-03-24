import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse('You must be logged in to claim a place', 401, 'UNAUTHORIZED');
  }

  try {
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return errorResponse('Place not found', 404, 'PLACE_NOT_FOUND');
    }

    if (place.ownerId) {
      return errorResponse('This place is already claimed by another user', 400, 'PLACE_ALREADY_CLAIMED');
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
    return handleApiError(error, 'POST /api/places/[id]/claim');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse('You must be logged in to unclaim a place', 401, 'UNAUTHORIZED');
  }

  try {
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return errorResponse('Place not found', 404, 'PLACE_NOT_FOUND');
    }

    if (place.ownerId !== session.id) {
      return errorResponse('Forbidden - you do not own this place', 403, 'FORBIDDEN');
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
    return handleApiError(error, 'DELETE /api/places/[id]/claim');
  }
}
