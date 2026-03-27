import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';
import { validateRequestBody, createPlaceValidationRules, formatValidationErrors } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequestBody(
      request,
      createPlaceValidationRules(),
      'POST /api/places'
    );

    if (!validation.success) {
      return errorResponse(
        formatValidationErrors(validation.errors),
        400,
        'VALIDATION_ERROR'
      );
    }

    const data = validation.data;

    // Check if city exists
    const city = await prisma.city.findUnique({
      where: { slug: data.citySlug as string },
    });

    if (!city) {
      console.error(`[POST /api/places] City not found: ${data.citySlug}`);
      return errorResponse(
        `City "${data.citySlug}" not found. Please select a valid city.`,
        404,
        'CITY_NOT_FOUND'
      );
    }

    // Create place
    const place = await prisma.place.create({
      data: {
        name: (data.name as string).trim(),
        description: (data.description as string).trim(),
        category: data.category as string,
        cityId: city.id,
        address: (data.address as string).trim(),
        lat: (data.lat as number) || city.lat,
        lng: (data.lng as number) || city.lng,
        contactWebsite: (data.website as string) || null,
        contactInstagram: (data.instagram as string) || null,
        features: (data.features as string) || '',
        imageUrl: (data.imageUrl as string) || null,
        isVerified: false,
        isClaimed: false,
      },
    });

    console.log(`[POST /api/places] Place created successfully: ${place.id}`);

    return NextResponse.json({
      success: true,
      data: {
        id: place.id,
        name: place.name,
        isVerified: place.isVerified,
      },
      message: 'Place submitted! It will be reviewed before appearing in search results.',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/places');
  }
}
