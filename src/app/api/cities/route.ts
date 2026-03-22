import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country, slug, lat, lng } = body;

    if (!name || !country || !slug || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existing = await prisma.city.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'City with this slug already exists' },
        { status: 400 }
      );
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
    console.error('Error creating city:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create city' },
      { status: 500 }
    );
  }
}
