import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return errorResponse('Unauthorized - invalid or missing cron secret', 401, 'UNAUTHORIZED');
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expiredEvents = await prisma.event.findMany({
      where: {
        dateEnd: { lt: thirtyDaysAgo },
        status: 'approved',
      },
      select: { id: true, title: true },
    });

    const expiredCount = expiredEvents.length;

    if (expiredCount > 0) {
      await prisma.event.deleteMany({
        where: {
          dateEnd: { lt: thirtyDaysAgo },
          status: 'approved',
        },
      });
    }

    const cancelledExpired = await prisma.event.findMany({
      where: {
        dateStart: { lt: thirtyDaysAgo },
        status: { in: ['pending', 'cancelled'] },
      },
      select: { id: true, title: true },
    });

    const cancelledCount = cancelledExpired.length;

    if (cancelledCount > 0) {
      await prisma.event.deleteMany({
        where: {
          dateStart: { lt: thirtyDaysAgo },
          status: { in: ['pending', 'cancelled'] },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        expiredDeleted: expiredCount,
        cancelledDeleted: cancelledCount,
        totalDeleted: expiredCount + cancelledCount,
      },
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/cron/cleanup');
  }
}
