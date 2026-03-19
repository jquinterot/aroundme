import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const FEATURED_TIERS = {
  basic: {
    durationDays: 7,
    priceUSD: 9.99,
    priceCOP: 45000,
    label: 'Destacado',
  },
  premium: {
    durationDays: 30,
    priceUSD: 24.99,
    priceCOP: 110000,
    label: 'Premium',
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { tier, userId } = body;

    if (!tier || !['basic', 'premium'].includes(tier)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tier. Must be "basic" or "premium"' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const tierConfig = FEATURED_TIERS[tier as keyof typeof FEATURED_TIERS];
    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + tierConfig.durationDays);

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        isFeatured: true,
        featuredUntil,
        featuredTier: tier,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        isFeatured: updatedEvent.isFeatured,
        featuredUntil: updatedEvent.featuredUntil,
        featuredTier: updatedEvent.featuredTier,
        tierInfo: tierConfig,
      },
      message: `Event featured as ${tierConfig.label} for ${tierConfig.durationDays} days`,
    });
  } catch (error) {
    console.error('Error featuring event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to feature event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        isFeatured: false,
        featuredUntil: null,
        featuredTier: 'none',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        isFeatured: updatedEvent.isFeatured,
        featuredUntil: null,
        featuredTier: 'none',
      },
      message: 'Feature removed from event',
    });
  } catch (error) {
    console.error('Error removing feature:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove feature' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      tiers: FEATURED_TIERS,
    },
  });
}
