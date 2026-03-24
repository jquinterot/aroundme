import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      citySlug,
      name,
      description,
      category,
      address,
      lat,
      lng,
      website,
      instagram,
      features,
      imageUrl,
    } = body;

    if (!citySlug || !name || !description || !category || !address) {
      return errorResponse('Please fill in all required fields: city, name, description, category, and address.', 400, 'VALIDATION_ERROR');
    }

    if (name.trim().length < 2) {
      return errorResponse('Place name must be at least 2 characters.', 400, 'INVALID_NAME');
    }

    if (description.trim().length < 10) {
      return errorResponse('Description must be at least 10 characters.', 400, 'INVALID_DESCRIPTION');
    }

    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
    });

    if (!city) {
      return errorResponse(`City "${citySlug}" not found. Please select a valid city.`, 404, 'CITY_NOT_FOUND');
    }

    if (website && !website.match(/^https?:\/\/.+/)) {
      return errorResponse('Website must be a valid URL starting with http:// or https://', 400, 'INVALID_WEBSITE');
    }

    if (instagram && !instagram.match(/^@?[\w]{1,30}$/)) {
      return errorResponse('Instagram handle must be valid (e.g., @username)', 400, 'INVALID_INSTAGRAM');
    }

    const place = await prisma.place.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        category,
        cityId: city.id,
        address: address.trim(),
        lat: lat || city.lat,
        lng: lng || city.lng,
        contactWebsite: website || null,
        contactInstagram: instagram || null,
        features: features || '',
        imageUrl: imageUrl || null,
        isVerified: false,
        isClaimed: false,
      },
    });

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
