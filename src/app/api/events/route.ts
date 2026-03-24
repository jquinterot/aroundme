import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      citySlug,
      title,
      description,
      category,
      venueName,
      venueAddress,
      venueLat,
      venueLng,
      startDate,
      startTime,
      endDate,
      endTime,
      isFree,
      price,
      imageUrl,
      tags,
    } = body;

    if (!citySlug || !title || !description || !category || !venueName || !venueAddress || !startDate || !startTime) {
      return errorResponse('Please fill in all required fields: city, title, description, category, venue name, venue address, start date, and start time.', 400, 'VALIDATION_ERROR');
    }

    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
    });

    if (!city) {
      return errorResponse(`City "${citySlug}" not found. Please select a valid city.`, 404, 'CITY_NOT_FOUND');
    }

    const dateStart = new Date(`${startDate}T${startTime}`);
    if (isNaN(dateStart.getTime())) {
      return errorResponse('Invalid start date or time format.', 400, 'INVALID_DATE');
    }

    const dateEnd = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;
    if (dateEnd && isNaN(dateEnd.getTime())) {
      return errorResponse('Invalid end date or time format.', 400, 'INVALID_DATE');
    }

    if (dateEnd && dateEnd <= dateStart) {
      return errorResponse('End date must be after start date.', 400, 'INVALID_DATE_RANGE');
    }

    const priceValue = isFree ? 0 : (price ? parseFloat(price) : 0);
    if (!isFree && isNaN(priceValue)) {
      return errorResponse('Invalid price value.', 400, 'INVALID_PRICE');
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        cityId: city.id,
        venueName: venueName.trim(),
        venueAddress: venueAddress.trim(),
        venueLat: venueLat || city.lat,
        venueLng: venueLng || city.lng,
        dateStart,
        dateEnd,
        priceMin: priceValue,
        priceMax: priceValue,
        isFree,
        imageUrl: imageUrl || null,
        tags: tags || '',
        status: 'pending',
      },
    });

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
