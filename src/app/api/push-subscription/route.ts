import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Unauthorized', 401, 'AUTH_REQUIRED');
    }

    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint) {
      return errorResponse('endpoint es requerido', 400, 'MISSING_ENDPOINT');
    }
    if (!keys?.p256dh) {
      return errorResponse('keys.p256dh es requerido', 400, 'MISSING_P256DH');
    }
    if (!keys?.auth) {
      return errorResponse('keys.auth es requerido', 400, 'MISSING_AUTH');
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId: session.id,
        keys: JSON.stringify(keys),
      },
      create: {
        userId: session.id,
        endpoint,
        keys: JSON.stringify(keys),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Push subscription saved',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/push-subscription');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Unauthorized', 401, 'AUTH_REQUIRED');
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return errorResponse('endpoint es requerido para eliminar la suscripción', 400, 'MISSING_ENDPOINT');
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint, userId: session.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Push subscription removed',
    });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/push-subscription');
  }
}

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Unauthorized', 401, 'AUTH_REQUIRED');
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: session.id },
      select: { endpoint: true, keys: true },
    });

    return NextResponse.json({
      success: true,
      data: subscriptions.map(sub => ({
        endpoint: sub.endpoint,
        keys: JSON.parse(sub.keys),
      })),
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/push-subscription');
  }
}
