import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const cityRecord = await prisma.city.findUnique({
      where: { slug },
    });

    if (!cityRecord) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    const where: Record<string, unknown> = { cityId: cityRecord.id };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        orderBy: { rating: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.place.count({ where }),
    ]);

    const formattedPlaces = places.map((place) => ({
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
      features: place.features.split(',').filter(Boolean),
      tags: place.tags.split(',').filter(Boolean),
      contact: {
        phone: place.contactPhone,
        website: place.contactWebsite,
        instagram: place.contactInstagram,
      },
      createdAt: place.createdAt.toISOString(),
      updatedAt: place.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedPlaces,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch places' }, { status: 500 });
  }
}
