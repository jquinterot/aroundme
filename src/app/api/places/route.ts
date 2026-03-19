import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const place = await prisma.place.create({
      data: {
        name,
        description,
        category,
        cityId: city.id,
        address,
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
      message: 'Place submitted successfully and is pending review',
    });
  } catch (error) {
    console.error('Error creating place:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create place' },
      { status: 500 }
    );
  }
}
