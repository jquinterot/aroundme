import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        city: { select: { name: true, slug: true } },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
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
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    );
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

    if (!citySlug || !title || !description || !category || !providerName) {
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

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        category,
        subcategory,
        cityId: city.id,
        providerName,
        providerContact,
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
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}