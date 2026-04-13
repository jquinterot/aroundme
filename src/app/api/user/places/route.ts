import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('You must be logged in to view your places', 401, 'UNAUTHORIZED');
    }

    const places = await prisma.place.findMany({
      where: { ownerId: session.id },
      include: {
        city: { select: { name: true, slug: true } },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedPlaces = places.map((place) => ({
      id: place.id,
      name: place.name,
      description: place.description,
      category: place.category,
      city: place.city,
      address: place.address,
      rating: place.rating,
      reviewCount: place._count.reviews,
      image: place.imageUrl,
      isVerified: place.isVerified,
      isClaimed: place.isClaimed,
      createdAt: place.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: formattedPlaces });
  } catch (error) {
    return handleApiError(error, 'GET /api/user/places');
  }
}
