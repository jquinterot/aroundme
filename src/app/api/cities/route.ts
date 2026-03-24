import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/cities');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country, slug, lat, lng } = body;

    if (!name) {
      return errorResponse('name is required', 400, 'MISSING_NAME');
    }
    if (!country) {
      return errorResponse('country is required', 400, 'MISSING_COUNTRY');
    }
    if (!slug) {
      return errorResponse('slug is required', 400, 'MISSING_SLUG');
    }
    if (lat === undefined) {
      return errorResponse('lat is required', 400, 'MISSING_LAT');
    }
    if (lng === undefined) {
      return errorResponse('lng is required', 400, 'MISSING_LNG');
    }

    const existing = await prisma.city.findUnique({
      where: { slug },
    });

    if (existing) {
      return errorResponse(`City with slug '${slug}' already exists`, 400, 'CITY_EXISTS');
    }

    const city = await prisma.city.create({
      data: {
        name,
        country,
        slug,
        lat,
        lng,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: city,
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/cities');
  }
}
