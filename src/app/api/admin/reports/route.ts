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
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status !== 'all') where.status = status;
    if (type) where.type = type;

    const [reports, total] = await Promise.all([
      prisma.adminReport.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.adminReport.count({ where }),
    ]);

    const enrichedReports = await Promise.all(reports.map(async (report) => {
      let itemTitle = 'Unknown';
      if (report.type === 'event') {
        const item = await prisma.event.findUnique({
          where: { id: report.itemId },
          select: { title: true },
        });
        itemTitle = item?.title || 'Unknown';
      } else if (report.type === 'place') {
        const item = await prisma.place.findUnique({
          where: { id: report.itemId },
          select: { name: true },
        });
        itemTitle = item?.name || 'Unknown';
      } else if (report.type === 'review') {
        const item = await prisma.review.findUnique({
          where: { id: report.itemId },
          include: { place: { select: { name: true } } },
        });
        itemTitle = `Review on ${item?.place?.name || 'Unknown'}`;
      }
      return { ...report, itemTitle };
    }));

    return NextResponse.json({
      success: true,
      data: enrichedReports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, 'admin reports list');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { type, itemId, reason, description } = body;

    if (!type) {
      return errorResponse('Report type is required', 400, 'MISSING_TYPE');
    }
    if (!itemId) {
      return errorResponse('Item ID is required', 400, 'MISSING_ITEM_ID');
    }
    if (!reason) {
      return errorResponse('Reason is required', 400, 'MISSING_REASON');
    }
    if (type !== 'event' && type !== 'place' && type !== 'review' && type !== 'user') {
      return errorResponse('Type must be one of: event, place, review, user', 400, 'INVALID_TYPE');
    }

    const existingReport = await prisma.adminReport.findFirst({
      where: {
        reporterId: session.id,
        itemId,
        type,
        status: 'pending',
      },
    });

    if (existingReport) {
      return errorResponse('You have already reported this item', 400, 'DUPLICATE_REPORT');
    }

    const report = await prisma.adminReport.create({
      data: {
        reporterId: session.id,
        type,
        itemId,
        reason,
        description,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      data: report,
    });
  } catch (error) {
    return handleApiError(error, 'admin report create');
  }
}
