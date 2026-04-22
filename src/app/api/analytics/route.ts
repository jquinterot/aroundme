import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse, successResponse } from '@/lib/api-utils';
import { getSession } from '@/lib/auth';

interface ClickEventData {
  type: string;
  itemId: string;
  source: string;
  metadata?: Record<string, unknown>;
}

interface InterestEventData {
  type: string;
  itemId: string;
  action: string;
  metadata?: Record<string, unknown>;
}

// POST /api/analytics/click - Track click events
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { type, itemId, source, metadata } = body as ClickEventData;

    if (!type || !itemId || !source) {
      return errorResponse('Missing required fields: type, itemId, source', 400, 'VALIDATION_ERROR');
    }

    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create click event
    await prisma.clickEvent.create({
      data: {
        userId: session?.id || null,
        sessionId: request.headers.get('x-session-id') || null,
        type,
        itemId,
        source,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress: clientIp,
        userAgent,
      },
    });

    // Update item viewCount based on type
    if (type === 'event') {
      await prisma.event.update({
        where: { id: itemId },
        data: { viewCount: { increment: 1 } },
      });
    } else if (type === 'place') {
      await prisma.place.update({
        where: { id: itemId },
        data: { viewCount: { increment: 1 } },
      });
    } else if (type === 'activity') {
      await prisma.activity.update({
        where: { id: itemId },
        data: { viewCount: { increment: 1 } },
      });
    }

    return successResponse({ tracked: true });
  } catch (error) {
    return handleApiError(error, 'POST /api/analytics/click');
  }
}

// POST /api/analytics/interest - Track interest events (save, RSVP, share)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { type, itemId, action, metadata } = body as InterestEventData;

    if (!type || !itemId || !action) {
      return errorResponse('Missing required fields: type, itemId, action', 400, 'VALIDATION_ERROR');
    }

    // Create interest event
    await prisma.interestEvent.create({
      data: {
        userId: session.id,
        type,
        itemId,
        action,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return successResponse({ tracked: true });
  } catch (error) {
    return handleApiError(error, 'PUT /api/analytics/interest');
  }
}
