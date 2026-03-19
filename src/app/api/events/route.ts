import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
    });

    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }

    const dateStart = new Date(`${startDate}T${startTime}`);
    const dateEnd = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

    const priceValue = isFree ? 0 : (price ? parseFloat(price) : 0);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        cityId: city.id,
        venueName,
        venueAddress,
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
      message: 'Event submitted successfully and is pending review',
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
