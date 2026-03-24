import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }
    
    if (session.role !== 'admin') {
      return errorResponse('Admin access required', 403, 'FORBIDDEN');
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalEvents,
      totalPlaces,
      totalReviews,
      pendingEvents,
      pendingReports,
      recentSignups,
      eventsThisMonth,
      placesThisMonth,
      ordersThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.place.count(),
      prisma.review.count(),
      prisma.event.count({ where: { status: 'pending' } }),
      prisma.adminReport.count({ where: { status: 'pending' } }),
      prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.event.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.place.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count({ where: { 
        createdAt: { gte: startOfMonth },
        status: 'completed',
      } }),
    ]);

    const recentActivity = await Promise.all([
      prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { city: { select: { name: true } } },
      }),
      prisma.place.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { city: { select: { name: true } } },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalEvents,
          totalPlaces,
          totalReviews,
          pendingEvents,
          pendingReports,
          recentSignups,
          eventsThisMonth,
          placesThisMonth,
          ordersThisMonth,
        },
        recentActivity: {
          events: recentActivity[0],
          places: recentActivity[1],
          users: recentActivity[2],
        },
      },
    });
  } catch (error) {
    return handleApiError(error, 'admin stats');
  }
}
