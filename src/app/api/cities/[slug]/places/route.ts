import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Place } from '@prisma/client';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const pageStr = searchParams.get('page');
  const limitStr = searchParams.get('limit');

  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = limitStr ? parseInt(limitStr, 10) : 20;

  if (isNaN(page) || page < 1) {
    return errorResponse('Page must be a positive number', 400, 'INVALID_PAGE');
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return errorResponse('Limit must be a number between 1 and 100', 400, 'INVALID_LIMIT');
  }

  if (category && typeof category !== 'string') {
    return errorResponse('Category must be a string', 400, 'INVALID_CATEGORY');
  }

  if (search && typeof search !== 'string') {
    return errorResponse('Search must be a string', 400, 'INVALID_SEARCH');
  }

  try {
    const cityRecord = await prisma.city.findUnique({
      where: { slug },
    });

    if (!cityRecord) {
      return errorResponse(`City with slug '${slug}' not found`, 404, 'CITY_NOT_FOUND');
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

    const formattedPlaces = places.map((place: Place) => ({
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
    return handleApiError(error, 'GET /api/cities/[slug]/places');
  }
}
