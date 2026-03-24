import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }
    
    if (session.role !== 'admin') {
      return errorResponse('Admin access required', 403, 'FORBIDDEN');
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = status !== 'all' ? { status } : {};

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          city: { select: { name: true, slug: true } },
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { saves: true, rsvps: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, 'admin events list');
  }
}
