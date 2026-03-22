import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
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
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, itemId, reason, description } = body;

    if (!type || !itemId || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { success: false, error: 'You have already reported this item' },
        { status: 400 }
      );
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
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
