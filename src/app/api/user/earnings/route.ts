import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Please login to continue' },
        { status: 401 }
      );
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
      const payoutAmount = order.payoutAmount || (order.total * 0.9);
      const fee = order.platformFee || (order.total * 0.1);
      
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
          payoutAmount: order.payoutAmount || (order.total * 0.9),
          platformFee: order.platformFee || (order.total * 0.1),
          status: order.payoutStatus,
          createdAt: order.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}
