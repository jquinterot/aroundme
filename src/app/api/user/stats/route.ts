import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('Debes iniciar sesión para ver tus estadísticas', 401, 'UNAUTHORIZED');
    }

    const userId = session.id;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRsvps,
      totalSavedEvents,
      totalReviews,
      totalCheckIns,
      totalViews,
      totalFollowers,
      totalFollowing,
      eventsAttended,
      placesVisited,
      recentRsvps,
      rsvpStats,
    ] = await Promise.all([
      prisma.rSVP.count({ where: { userId } }),
      prisma.save.count({ where: { userId } }),
      prisma.review.count({ where: { userId } }),
      prisma.checkIn.count({ where: { userId } }),
      prisma.viewHistory.count({ where: { userId } }),
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
      prisma.rSVP.count({ 
        where: { 
          userId, 
          status: 'going',
          event: { dateStart: { lt: now } }
        } 
      }),
      prisma.checkIn.count({ where: { userId } }),
      prisma.rSVP.findMany({
        where: { userId },
        include: { event: { select: { id: true, title: true, dateStart: true, category: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.rSVP.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
    ]);

    const categoryBreakdown = await prisma.rSVP.findMany({
      where: { userId, status: 'going' },
      include: { event: { select: { category: true } } },
    });

    const categoryCounts = categoryBreakdown.reduce<Record<string, number>>((acc, rsvp) => {
      const cat = rsvp.event.category;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const rsvpByStatus = rsvpStats.reduce<Record<string, number>>((acc, stat) => {
      acc[stat.status] = stat._count;
      return acc;
    }, { going: 0, interested: 0, maybe: 0 });

    const [
      eventsThisMonth,
      viewsThisMonth,
      reviewsThisMonth,
    ] = await Promise.all([
      prisma.rSVP.count({ 
        where: { 
          userId, 
          createdAt: { gte: thirtyDaysAgo },
          status: 'going',
        } 
      }),
      prisma.viewHistory.count({ 
        where: { 
          userId, 
          createdAt: { gte: thirtyDaysAgo } 
        } 
      }),
      prisma.review.count({ 
        where: { 
          userId, 
          createdAt: { gte: thirtyDaysAgo } 
        } 
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRsvps,
          totalSavedEvents,
          totalReviews,
          totalCheckIns,
          totalViews,
          totalFollowers,
          totalFollowing,
          eventsAttended,
          placesVisited,
        },
        engagement: {
          rsvpByStatus,
          categoryBreakdown,
          recentRsvps: recentRsvps.map((r: { event: { id: string; title: string; category: string; dateStart: Date }; status: string }) => ({
            id: r.event.id,
            title: r.event.title,
            category: r.event.category,
            date: r.event.dateStart.toISOString(),
            status: r.status,
          })),
        },
        trends: {
          eventsThisMonth,
          viewsThisMonth,
          reviewsThisMonth,
        },
        insights: {
          favoriteCategory: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
          totalCategories: Object.keys(categoryCounts).length,
          avgEventsPerMonth: eventsThisMonth > 0 ? (eventsThisMonth / 1).toFixed(1) : '0',
        },
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/user/stats');
  }
}
