import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const city = await prisma.city.findUnique({
      where: { slug },
    });

    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }

    const where: Record<string, unknown> = {
      cityId: city.id,
      status: 'active',
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { viewCount: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activity.count({ where }),
    ]);

    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      subcategory: activity.subcategory,
      cityId: activity.cityId,
      providerName: activity.providerName,
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
      viewCount: activity.viewCount,
      bookingCount: activity.bookingCount,
      createdAt: activity.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedActivities,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}