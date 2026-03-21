import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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
    console.error('Error cleaning up events:', error);
    return NextResponse.json({ success: false, error: 'Failed to clean up events' }, { status: 500 });
  }
}
