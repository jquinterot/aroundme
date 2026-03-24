import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

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
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Authentication required to feature events', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { tier } = body;

    if (!tier) {
      return errorResponse('Tier is required (basic or premium)', 400, 'VALIDATION_ERROR');
    }

    const validTiers = ['basic', 'premium'];
    if (!validTiers.includes(tier)) {
      return errorResponse(`Invalid tier. Must be one of: ${validTiers.join(', ')}`, 400, 'VALIDATION_ERROR');
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    if (event.userId !== user.id) {
      return errorResponse('You can only feature your own events', 403, 'FORBIDDEN');
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
    return handleApiError(error, 'POST feature event');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Authentication required to remove event feature', 401, 'UNAUTHORIZED');
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return errorResponse('Event not found', 404, 'NOT_FOUND');
    }

    if (event.userId !== user.id) {
      return errorResponse('You can only remove features from your own events', 403, 'FORBIDDEN');
    }

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
    return handleApiError(error, 'DELETE feature event');
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
