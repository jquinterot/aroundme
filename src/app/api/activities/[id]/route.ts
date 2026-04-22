import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        city: { select: { name: true, slug: true, lat: true, lng: true, zoom: true } },
      },
    });

    if (!activity) {
      return errorResponse('Activity not found', 404, 'ACTIVITY_NOT_FOUND');
    }

    await prisma.activity.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        category: activity.category,
        subcategory: activity.subcategory,
        city: activity.city,
        providerName: activity.providerName,
        providerContact: activity.providerContact,
        address: activity.address,
        lat: activity.lat,
        lng: activity.lng,
        schedule: activity.schedule,
        scheduleDays: activity.scheduleDays ? JSON.parse(activity.scheduleDays) : null,
        scheduleTime: activity.scheduleTime,
        duration: activity.duration,
        capacity: activity.capacity,
        price: activity.price,
        currency: activity.currency,
        isFree: activity.isFree,
        image: activity.imageUrl,
        includes: activity.includes ? JSON.parse(activity.includes) : [],
        skillLevel: activity.skillLevel,
        status: activity.status,
        viewCount: activity.viewCount + 1,
        bookingCount: activity.bookingCount,
        createdAt: activity.createdAt.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/activities/[id]');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      citySlug,
      title,
      description,
      category,
      subcategory,
      providerName,
      providerContact,
      address,
      lat,
      lng,
      schedule,
      scheduleDays,
      scheduleTime,
      duration,
      capacity,
      price,
      isFree,
      imageUrl,
      includes,
      skillLevel,
    } = body;

    if (!citySlug) {
      return errorResponse('citySlug is required', 400, 'MISSING_CITY_SLUG');
    }
    if (!title) {
      return errorResponse('title is required', 400, 'MISSING_TITLE');
    }
    if (!description) {
      return errorResponse('description is required', 400, 'MISSING_DESCRIPTION');
    }
    if (!category) {
      return errorResponse('category is required', 400, 'MISSING_CATEGORY');
    }
    if (!providerName) {
      return errorResponse('providerName is required', 400, 'MISSING_PROVIDER_NAME');
    }

    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
    });

    if (!city) {
      return errorResponse(`City with slug '${citySlug}' not found`, 404, 'CITY_NOT_FOUND');
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        category,
        subcategory,
        cityId: city.id,
        providerName,
        providerContact,
        address: address || null,
        lat: lat || city.lat,
        lng: lng || city.lng,
        schedule: schedule || '',
        scheduleDays: scheduleDays ? JSON.stringify(scheduleDays) : null,
        scheduleTime,
        duration,
        capacity,
        price: price || 0,
        currency: 'COP',
        isFree: isFree || false,
        imageUrl,
        includes: includes ? JSON.stringify(includes) : null,
        skillLevel,
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/activities/[id]');
  }
}