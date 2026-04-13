import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, requireAuth } from '@/lib/api-utils';

export async function GET() {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const places = await prisma.place.findMany({
      where: { ownerId: auth.user.id },
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
