import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
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
    console.error('Error fetching user places:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch places' }, { status: 500 });
  }
}
