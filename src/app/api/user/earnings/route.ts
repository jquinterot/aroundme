import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, errorResponse } from '@/lib/api-utils';
import { BUSINESS_CONFIG } from '@/lib/config';

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('You must be logged in to view your earnings', 401, 'UNAUTHORIZED');
    }

    const orders = await prisma.order.findMany({
      where: {
        status: 'completed',
        items: {
          some: {
            ticketType: {
              event: {
                userId: session.id,
              },
            },
          },
        },
      },
      include: {
        items: {
          include: {
            ticketType: {
              include: {
                event: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let totalEarnings = 0;
    let pendingPayouts = 0;
    let completedPayouts = 0;
    let platformFees = 0;
    let totalOrders = 0;

    for (const order of orders) {
      const feePercent = BUSINESS_CONFIG.platformFeePercent;
      const payoutAmount = order.payoutAmount || (order.total * (1 - feePercent));
      const fee = order.platformFee || (order.total * feePercent);
      
      totalEarnings += payoutAmount;
      platformFees += fee;
      totalOrders += order.items.reduce((sum, item) => sum + item.quantity, 0);

      if (order.payoutStatus === 'transferred' || order.payoutStatus === 'paid_out') {
        completedPayouts += payoutAmount;
      } else if (order.payoutStatus === 'pending') {
        pendingPayouts += payoutAmount;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings,
        pendingPayouts,
        completedPayouts,
        totalOrders,
        platformFees,
        recentOrders: orders.slice(0, 10).map(order => ({
          id: order.id,
          eventTitle: order.items[0]?.ticketType?.event?.title || 'Unknown',
          total: order.total,
          payoutAmount: order.payoutAmount || (order.total * (1 - BUSINESS_CONFIG.platformFeePercent)),
          platformFee: order.platformFee || (order.total * BUSINESS_CONFIG.platformFeePercent),
          status: order.payoutStatus,
          createdAt: order.createdAt,
        })),
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/user/earnings');
  }
}
