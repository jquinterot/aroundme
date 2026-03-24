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
    const verified = searchParams.get('verified');
    const claimed = searchParams.get('claimed');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (verified !== null) where.isVerified = verified === 'true';
    if (claimed !== null) where.isClaimed = claimed === 'true';

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        include: {
          city: { select: { name: true, slug: true } },
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.place.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: places,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, 'admin places list');
  }
}
