import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return errorResponse('Place not found', 404, 'NOT_FOUND');
    }

    const formattedPlace = {
      id: place.id,
      name: place.name,
      description: place.description,
      category: place.category,
      cityId: place.cityId,
      address: place.address,
      coordinates: { lat: place.lat, lng: place.lng },
      image: place.imageUrl,
      rating: place.rating,
      reviewCount: place.reviewCount,
      priceRange: place.priceRange,
      isVerified: place.isVerified,
      isClaimed: place.isClaimed,
      ownerId: place.ownerId,
      features: place.features.split(',').filter(Boolean),
      tags: place.tags.split(',').filter(Boolean),
      contact: {
        phone: place.contactPhone,
        website: place.contactWebsite,
        instagram: place.contactInstagram,
      },
      createdAt: place.createdAt.toISOString(),
      updatedAt: place.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: formattedPlace });
  } catch (error) {
    return handleApiError(error, 'GET /api/places/[id]');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse('Unauthorized - you must be logged in to update a place', 401, 'UNAUTHORIZED');
  }

  try {
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return errorResponse('Place not found', 404, 'PLACE_NOT_FOUND');
    }

    if (place.ownerId !== session.id) {
      return errorResponse('Forbidden - you do not own this place', 403, 'FORBIDDEN');
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      address,
      lat,
      lng,
      imageUrl,
      priceRange,
      features,
      tags,
      contactPhone,
      contactWebsite,
      contactInstagram,
    } = body;

    const updatedPlace = await prisma.place.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(address !== undefined && { address }),
        ...(lat !== undefined && { lat }),
        ...(lng !== undefined && { lng }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(priceRange !== undefined && { priceRange }),
        ...(features !== undefined && { features }),
        ...(tags !== undefined && { tags }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(contactWebsite !== undefined && { contactWebsite }),
        ...(contactInstagram !== undefined && { contactInstagram }),
      },
    });

    return NextResponse.json({ success: true, data: updatedPlace });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/places/[id]');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return errorResponse('Unauthorized - you must be logged in to delete a place', 401, 'UNAUTHORIZED');
  }

  try {
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return errorResponse('Place not found', 404, 'PLACE_NOT_FOUND');
    }

    if (place.ownerId !== session.id) {
      return errorResponse('Forbidden - you do not own this place', 403, 'FORBIDDEN');
    }

    await prisma.place.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/places/[id]');
  }
}
