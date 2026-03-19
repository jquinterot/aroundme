import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return NextResponse.json({ success: false, error: 'Place not found' }, { status: 404 });
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
    console.error('Error fetching place:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch place' }, { status: 500 });
  }
}
