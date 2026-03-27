import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';
import { validateRequestBody, createEventValidationRules, formatValidationErrors } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequestBody(
      request,
      createEventValidationRules(),
      'POST /api/events'
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
      console.error(`[POST /api/events] City not found: ${data.citySlug}`);
      return errorResponse(
        `City "${data.citySlug}" not found. Please select a valid city.`,
        404,
        'CITY_NOT_FOUND'
      );
    }

    // Parse dates
    const startDate = data.startDate as string;
    const startTime = data.startTime as string;
    const dateStart = new Date(`${startDate}T${startTime}`);
    
    if (isNaN(dateStart.getTime())) {
      console.error(`[POST /api/events] Invalid date format: ${startDate}T${startTime}`);
      return errorResponse('Invalid start date or time format.', 400, 'INVALID_DATE');
    }

    const endDate = data.endDate as string | undefined;
    const endTime = data.endTime as string | undefined;
    const dateEnd = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;
    
    if (dateEnd && isNaN(dateEnd.getTime())) {
      console.error(`[POST /api/events] Invalid end date format: ${endDate}T${endTime}`);
      return errorResponse('Invalid end date or time format.', 400, 'INVALID_DATE');
    }

    if (dateEnd && dateEnd <= dateStart) {
      console.error(`[POST /api/events] Invalid date range: end (${dateEnd}) <= start (${dateStart})`);
      return errorResponse('End date must be after start date.', 400, 'INVALID_DATE_RANGE');
    }

    // Parse price
    const isFree = data.isFree as boolean;
    const price = data.price as number | undefined;
    const priceValue = isFree ? 0 : (price || 0);

    // Create event
    const event = await prisma.event.create({
      data: {
        title: (data.title as string).trim(),
        description: (data.description as string).trim(),
        category: data.category as string,
        cityId: city.id,
        venueName: (data.venueName as string).trim(),
        venueAddress: (data.venueAddress as string).trim(),
        venueLat: (data.venueLat as number) || city.lat,
        venueLng: (data.venueLng as number) || city.lng,
        dateStart,
        dateEnd,
        priceMin: priceValue,
        priceMax: priceValue,
        isFree,
        imageUrl: (data.imageUrl as string) || null,
        tags: (data.tags as string) || '',
        status: 'pending',
      },
    });

    console.log(`[POST /api/events] Event created successfully: ${event.id}`);

    return NextResponse.json({
      success: true,
      data: {
        id: event.id,
        title: event.title,
        status: event.status,
      },
      message: 'Event submitted successfully! It will be reviewed before publishing.',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/events');
  }
}
