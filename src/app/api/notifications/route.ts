import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { Notification } from '@prisma/client';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Unauthorized - please log in to view notifications', 401, 'AUTH_REQUIRED');
    }

    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = { userId: user.id };
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    const formattedNotifications = notifications.map((n: Notification) => ({
      id: n.id,
      userId: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      isRead: n.isRead,
      data: n.data ? JSON.parse(n.data) : null,
      createdAt: n.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedNotifications,
      unreadCount,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/notifications');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('Unauthorized - please log in to update notifications', 401, 'AUTH_REQUIRED');
    }

    const { notificationId, markAllRead } = await request.json();

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true },
      });
    } else if (notificationId) {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification || notification.userId !== user.id) {
        return errorResponse('Notification not found or access denied', 404, 'NOTIFICATION_NOT_FOUND');
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/notifications');
  }
}
